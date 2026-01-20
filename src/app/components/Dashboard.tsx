import { useState } from "react";
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
import { AnalyticsSection } from "./AnalyticsSection";
import { ExportResults } from "./ExportResults";

interface DashboardProps {
  logs: any[];
  onEndSession: () => void;
}

type Section =
  | "overview"
  | "processing"
  | "logs"
  | "threats"
  | "mitre"
  | "analytics"
  | "export";

export function Dashboard({ logs, onEndSession }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>("overview");

  // Pipeline metadata (can later be dynamic)
  const stageTimings = {
    ingestion: 0.3,
    parsing: 1.2,
    ioc: 0.8,
    rules: 2.1,
    ml: 3.4,
    mitre: 0.5,
  };

  const pipelineStage = "Analysis Completed";

  const navItems = [
    { id: "overview" as Section, label: "Overview", icon: LayoutDashboard },
    { id: "processing" as Section, label: "Processing Status", icon: Activity },
    { id: "logs" as Section, label: "Log Inspection", icon: FileText },
    { id: "threats" as Section, label: "Threat Detection", icon: TriangleAlert },
    { id: "mitre" as Section, label: "MITRE ATT&CK Mapping", icon: Grid3x3 },
    { id: "analytics" as Section, label: "Analytics", icon: ChartBar },
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
                  ${
                    isActive
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
        {activeSection === "overview" && <OverviewSection />}

        {activeSection === "processing" && (
          <ProcessingStatus
            logsCount={logs.length}
            pipelineStage={pipelineStage}
            stageTimings={stageTimings}
          />
        )}

        {activeSection === "logs" && (
          <LogInspection logs={logs} />
        )}

        {activeSection === "threats" && <ThreatDetection />}
        {activeSection === "mitre" && <MitreMapping />}
        {activeSection === "analytics" && <AnalyticsSection />}

        {activeSection === "export" && (
          <ExportResults onEndSession={onEndSession} />
        )}
      </main>
    </div>
  );
}
