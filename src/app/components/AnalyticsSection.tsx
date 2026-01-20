import { Card } from "./ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const topProcesses = [
  { name: "powershell.exe", count: 23, risk: 78 },
  { name: "cmd.exe", count: 18, risk: 45 },
  { name: "mimikatz.exe", count: 2, risk: 98 },
  { name: "chrome.exe", count: 12, risk: 34 },
  { name: "winword.exe", count: 8, risk: 56 },
  { name: "svchost.exe", count: 45, risk: 12 },
];

const techniqueFrequency = [
  { technique: "T1059.001", name: "PowerShell", count: 8 },
  { technique: "T1027", name: "Obfuscation", count: 6 },
  { technique: "T1071.001", name: "Web Protocols", count: 5 },
  { technique: "T1003.001", name: "LSASS Memory", count: 4 },
  { technique: "T1566.001", name: "Phishing", count: 3 },
  { technique: "T1078", name: "Valid Accounts", count: 2 },
];

const riskHistogram = [
  { range: "0-20", count: 342 },
  { range: "21-40", count: 98 },
  { range: "41-60", count: 56 },
  { range: "61-80", count: 21 },
  { range: "81-100", count: 12 },
];

const activityTimeline = [
  { hour: "00:00", events: 12, high: 1 },
  { hour: "02:00", events: 8, high: 0 },
  { hour: "04:00", events: 15, high: 2 },
  { hour: "06:00", events: 23, high: 1 },
  { hour: "08:00", events: 45, high: 5 },
  { hour: "10:00", events: 67, high: 8 },
  { hour: "12:00", events: 89, high: 12 },
  { hour: "14:00", events: 156, high: 23 },
  { hour: "16:00", events: 78, high: 9 },
  { hour: "18:00", events: 34, high: 3 },
  { hour: "20:00", events: 18, high: 1 },
  { hour: "22:00", events: 4, high: 0 },
];

export function AnalyticsSection() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">Visual analysis and statistics</p>
      </div>

      {/* Top Row Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Suspicious Processes */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Suspicious Processes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProcesses} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" width={120} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="count" fill="#3b82f6" name="Event Count" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Technique Frequency */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">MITRE Technique Frequency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={techniqueFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="technique" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="count" fill="#8b5cf6" name="Detections" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Middle Row Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Risk Score Histogram */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskHistogram}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="range" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="count" fill="#10b981" name="Event Count" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity Timeline */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Activity Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="hour" stroke="#94a3b8" />
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
                name="All Events"
              />
              <Line 
                type="monotone" 
                dataKey="high" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="High Risk"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Process Risk Matrix */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Process Risk Matrix</h3>
        <div className="space-y-3">
          {topProcesses.map((process) => {
            const riskPercentage = process.risk;
            let riskColor = "bg-green-500";
            if (riskPercentage > 70) riskColor = "bg-red-500";
            else if (riskPercentage > 40) riskColor = "bg-yellow-500";

            return (
              <div key={process.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-mono">{process.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">{process.count} events</span>
                    <span className="text-sm font-semibold text-white w-12 text-right">
                      {process.risk}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`${riskColor} h-full transition-all`}
                    style={{ width: `${riskPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 p-4">
          <div className="text-sm text-slate-400 mb-1">Avg Risk Score</div>
          <div className="text-2xl font-bold text-white">47.3</div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-4">
          <div className="text-sm text-slate-400 mb-1">Peak Activity</div>
          <div className="text-2xl font-bold text-white">14:00</div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-4">
          <div className="text-sm text-slate-400 mb-1">Unique IPs</div>
          <div className="text-2xl font-bold text-white">23</div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-4">
          <div className="text-sm text-slate-400 mb-1">Avg Process/Min</div>
          <div className="text-2xl font-bold text-white">8.7</div>
        </Card>
      </div>
    </div>
  );
}
