import { DetectionResult } from "./types"

/*
Feature list MUST stay fixed.
Order must NEVER change.
We ONLY APPEND new features at the end.
*/

export const ML_FEATURE_ORDER = [
  "encoded_powershell",
  "powershell_download",
  "certutil_download",
  "rundll32_abuse",
  "mshta_execution",

  "office_to_script",
  "script_to_lolbin",
  "browser_to_script",

  "registry_run_key",
  "scheduled_task",

  "weird_time_script",
  "weird_time_download",

  // 🔥 NEW FEATURES (APPENDED ONLY)
  "long_command",
  "has_base64",
  "many_arguments",
  "is_system32_path",
  "is_high_privilege"

] as const

export type MLFeatureName = typeof ML_FEATURE_ORDER[number]

/*
Convert rule result → ML feature map
Now includes contextual signals
*/

export function buildMLFeatureMap(
  result: DetectionResult,
  log?: any   // 🔥 NEW: pass raw log for extra signals
): Record<string, number> {

  const featureMap: any = {}

  // existing rule-based features
  for (const key of ML_FEATURE_ORDER) {
    featureMap[key] = result[key as keyof DetectionResult] ? 1 : 0
  }

  // 🔥 ADD CONTEXT FEATURES (real variation comes from here)

  const command = (log?.["Command Line"] || "").toLowerCase()
  const processPath = (log?.["Process Path"] || "").toLowerCase()
  const user = (log?.["User / Integrity Level"] || "").toLowerCase()

  featureMap.long_command = command.length > 120 ? 1 : 0

  featureMap.has_base64 =
    /[a-z0-9+/=]{20,}/.test(command) ? 1 : 0

  featureMap.many_arguments =
    command.split(" ").length > 6 ? 1 : 0

  featureMap.is_system32_path =
    processPath.includes("system32") ? 1 : 0

  featureMap.is_high_privilege =
    user.includes("high") || user.includes("system") ? 1 : 0

  return featureMap
}

/*
Convert → numeric vector (for model)
*/

export function buildMLFeatureVector(
  result: DetectionResult,
  log?: any   // 🔥 MUST pass this now
): number[] {

  const featureMap = buildMLFeatureMap(result, log)

  return ML_FEATURE_ORDER.map(
    (k) => featureMap[k] ?? 0
  )
}