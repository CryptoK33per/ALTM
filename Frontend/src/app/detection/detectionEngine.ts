import { extractIOCs } from "./iocExtractor";
import { RULES } from "./rules";
import { DetectionResult } from "./types";
import { buildMLFeatureVector } from "./mlFeatureBuilder";
import { mapMitreTechniques } from "../../ml/threat/mitremapper";

const TRUSTED_SYSTEM_PROCESSES = [
  "svchost.exe",
  "services.exe",
  "lsass.exe",
  "wininit.exe",
  "explorer.exe",
];

export function evaluateLog(log: any) {

  const iocs = extractIOCs(log);

  const result: DetectionResult = {};

  // -----------------------
  // 1️⃣ Evaluate base rules
  // -----------------------
  for (const rule of RULES) {
    result[rule.id] = rule.evaluate(iocs);
  }

  // -----------------------
  // 2️⃣ Check if suspicious behavior exists
  // -----------------------
  const suspicious = Object.values(result).some(Boolean);

  // -----------------------
  // 3️⃣ Controlled privilege escalation logic
  // -----------------------
  const isHighIntegrity =
    iocs.integrityLevel?.includes("high") ||
    iocs.integrityLevel?.includes("system");

  const isTrustedSystemProcess =
    TRUSTED_SYSTEM_PROCESSES.some((p) =>
      iocs.processName?.includes(p)
    );

  const hasSuspiciousParent =
    iocs.parentProcess &&
    !TRUSTED_SYSTEM_PROCESSES.some((p) =>
      iocs.parentProcess.includes(p)
    );

  /*
    Escalation fires ONLY if:
    - suspicious behavior already detected
    - running at high integrity
    - process is NOT a normal system binary
    - parent is suspicious or uncommon
  */

  if (
    suspicious &&
    isHighIntegrity &&
    !isTrustedSystemProcess &&
    hasSuspiciousParent
  ) {
    result["elevated_privilege_execution"] = true;
  }

  // -----------------------
  // 4️⃣ Build ML feature vector
  // -----------------------
  const featureVector = buildMLFeatureVector(result);

  // -----------------------
  // 5️⃣ MITRE Mapping
  // -----------------------
  const mitreTechniques = mapMitreTechniques(result);

  // console.log("RULE RESULT:", result);
  // console.log("MITRE:", mitreTechniques);
  // console.log("FEATURE VECTOR:", featureVector);

  return {
    result,              // triggered rules
    iocs,                // extracted IOC values
    featureVector,       // ML input vector
    mitre: mitreTechniques   // mapped MITRE techniques
  };
}