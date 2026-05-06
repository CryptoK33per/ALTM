import { IOCs } from "./types";

export function extractIOCs(log: any): IOCs {
  const safe = (val: any) =>
    String(val ?? "").toLowerCase();

  return {
    processName: safe(
      log["Process Name (Image)"] ??
      log["Process Name"] ??
      log["Image"]
    ),

    processPath: safe(log["Process Path"]),

    parentProcess: safe(
      log["Parent Process Name"] ??
      log["ParentImage"]
    ),

    commandLine: safe(
      log["Command Line"] ??
      log["CommandLine"]
    ),

    integrityLevel: safe(
      log["User / Integrity Level"] ??
      log["User"]
    ),

    timestamp: log["Date and Time"] ?? log["UtcTime"] ?? "",
  };
}
