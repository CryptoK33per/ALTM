import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { TriangleAlert, ChevronDown, ChevronRight, Shield, Activity } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

const threats = [
  {
    id: 1,
    title: "Encoded PowerShell Command Execution",
    severity: "critical",
    riskScore: 95,
    timestamp: "2026-01-04 14:32:15",
    process: "powershell.exe",
    triggeredRules: [
      "Base64 Encoded Command",
      "Suspicious Parent Process",
      "SYSTEM Account Usage"
    ],
    iocs: [
      { type: "Encoded Command", value: "Base64 payload detected" },
      { type: "Suspicious URL", value: "malicious.com/payload.exe" },
    ],
    explanation: "PowerShell executed with base64 encoded command from cmd.exe under SYSTEM context. This pattern is commonly associated with fileless malware attacks and adversary tradecraft.",
    mitreMapping: ["T1059.001", "T1027"],
  },
  {
    id: 2,
    title: "Credential Dumping Tool Detected",
    severity: "critical",
    riskScore: 98,
    timestamp: "2026-01-04 14:32:18",
    process: "mimikatz.exe",
    triggeredRules: [
      "Known Malware Signature",
      "Credential Access Attempt",
      "Administrator Account"
    ],
    iocs: [
      { type: "Known Malware", value: "mimikatz.exe" },
      { type: "Command Pattern", value: "sekurlsa::logonpasswords" },
    ],
    explanation: "Mimikatz credential dumping tool detected executing logonpasswords module. This tool is commonly used by attackers to extract credentials from LSASS memory.",
    mitreMapping: ["T1003.001", "T1078"],
  },
  {
    id: 3,
    title: "Suspicious Office Macro Execution",
    severity: "high",
    riskScore: 78,
    timestamp: "2026-01-04 14:33:45",
    process: "winword.exe",
    triggeredRules: [
      "Macro Enabled Document",
      "Office Application Spawned Process"
    ],
    iocs: [
      { type: "File Extension", value: ".docm" },
    ],
    explanation: "Microsoft Word opened a macro-enabled document. Macros are frequently used as initial access vectors in phishing campaigns.",
    mitreMapping: ["T1566.001", "T1204.002"],
  },
  {
    id: 4,
    title: "Connection to Malicious Domain",
    severity: "high",
    riskScore: 82,
    timestamp: "2026-01-04 14:34:12",
    process: "chrome.exe",
    triggeredRules: [
      "Known Malicious Domain",
      "Suspicious TLD"
    ],
    iocs: [
      { type: "Domain", value: "malicious-site.com" },
    ],
    explanation: "Browser connected to a domain flagged as malicious in threat intelligence feeds. May indicate C2 communication or drive-by download attempt.",
    mitreMapping: ["T1071.001", "T1566.002"],
  },
];

export function ThreatDetection() {
  const [expandedThreat, setExpandedThreat] = useState<number | null>(1);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 border-red-600 bg-red-600/10";
      case "high": return "text-orange-400 border-orange-600 bg-orange-600/10";
      case "medium": return "text-yellow-400 border-yellow-600 bg-yellow-600/10";
      default: return "text-green-400 border-green-600 bg-green-600/10";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return TriangleAlert;
      default:
        return Shield;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Threat Detection</h1>
        <p className="text-slate-400">Suspicious events and triggered detection rules</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 p-4">
          <div className="text-2xl font-bold text-red-400 mb-1">2</div>
          <div className="text-sm text-slate-400">Critical Threats</div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-4">
          <div className="text-2xl font-bold text-orange-400 mb-1">2</div>
          <div className="text-sm text-slate-400">High Severity</div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-4">
          <div className="text-2xl font-bold text-yellow-400 mb-1">1</div>
          <div className="text-sm text-slate-400">Medium Severity</div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-4">
          <div className="text-2xl font-bold text-blue-400 mb-1">23</div>
          <div className="text-sm text-slate-400">Rules Triggered</div>
        </Card>
      </div>

      {/* Threats List */}
      <div className="space-y-4">
        {threats.map((threat) => {
          const SeverityIcon = getSeverityIcon(threat.severity);
          const isExpanded = expandedThreat === threat.id;

          return (
            <Card key={threat.id} className="bg-slate-900 border-slate-800 overflow-hidden">
              <Collapsible
                open={isExpanded}
                onOpenChange={() => setExpandedThreat(isExpanded ? null : threat.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="p-6 flex items-start gap-4 hover:bg-slate-800/50 transition-colors">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg shrink-0 ${getSeverityColor(threat.severity)}`}>
                      <SeverityIcon className="size-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{threat.title}</h3>
                        <div className="flex items-center gap-3">
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg">
                            <Activity className="size-4 text-red-400" />
                            <span className="text-white font-semibold">{threat.riskScore}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="size-5 text-slate-400" />
                          ) : (
                            <ChevronRight className="size-5 text-slate-400" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="font-mono">{threat.timestamp}</span>
                        <span>•</span>
                        <span className="font-mono text-blue-400">{threat.process}</span>
                        <span>•</span>
                        <span>{threat.triggeredRules.length} rules triggered</span>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-6 pb-6 border-t border-slate-800 pt-6 space-y-6">
                    {/* Explanation */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Threat Analysis</h4>
                      <p className="text-slate-300">{threat.explanation}</p>
                    </div>

                    {/* Triggered Rules */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3">Triggered Rules</h4>
                      <div className="flex flex-wrap gap-2">
                        {threat.triggeredRules.map((rule, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="border-blue-600 text-blue-400"
                          >
                            {rule}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* IOCs */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3">Indicators of Compromise</h4>
                      <div className="space-y-2">
                        {threat.iocs.map((ioc, idx) => (
                          <div 
                            key={idx} 
                            className="bg-slate-950 rounded-lg p-3 flex items-center gap-3"
                          >
                            <Badge variant="outline" className="border-yellow-600 text-yellow-400 shrink-0">
                              {ioc.type}
                            </Badge>
                            <span className="text-slate-300 font-mono text-sm">{ioc.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* MITRE Mapping */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3">MITRE ATT&CK Techniques</h4>
                      <div className="flex flex-wrap gap-2">
                        {threat.mitreMapping.map((technique, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="border-purple-600 text-purple-400 font-mono"
                          >
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Risk Score Breakdown */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3">Risk Score Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Rule Confidence</span>
                          <span className="text-sm text-white">+40</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">ML Model Score</span>
                          <span className="text-sm text-white">+35</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">IOC Severity</span>
                          <span className="text-sm text-white">+23</span>
                        </div>
                        <div className="border-t border-slate-800 pt-2 mt-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">Total Risk Score</span>
                          <span className="text-lg font-bold text-red-400">{threat.riskScore}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
}