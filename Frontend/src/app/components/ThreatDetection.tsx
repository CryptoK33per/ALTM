import { useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  TriangleAlert,
  ChevronDown,
  ChevronRight,
  Shield,
  Activity,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { buildThreatsFromLogs } from "./ThreatBuilder";

/* -----------------------------
   🔥 ADVANCED SCORING ENGINE
----------------------------- */
function computeScores(threat: any) {
  /* -----------------------------
     RULE SCORE
  ----------------------------- */
  let ruleScore = (threat.triggeredRules?.length || 0) * 5;

  /* -----------------------------
     ML CONFIDENCE
  ----------------------------- */
  let mlConfidence = threat.confidence;

  if (mlConfidence === undefined || mlConfidence === null) {
    const ruleFactor = (threat.triggeredRules?.length || 0) * 0.1;
    const iocFactor = (threat.iocs?.length || 0) * 0.1;

    mlConfidence = Math.min(0.9, 0.3 + ruleFactor + iocFactor);
  }

  const mlClass = threat.prediction ?? 2;

  /* -----------------------------
     ✅ ML SCORE (FIX ADDED HERE)
  ----------------------------- */
  let mlScore = mlConfidence * 30;

  if (mlClass === 3) mlScore += 20;
  else if (mlClass === 4) mlScore += 10;
  else if (mlClass === 1) mlScore += 15;
  else if (mlClass === 2) mlScore += 5;

  mlScore = Math.min(mlScore, 40);

  /* -----------------------------
     IOC SCORE (LIGHT WEIGHT)
  ----------------------------- */
  let iocScore = 3;

  const process = (threat.process || "").toLowerCase();

  const command =
    threat.iocs?.find((i: any) => i.type === "Command Line")?.value?.toLowerCase() || "";

  const parent =
    threat.iocs?.find((i: any) => i.type === "Parent")?.value?.toLowerCase() || "";

  /* PROCESS */
  if (process.includes("powershell")) iocScore += 4;
  if (process.includes("cmd")) iocScore += 3;
  if (process.includes("wscript") || process.includes("cscript")) iocScore += 4;
  if (process.includes("mshta")) iocScore += 5;
  if (process.includes("certutil")) iocScore += 5;

  /* COMMAND */
  if (command.includes("base64") || command.includes("-enc")) iocScore += 5;
  if (command.includes("http")) iocScore += 3;
  if (command.includes("download") || command.includes("invoke-webrequest")) iocScore += 4;
  if (command.includes("bitsadmin")) iocScore += 5;
  if (command.includes("certutil -urlcache")) iocScore += 5;

  /* PARENT */
  if (parent.includes("winword") && process.includes("powershell")) iocScore += 5;
  if (parent.includes("excel") && process.includes("cmd")) iocScore += 5;
  if (parent.includes("outlook") && process.includes("powershell")) iocScore += 5;
  if (parent.includes("explorer") && process.includes("mshta")) iocScore += 4;

  /* IOC VOLUME */
  const iocCount = threat.iocs?.length || 0;
  iocScore += Math.min(iocCount * 1, 5);

  iocScore = Math.min(iocScore, 20);

  /* -----------------------------
     FINAL SCORE
  ----------------------------- */
  const total = Math.min(
    Math.round(ruleScore + mlScore + iocScore),
    100
  );

  return {
    ruleScore: Math.round(ruleScore),
    mlScore: Math.round(mlScore),
    iocScore: Math.round(iocScore),
    total,
  };
}

/* -----------------------------
   COMPONENT
----------------------------- */
export function ThreatDetection({
  logs = [],
  precomputedThreats,
  onThreatsComputed,
}: 
{
  logs?: any[];
  precomputedThreats?: any[];
  onThreatsComputed?: (threats: any[]) => void; // ✅ ADD TYPE
}) {
  const [expandedThreat, setExpandedThreat] = useState<number | null>(1);
  const [selectedSeverity, setSelectedSeverity] = useState<
    "critical" | "high" | "medium"
  >("critical");

  const threats = useMemo(() => {
    const base = precomputedThreats ?? buildThreatsFromLogs(logs);

    return base
      .map((t) => {
        const scores = computeScores(t);

        let severity: "critical" | "high" | "medium" = "medium";

        if (scores.total >= 80) severity = "critical";
        else if (scores.total >= 50) severity = "high";

        return {
          ...t,
          ...scores,
          severity,
          riskScore: scores.total,
        };
      })
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [precomputedThreats, logs]);

  const filteredThreats = threats.filter(
    (t) => t.severity === selectedSeverity
  );

  const criticalCount = threats.filter((t) => t.severity === "critical").length;
  const highCount = threats.filter((t) => t.severity === "high").length;
  const mediumCount = threats.filter((t) => t.severity === "medium").length;

  const totalLogs = logs.length;
  const logsTriggered = threats.length;
      

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 border-red-600 bg-red-600/10";
      case "high":
        return "text-orange-400 border-orange-600 bg-orange-600/10";
      case "medium":
        return "text-yellow-400 border-yellow-600 bg-yellow-600/10";
      default:
        return "text-green-400 border-green-600 bg-green-600/10";
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Threat Detection
        </h1>
        <p className="text-slate-400">
          Suspicious events and triggered detection rules
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card onClick={() => setSelectedSeverity("critical")} className="cursor-pointer bg-slate-900 border-slate-800 p-4">
          <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
          <div className="text-sm text-slate-400">Critical Threats</div>
        </Card>

        <Card onClick={() => setSelectedSeverity("high")} className="cursor-pointer bg-slate-900 border-slate-800 p-4">
          <div className="text-2xl font-bold text-orange-400">{highCount}</div>
          <div className="text-sm text-slate-400">High Severity</div>
        </Card>

        <Card onClick={() => setSelectedSeverity("medium")} className="cursor-pointer bg-slate-900 border-slate-800 p-4">
          <div className="text-2xl font-bold text-yellow-400">{mediumCount}</div>
          <div className="text-sm text-slate-400">Medium Severity</div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4">
          <div className="text-2xl font-bold text-blue-400">
            {logsTriggered}/{totalLogs}
          </div>
          <div className="text-sm text-slate-400">Logs Triggered</div>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredThreats.map((threat) => {
          const SeverityIcon = getSeverityIcon(threat.severity);
          const isExpanded = expandedThreat === threat.id;

          return (
            <Card key={threat.id} className="bg-slate-900 border-slate-800 overflow-hidden">
              <Collapsible
                open={isExpanded}
                onOpenChange={() =>
                  setExpandedThreat(isExpanded ? null : threat.id)
                }
              >
                <CollapsibleTrigger className="w-full">
                  <div className="p-6 flex items-start gap-4 hover:bg-slate-800/50 transition-colors">
                    <div className={`p-3 rounded-lg ${getSeverityColor(threat.severity)}`}>
                      <SeverityIcon className="size-6" />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {threat.title}
                        </h3>

                        <div className="flex items-center gap-3">
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>

                          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg">
                            <Activity className="size-4 text-red-400" />
                            <span className="text-white font-semibold">
                              {threat.riskScore}
                            </span>
                          </div>

                          {isExpanded ? <ChevronDown /> : <ChevronRight />}
                        </div>
                      </div>

                      <div className="text-sm text-slate-400">
                        {threat.timestamp} • {threat.process} •{" "}
                        {threat.triggeredRules?.length || 0} rules triggered
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-6 pb-6 border-t border-slate-800 pt-6 space-y-6">

                    {/* Score Breakdown */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3">
                        Risk Score Breakdown
                      </h4>

                      <div className="space-y-2">
                        <div className="flex justify-between text-white">
                          <span className="text-slate-400">Rule Score</span>
                          <span className="text-white">+{threat.ruleScore}</span>
                        </div>

                        <div className="flex justify-between text-white">
                          <span className="text-slate-400">ML Score</span>
                          <span className="text-white">+{threat.mlScore}</span>
                        </div>

                        <div className="flex justify-between text-white">
                          <span className="text-slate-400">IOC Score</span>
                          <span className="text-white">+{threat.iocScore}</span>
                        </div>

                        <div className="border-t border-slate-800 pt-2 flex justify-between font-semibold text-white">
                          <span className="text-white">Total</span>
                          <span className="text-red-400">
                            {threat.riskScore}
                          </span>
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