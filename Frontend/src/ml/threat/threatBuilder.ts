import { MITRE } from "./mitreDictionary"

export function buildThreat(
  log: any,
  predictionClass: number,
  confidence: number
) {

  /*
   1. BASE SCORE (ML CONFIDENCE - CONTROLLED)
  */
  let score = confidence * 40 // reduced dominance

  /*
   2. ATTACK TYPE WEIGHT (REAL-WORLD PRIORITY)
  */
  const CLASS_WEIGHTS: any = {
    0: 0,   // Normal
    1: 25,  // Command Execution
    2: 15,  // Suspicious
    3: 40,  // Persistence (VERY HIGH)
    4: 35   // Defense Evasion (HIGH)
  }

  score += CLASS_WEIGHTS[predictionClass] || 0

  /*
   3. CONTEXTUAL RISK BOOSTING
  */
  const command = (log["Command Line"] || "").toLowerCase()
  const process = (log["Process Name (Image)"] || "").toLowerCase()
  const path = (log["Process Path"] || "").toLowerCase()
  const user = (log["User / Integrity Level"] || "").toLowerCase()

  //   High privilege execution
  if (user.includes("system")) score += 20
  else if (user.includes("high")) score += 10

  //  LOLBins (common attacker tools)
  if (process.includes("powershell")) score += 15
  if (process.includes("cmd")) score += 10
  if (process.includes("rundll32")) score += 20
  if (process.includes("mshta")) score += 20
  if (process.includes("certutil")) score += 20

  //  Suspicious execution patterns
  if (command.includes("-enc") || command.includes("base64")) score += 25
  if (command.length > 120) score += 10

  //  System path abuse
  if (path.includes("system32") && process.includes("script")) score += 10

  /*
   4. NORMALIZE
  */
  score = Math.min(Math.round(score), 100)

  /*
   5. REALISTIC SEVERITY (INDUSTRY-LIKE)
  */
  let severity: "Low" | "Medium" | "High" | "Critical"

  if (score >= 85) severity = "Critical"
  else if (score >= 65) severity = "High"
  else if (score >= 40) severity = "Medium"
  else severity = "Low"

  /*
   LABEL MAPPING
  */
  const LABEL_MAP: any = {
    0: "Normal",
    1: "Command Execution",
    2: "Suspicious Activity",
    3: "Persistence",
    4: "Defense Evasion"
  }

  const label = LABEL_MAP[predictionClass]

  /*
   MITRE MAPPING (unchanged logic)
  */
  const mitre: any[] = []

  Object.values(MITRE).forEach((tech: any) => {

    const match = tech.match

    if (match?.commandIncludes) {
      if (match.commandIncludes.some((k: string) => command.includes(k.toLowerCase())))
        mitre.push(tech)
    }

    if (match?.processIncludes) {
      if (match.processIncludes.some((k: string) => process.includes(k.toLowerCase())))
        mitre.push(tech)
    }

    if (match?.pathIncludes) {
      if (match.pathIncludes.some((k: string) => path.includes(k.toLowerCase())))
        mitre.push(tech)
    }

    if (match?.userIncludes) {
      if (match.userIncludes.some((k: string) => user.includes(k.toLowerCase())))
        mitre.push(tech)
    }

  })

  return {
    label,
    confidence,
    severity,
    mitre,
    score //  useful for debugging/UI
  }
}