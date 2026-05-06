import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Shield, ChevronRight, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface MitreMappingProps {
  logs?: any[];
}

export function MitreMapping({ logs = [] }: MitreMappingProps) {
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  const suspiciousLogs = logs.filter(
    (log) => log.mitre && log.mitre.length > 0
  );

  /* 🔥 LOGIC COLOR SYSTEM */
  const renderSection = (title: string, content?: string) => {
    if (!content) return null;

    const styles: Record<string, string> = {
      Prevention:
        "bg-green-900/20 border-green-500 text-green-300",
      Detection:
        "bg-yellow-900/20 border-yellow-500 text-yellow-300",
      Containment:
        "bg-orange-900/20 border-orange-500 text-orange-300",
      Eradication:
        "bg-red-900/20 border-red-500 text-red-300",
      Recovery:
        "bg-pink-900/20 border-pink-500 text-pink-300",
      Monitoring:
        "bg-teal-900/20 border-teal-500 text-teal-300",
    };

    const style = styles[title] || "bg-slate-800 border-slate-600 text-white";

    return (
      <div className={`rounded-lg p-3 border ${style}`}>
        <h5 className="text-xs font-semibold mb-1 uppercase tracking-wide">
          {title}
        </h5>
        <p className="text-sm text-white whitespace-pre-line">
          {content}
        </p>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          MITRE ATT&CK Mapping
        </h1>
        <p className="text-slate-400">
          MITRE techniques mapped for detected threats
        </p>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {suspiciousLogs.length === 0 && (
          <Card className="bg-slate-900 border-slate-800 p-6 text-slate-400">
            No MITRE techniques detected.
          </Card>
        )}

        {suspiciousLogs.map((log, index) => {
          const isExpanded = expandedLog === index;

          return (
            <Card
              key={index}
              className="bg-slate-900 border-slate-800 overflow-hidden"
            >
              <Collapsible
                open={isExpanded}
                onOpenChange={() =>
                  setExpandedLog(isExpanded ? null : index)
                }
              >
                {/* Header */}
                <CollapsibleTrigger className="w-full">
                  <div className="p-6 flex items-start gap-4 hover:bg-slate-800/50 transition-colors">
                    <div className="bg-red-600 p-3 rounded-lg">
                      <Shield className="size-6 text-white" />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {log.processName ||
                            log.process ||
                            "Suspicious Process"}
                        </h3>

                        {isExpanded ? (
                          <ChevronDown className="size-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="size-5 text-slate-400" />
                        )}
                      </div>

                      <div className="text-sm text-slate-400 flex gap-3">
                        <span className="font-mono">
                          {log.timestamp || log["Date and Time"]}
                        </span>
                        <span>•</span>
                        <span>
                          {log.mitre?.length || 0} MITRE techniques
                        </span>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                {/* Expanded Content */}
                <CollapsibleContent>
                  <div className="px-6 pb-6 border-t border-slate-800 pt-6 space-y-6">

                    {/* MITRE Mapping */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3">
                        MITRE ATT&CK Techniques
                      </h4>

                      <div className="space-y-4">
                        {log.mitre?.map((tech: any, i: number) => (
                          <div
                            key={i}
                            className="bg-slate-950 rounded-lg p-4 border-l-4 border-red-500 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-blue-400">
                                {tech.id}
                              </span>
                              <span className="text-xs text-slate-400">
                                {tech.tactic}
                              </span>
                            </div>

                            <div className="text-white font-medium">
                              {tech.name}
                            </div>

                            <p className="text-sm text-slate-400">
                              {tech.description}
                            </p>

                            {/* 🔥 STRUCTURED RESPONSE */}
                            {tech.response && (
                              <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mt-3">

                                {renderSection("Prevention", tech.response.prevention)}
                                {renderSection("Detection", tech.response.detection)}
                                {renderSection("Containment", tech.response.containment)}
                                {renderSection("Eradication", tech.response.eradication)}
                                {renderSection("Recovery", tech.response.recovery)}
                                {renderSection("Monitoring", tech.response.monitoring)}

                              </div>
                            )}
                          </div>
                        ))}
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