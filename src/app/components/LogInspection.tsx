import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, SlidersHorizontal, Eye, Code } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

/* -----------------------------
   Props
----------------------------- */
interface LogInspectionProps {
  logs?: any[];
}

/* -----------------------------
   Helper: Safe field resolver
----------------------------- */
const getField = (log: any, keys: string[], fallback = "Unknown") => {
  for (const key of keys) {
    if (log[key] !== undefined && log[key] !== null && log[key] !== "") {
      return String(log[key]);
    }
  }
  return fallback;
};

/* -----------------------------
   Component
----------------------------- */
export function LogInspection({ logs = [] }: LogInspectionProps) {
  const [viewMode, setViewMode] = useState<"normalized" | "raw">("normalized");
  const [searchTerm, setSearchTerm] = useState("");

  /* -----------------------------
     Normalize logs SAFELY
  ----------------------------- */
  const normalizedLogs = useMemo(() => {
    return logs.map((log, index) => ({
      id: index,
      timestamp: getField(log, ["Date and Time", "UtcTime", "Timestamp"]),
      eventId: getField(log, ["Event ID", "EventId", "EventID"]),
      processName: getField(log, [
        "Process Name (Image)",
        "Process Name",
        "Image",
        "ProcessPath",
      ]),
      parentProcess: getField(log, [
        "Parent Process Name",
        "ParentImage",
        "Parent Process",
      ]),
      commandLine: getField(log, ["Command Line", "CommandLine"]),
      user: getField(log, [
        "User / Integrity Level",
        "User",
        "UserName",
      ]),
      risk: "low", // placeholder (future ML / rules)
    }));
  }, [logs]);

  /* -----------------------------
     Search filter
  ----------------------------- */
  const filteredLogs = normalizedLogs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.processName.toLowerCase().includes(term) ||
      log.commandLine.toLowerCase().includes(term) ||
      log.parentProcess.toLowerCase().includes(term)
    );
  });

  /* -----------------------------
     Risk color
  ----------------------------- */
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  /* -----------------------------
     Render
  ----------------------------- */
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Log Inspection
        </h1>
        <p className="text-slate-400">
          Detailed view of processed Sysmon events
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by process, command line, or parent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-950 border-slate-700 text-white"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
            <Button
              size="sm"
              onClick={() => setViewMode("normalized")}
              className={viewMode === "normalized" ? "bg-blue-600" : ""}
            >
              <Eye className="size-4 mr-2" />
              Normalized
            </Button>
            <Button
              size="sm"
              onClick={() => setViewMode("raw")}
              className={viewMode === "raw" ? "bg-blue-600" : ""}
            >
              <Code className="size-4 mr-2" />
              Raw
            </Button>
          </div>

          <Button variant="outline" className="border-slate-700 text-slate-300">
            <SlidersHorizontal className="size-4 mr-2" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="bg-slate-900 border-slate-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Risk</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Event ID</TableHead>
              <TableHead>Process Name</TableHead>
              <TableHead>Parent Process</TableHead>
              <TableHead>Command Line</TableHead>
              <TableHead>User</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`size-2 rounded-full ${getRiskColor(log.risk)}`} />
                      <span className="capitalize">{log.risk}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell>{log.eventId}</TableCell>
                  <TableCell className="text-blue-400 font-mono">
                    {log.processName}
                  </TableCell>
                  <TableCell className="font-mono text-slate-400">
                    {log.parentProcess}
                  </TableCell>
                  <TableCell className="truncate font-mono text-xs">
                    {log.commandLine}
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-500 py-6">
                  No logs available. Upload a CSV file to begin analysis.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
