import { MITRE } from "./mitreDictionary"

export function buildThreat(
  log: any,
  predictionClass: number,
  confidence: number
) {

  // 🔥 UPDATED SEVERITY (uses confidence + class weight)
  let score = confidence * 50

  if (predictionClass === 3) score += 30 // Persistence
  if (predictionClass === 4) score += 25 // Defense Evasion
  if (predictionClass === 1) score += 20 // Command Execution
  if (predictionClass === 2) score += 10 // Suspicious

  score = Math.min(Math.round(score), 100)

  const severity =
    score > 75 ? "High" :
    score > 40 ? "Medium" : "Low"

  // (optional but useful)
  const LABEL_MAP: any = {
    0: "Normal",
    1: "Command Execution",
    2: "Suspicious Activity",
    3: "Persistence",
    4: "Defense Evasion"
  }

  const label = LABEL_MAP[predictionClass]

  const mitre: any[] = []

  const command = (log["Command Line"] || "").toLowerCase()
  const process = (log["Process Name (Image)"] || "").toLowerCase()
  const path = (log["Process Path"] || "").toLowerCase()
  const user = (log["User / Integrity Level"] || "").toLowerCase()

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
    mitre
  }
}