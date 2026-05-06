import { MITRE } from "./mitreDictionary";

export function mapMitreTechniques(ruleResults: Record<string, boolean>) {

  const mitreMatches: any[] = [];

  Object.entries(ruleResults).forEach(([rule, triggered]) => {

    if (!triggered) return;

    const mitre = MITRE[rule as keyof typeof MITRE];

    if (!mitre) return;

    mitreMatches.push({
      rule,

      // Core MITRE Info
      id: mitre.id,
      name: mitre.name,
      tactic: mitre.tactic,
      description: mitre.description,

      // 🔥 Full Structured Response (NEW)
      response: {
        prevention: mitre.prevention || "",
        detection: mitre.detection || "",
        containment: mitre.containment || "",
        eradication: mitre.eradication || "",
        recovery: mitre.recovery || "",
        monitoring: mitre.monitoring || "",
      }

    });

  });

  return mitreMatches;
}