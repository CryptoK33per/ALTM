import { DetectionRule } from "../types";

export const chainRules: DetectionRule[] = [
  {
    id: "office_to_script",
    description: "Office spawning script",
    evaluate: (iocs) =>
      iocs.parentProcess.includes("winword") &&
      iocs.processName.includes("powershell"),
  },

  {
    id: "browser_to_script",
    description: "Browser spawning script",
    evaluate: (iocs) =>
      iocs.parentProcess.includes("chrome") &&
      iocs.processName.includes("powershell"),
  },

  {
    id: "script_to_lolbin",
    description: "Script spawning lolbin",
    evaluate: (iocs) =>
      iocs.parentProcess.includes("powershell") &&
      (
        iocs.processName.includes("certutil") ||
        iocs.processName.includes("rundll32")
      ),
  },
];