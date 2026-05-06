export const MITRE = {

  encoded_powershell: {
    id: "T1059.001",
    name: "PowerShell",
    tactic: "Execution",
    description: "Encoded PowerShell execution",
    remedy: "Disable encoded command usage"
  },

  powershell_download: {
    id: "T1105",
    name: "Ingress Tool Transfer",
    tactic: "Command and Control",
    description: "PowerShell downloading remote payload",
    remedy: "Monitor PowerShell network calls"
  },

  certutil_download: {
    id: "T1105",
    name: "Ingress Tool Transfer",
    tactic: "Command and Control",
    description: "Certutil used to download payload",
    remedy: "Monitor certutil usage"
  },

  rundll32_abuse: {
    id: "T1218",
    name: "Signed Binary Proxy Execution",
    tactic: "Defense Evasion",
    description: "Rundll32 used for suspicious execution",
    remedy: "Monitor rundll32 command-line usage"
  },

  mshta_execution: {
    id: "T1218.005",
    name: "Mshta Proxy Execution",
    tactic: "Defense Evasion",
    description: "MSHTA executing remote script",
    remedy: "Restrict mshta execution"
  },

  office_to_script: {
    id: "T1566.001",
    name: "Spearphishing Attachment",
    tactic: "Initial Access",
    description: "Office spawning script interpreter",
    remedy: "Block macro-based execution"
  },

  browser_to_script: {
    id: "T1204.002",
    name: "User Execution",
    tactic: "Execution",
    description: "Browser spawning script interpreter",
    remedy: "Monitor browser child processes"
  },

  script_to_lolbin: {
    id: "T1218",
    name: "Signed Binary Proxy Execution",
    tactic: "Defense Evasion",
    description: "Script launching LOLBins",
    remedy: "Monitor chained execution"
  },

  registry_run_key: {
    id: "T1547.001",
    name: "Registry Run Keys",
    tactic: "Persistence",
    description: "Run key persistence mechanism",
    remedy: "Audit registry autorun keys"
  },

  scheduled_task: {
    id: "T1053.005",
    name: "Scheduled Task",
    tactic: "Persistence",
    description: "Scheduled task persistence",
    remedy: "Monitor schtasks creation"
  },

  weird_time_script: {
    id: "T1059",
    name: "Command Execution",
    tactic: "Execution",
    description: "Script executed during abnormal hours",
    remedy: "Audit off-hour script activity"
  },

  weird_time_download: {
    id: "T1105",
    name: "Ingress Tool Transfer",
    tactic: "Command and Control",
    description: "Download activity during unusual hours",
    remedy: "Monitor off-hour network downloads"
  },

  elevated_privilege_execution: {
    id: "T1068",
    name: "Privilege Escalation",
    tactic: "Privilege Escalation",
    description: "Suspicious high integrity process execution",
    remedy: "Audit SYSTEM-level process chains"
  }

};