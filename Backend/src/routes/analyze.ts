import express from "express";
import multer from "multer";
import { parse } from "csv-parse/sync";
import fs from "fs";
import { execSync } from "child_process";
import path from "path";

import { evaluateLog } from "../detection/detectionEngine";
import { runMLModel } from "../ml/runModel";
import { queryVirusTotal } from "../detection/vt"; // 🔥 NEW

const router = express.Router();
const upload = multer();

/*
🔥 Extract SHA256 from hash string
*/
function extractSHA256(hashString: string): string | null {
  const match = hashString?.match(/SHA256=([A-Fa-f0-9]+)/);
  return match ? match[1] : null;
}

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const timings: any = {};
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const t0 = Date.now();
    const content = file.buffer.toString("utf-8");
    timings.ingestion = (Date.now() - t0) / 1000;

    const t1 = Date.now();
    let logs = parseCSV(content);

    console.log("Sample parsed log:", logs[0]);

    const isRawSysmon =
      logs.length > 0 &&
      !logs[0]["Process Name"] &&
      !logs[0]["Process Name (Image)"];

    if (isRawSysmon) {
      console.log("Detected RAW Sysmon logs → using Python preprocessing...");

      const inputPath = path.join(__dirname, "../../temp_input.csv");
      const outputPath = path.join(__dirname, "../../temp_preprocessed.csv");
      const scriptPath = path.join(__dirname, "../../preprocessLogs.py");

      fs.writeFileSync(inputPath, content);

      console.log("Running Python script...");

      execSync(
        `python "${scriptPath}" "${inputPath}" "${outputPath}"`,
        { stdio: "inherit" }
      );

      console.log("Python preprocessing completed!");

      const processedContent = fs.readFileSync(outputPath, "utf-8");
      logs = parseCSV(processedContent);

      console.log("Sample AFTER preprocessing:", logs[0]);
    }

    timings.parsing = (Date.now() - t1) / 1000;

    /*
    ==========================
    IOC ENGINE
    ==========================
    */
    const t_ioc = Date.now();

    const evaluated = logs.map((log) => evaluateLog(log));

    timings.ioc = (Date.now() - t_ioc) / 1000;

    /*
    ==========================
    RULE PROCESSING
    ==========================
    */
    const t_rules = Date.now();

    const processedLogs = evaluated.map(({ result, iocs }, index) => {
      const log: any = logs[index];

      const triggeredRules = Object.entries(result)
        .filter(([, fired]) => fired)
        .map(([ruleId]) => ruleId.replaceAll("_", " "));

      const extractUser = (log: any) => {
        return (
          log["User / Integrity Level"] ||
          log["User"] ||
          log["UserName"] ||
          log["Account Name"] ||
          "Unknown"
        );
      };

      const cleanHashes = (value: string) => {
        if (!value) return "Unknown";
        return value.replace(/^"+|"+$/g, "").trim();
      };

      return {
        ...log,

        "Date and Time": log["Date and Time"] || log["UtcTime"],
        "Event ID": log["Event ID"] || log["EventId"],

        "Process Name (Image)": iocs.processName,
        "Parent Process Name": iocs.parentProcess,
        "Command Line": (iocs.commandLine || "").replace(/"+/g, '"'),

        "User / Integrity Level": extractUser(log),
        "Hashes": cleanHashes(log["Hashes"] || log["hashes"]),

        triggeredRules,
        iocs,
      };
    });

    timings.rules = (Date.now() - t_rules) / 1000;

    /*
    ==========================
    ML MODEL
    ==========================
    */
    const t_ml = Date.now();

    const mlResults = runMLModel(processedLogs);

    timings.ml = (Date.now() - t_ml) / 1000;

    /*
    ==========================
    🔥 VIRUSTOTAL ENRICHMENT
    ==========================
    */
    const t_vt = Date.now();

    const enrichedLogs = await Promise.all(
      processedLogs.map(async (log, index) => {
        const hashString = log["Hashes"] || "";
        const sha256 = extractSHA256(hashString);

        let vtResult = null;

        if (sha256) {
          console.log("🔥 Calling VT for:", sha256);
          vtResult = await queryVirusTotal(sha256);
        }

        return {
          ...log,

          // 🔥 ML
          mlPrediction: mlResults[index]?.prediction,
          mlConfidence: mlResults[index]?.confidence,

          // 🔥 VT
          vt: vtResult
        };
      })
    );

    timings.vt = (Date.now() - t_vt) / 1000;

    timings.mitre = timings.ioc * 0.2;

    const result = enrichedLogs;

    res.json({ logs: result, timings });

  } catch (err: any) {
    console.error("FULL ERROR:", err);
    res.status(500).json({
      error: "Processing failed",
      details: err.message
    });
  }
});

/*
CSV PARSER
*/
function parseCSV(data: string) {
  return parse(data, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true
  });
}

export default router;