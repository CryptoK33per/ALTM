import { DetectionRule } from "../types";

export const persistenceRules: DetectionRule[] = [
  {
    id: "registry_run_key",
    description: "Run key persistence",
    evaluate: (iocs) =>
      iocs.commandLine.includes("run\\"),
  },

  {
    id: "scheduled_task",
    description: "Scheduled task creation",
    evaluate: (iocs) =>
      iocs.commandLine.includes("schtasks"),
  },
];