import { useMemo, useState } from "react";
import {
  Shield,
  LayoutDashboard,
  Activity,
  FileText,
  TriangleAlert,
  Grid3x3,
  ChartBar,
  Download,
  ChevronRight,
} from "lucide-react";

import { OverviewSection } from "./OverviewSection";
import { ProcessingStatus } from "./ProcessingStatus";
import { LogInspection } from "./LogInspection";
import { ThreatDetection } from "./ThreatDetection";
import { MitreMapping } from "./MitreMapping";
/*import { AnalyticsSection } from "./AnalyticsSection";*/
import { ExportResults } from "./ExportResults";
import { buildThreatsFromLogs, enrichLogsWithRisk } from "./ThreatBuilder";
import { runMLModel } from "../../ml/runModel";
import { evaluateLog } from "../detection/detectionEngine";   // ✅ NEW IMPORT
import PrivacyPolicy from "./PrivacyPolicy";

interface DashboardProps {
  logs: any[];
  timings: any;
  onEndSession: () => void;
}

type Section =
  | "overview"
  | "processing"
  | "logs"
  | "threats"
  | "mitre"
  | "analytics"
  | "privacy"
  | "export";

export function Dashboard({ logs, timings, onEndSession }: DashboardProps) {

  /* -----------------------------
     Run ML Model
  ----------------------------- */
  const mlResults = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    // console.log("Running ML model on logs...");

    const results = runMLModel(logs);

    // console.log("ML Model Results Sample:", results.slice(0, 5));

    return results;
  }, [logs]);

  const [activeSection, setActiveSection] = useState<Section>("overview");

  /* -----------------------------
     Risk Enrichment
  ----------------------------- */
  const enrichedLogs = useMemo(
    () => enrichLogsWithRisk(logs),
    [logs]
  );

  /* -----------------------------
     Threat Stats
  ----------------------------- */
  const threatStats = useMemo(() => {
    const threats = buildThreatsFromLogs(logs);

    const highCount = threats.filter(t => t.severity === "high").length;
    const criticalCount = threats.filter(t => t.severity === "critical").length;
    const mediumCount = threats.filter(t => t.severity === "medium").length;

    return {
      totalLogs: logs.length,
      logsTriggered: highCount + criticalCount + mediumCount,
      highCount,
      mediumCount,
      criticalCount,
      threats,
    };
  }, [logs]);

  /* -----------------------------
     MITRE Mapping Logs
     Only logs with detected MITRE techniques
  ----------------------------- */
  const mitreLogs = useMemo(() => {

    return logs
      .map((log) => {

        const detection = evaluateLog(log);

        return {
          ...log,
          mitre: detection.mitre
        };

      })
      .filter((log) => log.mitre && log.mitre.length > 0);

  }, [logs]);

  /* -----------------------------
     Pipeline metadata
  ----------------------------- */
  // const stageTimings = {
  //   ingestion: 0.3,
  //   parsing: 1.2,
  //   ioc: 0.8,
  //   rules: 2.1,
  //   ml: 3.4,
  //   mitre: 0.5,
  // };
  const stageTimings = timings || {};

  const pipelineStage = "Analysis Completed";

  const navItems = [
    { id: "overview" as Section, label: "Overview", icon: LayoutDashboard },
    { id: "processing" as Section, label: "Processing Status", icon: Activity },
    { id: "logs" as Section, label: "Log Inspection", icon: FileText },
    { id: "threats" as Section, label: "Threat Detection", icon: TriangleAlert },
    { id: "mitre" as Section, label: "MITRE ATT&CK Mapping", icon: Grid3x3 },
   
    {id: "privacy" as Section, label: "Privacy Policy", icon: Shield},
    { id: "export" as Section, label: "Export Results", icon: Download },
  ];

  return (
    <div className="h-screen flex bg-slate-950">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="size-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white">ALTM</div>
              <div className="text-xs text-slate-400">Analysis Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
              >
                <Icon className="size-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight className="size-4" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">

        {activeSection === "overview" && (
          <OverviewSection
            totalLogs={threatStats.totalLogs}
            logsTriggered={threatStats.logsTriggered}
            threats={threatStats.threats} 
            mitreLogs={mitreLogs}
          />
        )}

        {activeSection === "processing" && (
          <ProcessingStatus
            logsCount={logs.length}
            pipelineStage={pipelineStage}
            stageTimings={stageTimings}
          />
        )}

        {activeSection === "logs" && (
          <LogInspection logs={enrichedLogs} />
        )}

        {activeSection === "threats" && (
          <ThreatDetection
            logs={logs}
            precomputedThreats={threatStats.threats}
          />
        )}

        {/* ✅ MITRE PAGE NOW CONNECTED TO RULE ENGINE */}
        {activeSection === "mitre" && (
          <MitreMapping logs={mitreLogs} />
        )}


        {activeSection === "privacy" && <PrivacyPolicy />}

        {activeSection === "export" && (
          <ExportResults
            onEndSession={onEndSession}
            logs={logs}
            // logs={mitreLogs}
            threats={threatStats.threats}
            mitreLogs={mitreLogs}
            processingTime={
              stageTimings.ingestion +
              stageTimings.parsing +
              stageTimings.ioc +
              stageTimings.rules +
              stageTimings.ml +
              stageTimings.mitre
            }
          />
        )}
      </main>
    </div>
  );
}