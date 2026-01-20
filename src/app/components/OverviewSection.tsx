import { Card } from "./ui/card";
import { FileText, AlertTriangle, ShieldAlert, Clock } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const riskDistribution = [
  { name: "Low", value: 342, color: "#10b981" },
  { name: "Medium", value: 128, color: "#f59e0b" },
  { name: "High", value: 47, color: "#ef4444" },
  { name: "Critical", value: 12, color: "#dc2626" },
];

const eventsOverTime = [
  { time: "00:00", events: 45, suspicious: 3 },
  { time: "04:00", events: 32, suspicious: 1 },
  { time: "08:00", events: 89, suspicious: 12 },
  { time: "12:00", events: 156, suspicious: 23 },
  { time: "16:00", events: 134, suspicious: 18 },
  { time: "20:00", events: 73, suspicious: 8 },
];

export function OverviewSection() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
        <p className="text-slate-400">Session analysis summary and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-blue-600/10 p-3 rounded-lg">
              <FileText className="size-6 text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">529</div>
          <div className="text-sm text-slate-400">Total Logs Processed</div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-yellow-600/10 p-3 rounded-lg">
              <AlertTriangle className="size-6 text-yellow-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">65</div>
          <div className="text-sm text-slate-400">Suspicious Events</div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-red-600/10 p-3 rounded-lg">
              <ShieldAlert className="size-6 text-red-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">12</div>
          <div className="text-sm text-slate-400">High-Risk Events</div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-purple-600/10 p-3 rounded-lg">
              <Clock className="size-6 text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">24h</div>
          <div className="text-sm text-slate-400">Log Time Range</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Risk Score Distribution */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Events Over Time */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Events Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={eventsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="events" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Total Events"
              />
              <Line 
                type="monotone" 
                dataKey="suspicious" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Suspicious"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Additional Stats */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Detection Summary</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-1">47</div>
            <div className="text-sm text-slate-400">MITRE Techniques Detected</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">89</div>
            <div className="text-sm text-slate-400">IOCs Extracted</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400 mb-1">23</div>
            <div className="text-sm text-slate-400">Rule Matches</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 mb-1">8</div>
            <div className="text-sm text-slate-400">Unique Processes</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
