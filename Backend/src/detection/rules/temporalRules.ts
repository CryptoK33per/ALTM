// import { DetectionRule } from "../types";

// function isWeirdTime(ts?: string) {
//   if (!ts) return false;

//   const h = Number(ts.split(" ")[1]?.split(":")[0]);

//   return h < 6 || h > 22;
// }

// export const temporalRules: DetectionRule[] = [
//   {
//     id: "weird_time_script",
//     description: "Script at weird time",
//     evaluate: (iocs) =>
//       isWeirdTime(iocs.timestamp) &&
//       iocs.processName.includes("powershell"),
//   },

//   {
//     id: "weird_time_high_priv",
//     description: "High privilege at weird time",
//     evaluate: (iocs) =>
//       isWeirdTime(iocs.timestamp) &&
//       iocs.integrityLevel.includes("system"),
//   },
// ];

import { DetectionRule } from "../types";

/*
  Robust time parsing.
  Works with:
  - "12/24/2025 9:45:00 AM"
  - "2025-12-24 14:30:00"
  - ISO timestamps
*/
function getHour(ts?: string): number | null {
  if (!ts) return null;

  const date = new Date(ts);

  if (isNaN(date.getTime())) return null;

  return date.getHours(); // 0–23 (automatic AM/PM handling)
}

/*
  Define weird time window:
  00:00 → 05:59
*/
function isWeirdTime(ts?: string): boolean {
  const hour = getHour(ts);
  if (hour === null) return false;

  return hour >= 0 && hour < 6;
}

export const temporalRules: DetectionRule[] = [
  {
    id: "weird_time_script",
    description: "Script execution during unusual hours",
    evaluate: (iocs) =>
      isWeirdTime(iocs.timestamp) &&
      (
        iocs.processName.includes("powershell") ||
        iocs.processName.includes("wscript") ||
        iocs.processName.includes("cscript")
      ),
  },

  {
    id: "weird_time_download",
    description: "Download activity during unusual hours",
    evaluate: (iocs) =>
      isWeirdTime(iocs.timestamp) &&
      (
        iocs.commandLine.includes("http") ||
        iocs.commandLine.includes("downloadstring") ||
        iocs.commandLine.includes("certutil")
      ),
  }
];