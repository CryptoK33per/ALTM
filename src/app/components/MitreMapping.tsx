import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Shield, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const mitreTactics = [
  {
    id: "TA0001",
    name: "Initial Access",
    color: "bg-red-600",
    techniques: [
      { id: "T1566.001", name: "Spearphishing Attachment", events: 1 },
      { id: "T1566.002", name: "Spearphishing Link", events: 1 },
    ],
  },
  {
    id: "TA0002",
    name: "Execution",
    color: "bg-orange-600",
    techniques: [
      { id: "T1059.001", name: "PowerShell", events: 3 },
      { id: "T1204.002", name: "Malicious File", events: 1 },
    ],
  },
  {
    id: "TA0005",
    name: "Defense Evasion",
    color: "bg-yellow-600",
    techniques: [
      { id: "T1027", name: "Obfuscated Files or Information", events: 2 },
      { id: "T1055", name: "Process Injection", events: 0 },
    ],
  },
  {
    id: "TA0006",
    name: "Credential Access",
    color: "bg-green-600",
    techniques: [
      { id: "T1003.001", name: "LSASS Memory", events: 1 },
      { id: "T1078", name: "Valid Accounts", events: 1 },
    ],
  },
  {
    id: "TA0011",
    name: "Command and Control",
    color: "bg-blue-600",
    techniques: [
      { id: "T1071.001", name: "Web Protocols", events: 1 },
      { id: "T1132.001", name: "Standard Encoding", events: 1 },
    ],
  },
];

const techniqueDetails = {
  "T1059.001": {
    name: "Command and Scripting Interpreter: PowerShell",
    description: "Adversaries may abuse PowerShell commands and scripts for execution. PowerShell is a powerful interactive command-line interface and scripting environment included in the Windows operating system.",
    events: [
      {
        timestamp: "2026-01-04 14:32:15",
        process: "powershell.exe",
        details: "Encoded PowerShell command execution detected",
      },
    ],
  },
  "T1003.001": {
    name: "OS Credential Dumping: LSASS Memory",
    description: "Adversaries may attempt to access credential material stored in the process memory of the Local Security Authority Subsystem Service (LSASS).",
    events: [
      {
        timestamp: "2026-01-04 14:32:18",
        process: "mimikatz.exe",
        details: "Credential dumping tool detected",
      },
    ],
  },
};

export function MitreMapping() {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);

  const totalDetected = mitreTactics.reduce(
    (sum, tactic) => sum + tactic.techniques.filter(t => t.events > 0).length,
    0
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">MITRE ATT&CK Mapping</h1>
        <p className="text-slate-400">Detected adversary tactics and techniques</p>
      </div>

      {/* Summary */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Detection Coverage</h3>
            <p className="text-sm text-slate-400">
              {totalDetected} techniques detected across {mitreTactics.length} tactics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-blue-400" />
            <span className="text-2xl font-bold text-white">{totalDetected}</span>
          </div>
        </div>
      </Card>

      {/* MITRE ATT&CK Matrix */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">ATT&CK Matrix View</h3>
        <div className="grid grid-cols-5 gap-4">
          {mitreTactics.map((tactic) => (
            <div key={tactic.id} className="space-y-2">
              {/* Tactic Header */}
              <div className={`${tactic.color} rounded-t-lg p-3 text-center`}>
                <div className="text-xs font-mono text-white/80 mb-1">{tactic.id}</div>
                <div className="text-sm font-semibold text-white">{tactic.name}</div>
              </div>

              {/* Techniques */}
              <div className="space-y-2">
                {tactic.techniques.map((technique) => (
                  <button
                    key={technique.id}
                    onClick={() => setSelectedTechnique(technique.id)}
                    className={`
                      w-full p-3 rounded-lg text-left transition-all
                      ${technique.events > 0
                        ? 'bg-slate-800 hover:bg-slate-700 border-l-4 border-red-500'
                        : 'bg-slate-950 opacity-50 hover:opacity-70'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="text-xs font-mono text-blue-400">{technique.id}</div>
                      {technique.events > 0 && (
                        <Badge className="bg-red-600 text-white text-xs">
                          {technique.events}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-300 line-clamp-2">
                      {technique.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Technique List View */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Detected Techniques</h3>
        <div className="space-y-3">
          {mitreTactics.flatMap((tactic) =>
            tactic.techniques
              .filter(t => t.events > 0)
              .map((technique) => (
                <button
                  key={technique.id}
                  onClick={() => setSelectedTechnique(technique.id)}
                  className="w-full flex items-center gap-4 p-4 bg-slate-950 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className={`${tactic.color} p-2 rounded-lg`}>
                    <Shield className="size-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-blue-400">{technique.id}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 text-sm">{tactic.name}</span>
                    </div>
                    <div className="text-white font-medium">{technique.name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-red-600 text-white">
                      {technique.events} events
                    </Badge>
                    <ChevronRight className="size-5 text-slate-400" />
                  </div>
                </button>
              ))
          )}
        </div>
      </Card>

      {/* Technique Detail Dialog */}
      {selectedTechnique && techniqueDetails[selectedTechnique as keyof typeof techniqueDetails] && (
        <Dialog open={!!selectedTechnique} onOpenChange={() => setSelectedTechnique(null)}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-mono text-blue-400 mb-1">
                    {selectedTechnique}
                  </div>
                  <div className="text-xl">
                    {techniqueDetails[selectedTechnique as keyof typeof techniqueDetails].name}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTechnique(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="size-5 text-slate-400" />
                </button>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Description</h4>
                <p className="text-slate-300">
                  {techniqueDetails[selectedTechnique as keyof typeof techniqueDetails].description}
                </p>
              </div>

              {/* Related Events */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Related Events</h4>
                <div className="space-y-2">
                  {techniqueDetails[selectedTechnique as keyof typeof techniqueDetails].events.map((event, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 rounded-lg p-4 border-l-4 border-red-500"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-blue-400">{event.process}</span>
                        <span className="text-xs text-slate-400">{event.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-300">{event.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center gap-4 p-4 bg-slate-950 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm text-slate-400 mb-1">Detection Count</div>
                  <div className="text-2xl font-bold text-white">
                    {techniqueDetails[selectedTechnique as keyof typeof techniqueDetails].events.length}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-slate-400 mb-1">Risk Level</div>
                  <Badge className="bg-red-600 text-white">High</Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
