import { evaluateLog } from "../detection/detectionEngine";
import { runMLModel } from "../ml/runModel";

export function analyzeLogs(logs: any[]) {
  return logs.map((log, index) => {

    const { result, iocs } = evaluateLog(log);

    const triggeredRules = Object.entries(result)
      .filter(([, fired]) => fired)
      .map(([ruleId]) => ruleId.replaceAll("_", " "));

    // const mlScore = runMLModel([log]);

    const riskScore = triggeredRules.length * 25;

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

      return value
        .replace(/^"+|"+$/g, "") // remove extra quotes
        .trim();
    };

    let severity = "low";
    if (riskScore >= 75) severity = "critical";
    else if (riskScore >= 50) severity = "high";
    else if (riskScore >= 25) severity = "medium";

    // return {
    //   id: index,
    //   timestamp: iocs.timestamp ?? "Unknown",
    //   process: iocs.processName,
    //   triggeredRules,
    //   iocs: [
    //     { type: "Process", value: iocs.processName },
    //     { type: "Command Line", value: iocs.commandLine },
    //     { type: "Parent", value: iocs.parentProcess },
    //     { type: "Integrity", value: iocs.integrityLevel },
    //   ],
    //   // mlScore,
    //   riskScore,
    //   severity,
    // };

    return {
      ...log,

      // 👇 Map backend fields to what frontend expects
      "Date and Time": log["Date and Time"] || log["UtcTime"],
      "Event ID": log["Event ID"] || log["EventId"],

      "Process Name (Image)": iocs.processName,
      "Parent Process Name": iocs.parentProcess,
      // "Command Line": iocs.commandLine,
      "Command Line": (iocs.commandLine || "").replace(/"+/g, '"'),
      // "User / Integrity Level": iocs.integrityLevel,
      // "User / Integrity Level": log["User"] || iocs.integrityLevel,
      "User / Integrity Level": extractUser(log),
      // "Hashes": log["Hashes"] || log["hashes"] || "Unknown",
      "Hashes": cleanHashes(log["Hashes"] || log["hashes"]),

      risk: severity,
      triggeredRules,
      iocs,
    };
  });
}