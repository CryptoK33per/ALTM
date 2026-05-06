import { DetectionRule } from "../types";

const SCRIPT = ["powershell.exe", "wscript.exe", "cscript.exe"];
const LOLBINS = ["certutil.exe", "rundll32.exe", "mshta.exe"];

export const atomicRules: DetectionRule[] = [
  {
    id: "encoded_powershell",
    description: "Encoded PowerShell execution",
    evaluate: (iocs) =>
      iocs.processName.includes("powershell") &&
      iocs.commandLine.includes("-enc"),
  },

  {
    id: "powershell_download",
    description: "PowerShell download command",
    evaluate: (iocs) =>
      iocs.processName.includes("powershell") &&
      iocs.commandLine.includes("downloadstring"),
  },

  {
    id: "certutil_download",
    description: "Certutil downloading file",
    evaluate: (iocs) =>
      iocs.processName.includes("certutil") &&
      iocs.commandLine.includes("http"),
  },

  {
    id: "rundll32_abuse",
    description: "rundll32 suspicious usage",
    evaluate: (iocs) =>
      iocs.processName.includes("rundll32") &&
      iocs.commandLine.includes("http"),
  },

  {
    id: "mshta_execution",
    description: "mshta execution",
    evaluate: (iocs) =>
      iocs.processName.includes("mshta"),
  },
];