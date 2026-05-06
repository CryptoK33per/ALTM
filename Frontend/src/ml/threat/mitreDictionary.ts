export const MITRE = {

  encoded_powershell: {
    id: "T1059.001",
    name: "PowerShell",
    tactic: "Execution",
    description: "Encoded PowerShell execution",

    prevention: `
- Disable PowerShell v2
- Enforce Constrained Language Mode
- Apply AppLocker / WDAC policies
`,

    detection: `
- Sysmon Event ID 1 for "-enc"
- PowerShell Event ID 4104
`,

    containment: `
- Immediately terminate the PowerShell process
- Isolate host from network (EDR containment / VLAN quarantine)
- Disable affected user account temporarily
- Block associated IP/domain at firewall/proxy
- Capture volatile data (memory snapshot) before shutdown if possible
`,

    eradication: `
- Remove malicious scripts and payload files
- Delete persistence (registry run keys, scheduled tasks, WMI)
- Clear PowerShell history and temp directories
- Scan entire system using EDR/AV with updated signatures
- Validate no secondary payloads or backdoors exist
`,

    recovery: `
- Restore system from clean backup if integrity is compromised
- Re-enable network access after validation
- Reset user credentials and API tokens
- Patch system vulnerabilities if exploited
- Validate system logs to confirm no reinfection
`,

    monitoring: `
- Alert on encoded command usage
- Track PowerShell parent-child anomalies
`
  },

  powershell_download: {
    id: "T1105",
    name: "Ingress Tool Transfer",
    tactic: "Command and Control",
    description: "PowerShell downloading payload",

    prevention: `
- Restrict outbound traffic
- Enforce proxy filtering
`,

    detection: `
- Detect Invoke-WebRequest / DownloadString
`,

    containment: `
- Block malicious domains/IPs at firewall
- Kill PowerShell process and child processes
- Isolate endpoint from network
- Disable active sessions for compromised user
- Prevent further outbound connections via EDR policy
`,

    eradication: `
- Delete all downloaded payloads and scripts
- Remove persistence mechanisms created by payload
- Perform full disk and memory scan
- Remove malicious scheduled tasks or services
- Verify integrity of system binaries
`,

    recovery: `
- Restore clean system state if required
- Reconnect system after validation
- Rotate credentials used during compromise
- Apply OS and application patches
- Validate endpoint baseline configuration
`,

    monitoring: `
- Alert on scripting engines making network calls
`
  },

  credential_dumping: {
    id: "T1003",
    name: "Credential Dumping",
    tactic: "Credential Access",
    description: "LSASS memory access",

    prevention: `
- Enable LSASS protection (RunAsPPL)
- Enforce MFA
`,

    detection: `
- Monitor lsass.exe access
`,

    containment: `
- Immediately terminate process accessing LSASS
- Isolate affected system
- Disable compromised accounts
- Block lateral movement by restricting SMB/RDP temporarily
- Capture forensic evidence (memory dump if safe)
`,

    eradication: `
- Remove credential dumping tools (e.g., mimikatz remnants)
- Clean persistence mechanisms
- Audit all systems accessed using stolen credentials
- Remove unauthorized admin accounts
- Validate domain controller integrity
`,

    recovery: `
- Reset all compromised credentials (user + service accounts)
- Reissue Kerberos tickets (force logoff / reboot)
- Rejoin system to domain if trust is broken
- Validate authentication logs post-recovery
- Conduct security audit across domain
`,

    monitoring: `
- Alert on LSASS access attempts
`
  },

  process_injection: {
    id: "T1055",
    name: "Process Injection",
    tactic: "Defense Evasion",
    description: "Code injected into process",

    prevention: `
- Use EDR with memory protection
`,

    detection: `
- Sysmon Event ID 8 (CreateRemoteThread)
`,

    containment: `
- Terminate both injecting and injected processes
- Isolate affected host
- Suspend suspicious processes for analysis if needed
- Block execution of related binaries
- Prevent further privilege escalation attempts
`,

    eradication: `
- Remove injected malware components from disk
- Clean registry and startup persistence
- Perform deep memory scan
- Remove any dropped DLLs or shellcode loaders
- Validate integrity of system processes
`,

    recovery: `
- Restart affected services and processes
- Restore clean system state if compromised
- Apply security patches
- Validate application functionality
- Re-enable services gradually after validation
`,

    monitoring: `
- Alert on abnormal memory operations
`
  },

  lateral_movement_psexec: {
    id: "T1021.002",
    name: "SMB/Windows Admin Shares",
    tactic: "Lateral Movement",
    description: "PsExec lateral movement",

    prevention: `
- Restrict SMB usage
- Enforce least privilege
`,

    detection: `
- Detect remote service creation
`,

    containment: `
- Block SMB traffic across affected segments
- Disable compromised admin accounts
- Isolate both source and target systems
- Terminate remote execution sessions
- Revoke active network sessions
`,

    eradication: `
- Remove malicious services created remotely
- Delete payloads from remote systems
- Clean startup persistence on all affected machines
- Audit lateral movement path across network
- Remove unauthorized admin privileges
`,

    recovery: `
- Reset all admin credentials
- Restore trust relationships between systems
- Re-enable services securely
- Validate no further lateral movement occurred
- Perform full network security review
`,

    monitoring: `
- Alert on remote execution tools
`
  },

  /* 🔥 NEW ADDITIONS BELOW */

  certutil_download: {
    id: "T1105",
    name: "Ingress Tool Transfer (Certutil)",
    tactic: "Command and Control",
    description: "Certutil used to download malicious payload",

    prevention: `
- Restrict certutil via AppLocker/WDAC
- Block outbound unknown domains
`,

    detection: `
- Sysmon Event ID 1: certutil -urlcache
`,

    containment: `
- Kill certutil process
- Block domain/IP
- Isolate host
- Disable session
`,

    eradication: `
- Remove downloaded payload
- Delete persistence
- Scan system fully
`,

    recovery: `
- Restore system state
- Reset credentials
- Validate integrity
`,

    monitoring: `
- Alert on certutil usage
`
  },

  mshta_execution: {
    id: "T1218.005",
    name: "Mshta Proxy Execution",
    tactic: "Defense Evasion",
    description: "MSHTA executing remote script",

    prevention: `
- Disable mshta via policy
`,

    detection: `
- Monitor mshta with URL arguments
`,

    containment: `
- Kill mshta
- Block URL
- Isolate host
`,

    eradication: `
- Remove scripts
- Delete persistence
`,

    recovery: `
- Restore clean state
- Reset credentials
`,

    monitoring: `
- Alert on mshta usage
`
  },

  phishing_attachment: {
    id: "T1566.001",
    name: "Spearphishing Attachment",
    tactic: "Initial Access",
    description: "Malicious email attachment",

    prevention: `
- Enable email filtering
- Disable macros
`,

    detection: `
- Office spawning scripts
`,

    containment: `
- Isolate host
- Remove email
- disable account
`,

    eradication: `
- Delete payload
- scan system
`,

    recovery: `
- Reset credentials
- restore files
`,

    monitoring: `
- alert on suspicious email behavior
`
  },

  ransomware_activity: {
    id: "T1486",
    name: "Data Encrypted for Impact",
    tactic: "Impact",
    description: "Ransomware encryption activity",

    prevention: `
- Maintain offline backups
- Restrict unknown binaries
`,

    detection: `
- mass file encryption detection
`,

    containment: `
- isolate system
- kill ransomware process
- block network shares
`,

    eradication: `
- remove ransomware
- clean persistence
`,

    recovery: `
- restore backups
- rebuild system
`,

    monitoring: `
- alert on abnormal file activity
`
  }

};