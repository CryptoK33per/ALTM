import { MITRE } from "./mitreDictionary";

export function mapMitreTechniques(ruleResults: Record<string, boolean>) {

  const mitreMatches: any[] = [];

  Object.entries(ruleResults).forEach(([rule, triggered]) => {

    if (!triggered) return;

    const mitre = MITRE[rule as keyof typeof MITRE];

    if (!mitre) return;

    mitreMatches.push({
      rule,
      id: mitre.id,
      name: mitre.name,
      description: mitre.description,
      remedy: mitre.remedy,
      tactic: mitre.tactic
    });

  });

  return mitreMatches;
}