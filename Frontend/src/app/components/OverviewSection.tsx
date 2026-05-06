import { Card } from "./ui/card";
import { FileText, AlertTriangle, ShieldAlert, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface OverviewSectionProps {
  totalLogs: number;
  logsTriggered: number;
  logs?: any[];
  threats?: any[];
  mitreLogs?: any[];
}

export function OverviewSection({
  totalLogs,
  logsTriggered,
  logs = [],
  threats = [],
  mitreLogs = []
}: OverviewSectionProps) {

  /* -----------------------------
     ✅ Severity Counts (SOURCE OF TRUTH)
  ----------------------------- */

  const criticalCount = threats.filter(
    (t: any) => t.severity === "critical"
  ).length;

  const highCount = threats.filter(
    (t: any) => t.severity === "high"
  ).length;

  const mediumCount = threats.filter(
    (t: any) => t.severity === "medium"
  ).length;

  const highRiskEvents = criticalCount + highCount;

  /* -----------------------------
     ✅ Risk Distribution (Pie Chart)
     (filters 0 values for cleaner UI)
  ----------------------------- */
  const riskDistribution = [
    { name: "Medium", value: mediumCount, color: "#f59e0b" },
    { name: "High", value: highCount, color: "#fe7c58" },
    { name: "Critical", value: criticalCount, color: "#fa0000" },
  ].filter(item => item.value > 0);

  /* -----------------------------
     Events Over Time (BAR GRAPH)
  ----------------------------- */
  const eventsData = [
    {
      name: "Logs",
      total: totalLogs,
      suspicious: logsTriggered,
    },
  ];

  /* -----------------------------
     MITRE Techniques Count
  ----------------------------- */
  const mitreSet = new Set<string>();

  mitreLogs?.forEach((log: any) => {
    if (Array.isArray(log.mitre)) {
      log.mitre.forEach((tech: any) => {
        if (tech?.id) {
          mitreSet.add(tech.id);
        }
      });
    }
  });

  const mitreTechniques = mitreSet.size;

  /* -----------------------------
     IOC Count
  ----------------------------- */
  let iocCount = 0;

  threats.forEach((t: any) => {
    if (Array.isArray(t.iocs)) {
      iocCount += t.iocs.length;
    }
  });

  /* -----------------------------
     Rule Match Count
  ----------------------------- */
  let ruleMatches = 0;

  threats.forEach((t: any) => {
    if (t.triggeredRules) ruleMatches += t.triggeredRules.length;
  });

  /* -----------------------------
     Unique Processes
  ----------------------------- */
  const uniqueProcesses = new Set(
    logs.map((l: any) => l.processName || l.Image)
  );

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
        <p className="text-slate-400">
          Session analysis summary and key metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">

        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="bg-blue-600/10 p-3 rounded-lg mb-4">
            <FileText className="size-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totalLogs}</div>
          <div className="text-sm text-slate-400">Total Logs Processed</div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="bg-yellow-600/10 p-3 rounded-lg mb-4">
            <AlertTriangle className="size-6 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white">{logsTriggered}</div>
          <div className="text-sm text-slate-400">Suspicious Events</div>
        </Card>

        {/* ✅ FIXED HIGH RISK */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="bg-red-600/10 p-3 rounded-lg mb-4">
            <ShieldAlert className="size-6 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {highRiskEvents}
          </div>
          <div className="text-sm text-slate-400">High Risk Events</div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="bg-purple-600/10 p-3 rounded-lg mb-4">
            <Clock className="size-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">24h</div>
          <div className="text-sm text-slate-400">Log Time Range</div>
        </Card>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">

        {/* Risk Distribution */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Risk Score Distribution
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>

              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />

            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Events Over Time */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Events Over Time
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventsData} barCategoryGap="35%" barGap={4}>

              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

              <XAxis dataKey="name" stroke="#94a3b8" />

              <YAxis
                stroke="#94a3b8"
                label={{
                  value: "Log Count",
                  angle: -90,
                  position: "insideLeft"
                }}
              />

              <Tooltip />
              <Legend />

              <Bar dataKey="total" fill="#3b82f6" name="Total Logs" />
              <Bar dataKey="suspicious" fill="#ef4444" name="Suspicious Logs" />

            </BarChart>
          </ResponsiveContainer>
        </Card>

      </div>
    </div>
  );
}