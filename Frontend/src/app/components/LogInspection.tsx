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
// import { runMLModel } from "../../ml/runModel";

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
   Risk dot color (TEXT ALWAYS WHITE)
----------------------------- */
const getRiskDotColor = (risk: string) => {
  switch (risk) {
    case "critical":
      return "bg-red-600";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-yellow-400";
    default:
      return "bg-emerald-500"; // low
  }
};

/* -----------------------------
   Component
----------------------------- */
export function LogInspection({ logs = [] }: LogInspectionProps) {
  console.log("LogInspection received logs:", logs.length);
  console.log("FIRST LOG:", logs[0]);
  console.log("SECOND LOG:", logs[1]);
  console.log("TENTH LOG:", logs[9]);
  // console.log("MID LOG:", logs[500]);
  // console.log("LAST LOG:", logs[logs.length - 1]);

  const formatText = (value: string) => {
    if (!value || value === "Unknown") return "Unknown";

    // Fix drive letter only (c:\ → C:\)
    value = value.replace(/^[a-z]:/, (match) => match.toUpperCase());
    // value = value.replace(/\b[a-z]/g, (char) => char.toUpperCase());

    // Fix NT AUTHORITY specifically
    value = value.replace(
      /nt authority\\system/gi,
      "NT AUTHORITY\\SYSTEM"
    );

    return value;
  };



  const [viewMode, setViewMode] = useState<"normalized" | "raw">("normalized");
  const [searchTerm, setSearchTerm] = useState("");

  /* -----------------------------
     Normalize logs
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
      hashes: getField(log, ["hashes", "Hashes"]),
      risk: (log.risk || "low").toLowerCase(), // <-- real risk input
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
              <TableHead className="text-blue-400">Risk</TableHead>
              <TableHead className="text-blue-400">Timestamp</TableHead>
              <TableHead className="text-blue-400">Event ID</TableHead>
              <TableHead className="text-blue-400">Process Name</TableHead>
              <TableHead className="text-blue-400">Parent Process</TableHead>
              <TableHead className="text-blue-400">Command Line</TableHead>
              <TableHead className="text-blue-400">User</TableHead>
              <TableHead className="text-blue-400">Hashes</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  {/* Risk */}
                  <TableCell className="text-white">
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${getRiskDotColor(
                          log.risk
                        )}`}
                      />
                      <span className="capitalize">{log.risk}</span>
                    </div>
                  </TableCell>

                  {/* Timestamp */}
                  <TableCell className="font-mono text-sm text-white whitespace-normal break-words">
                    {log.timestamp}
                  </TableCell>

                  {/* Event ID */}
                  <TableCell className="text-white">
                    {log.eventId}
                  </TableCell>

                  {/* Process Name (highlighted) */}
                  <TableCell className="text-blue-400 font-mono whitespace-normal break-all">
                  {/* <TableCell className="text-blue-400 font-mono whitespace-pre-wrap break-words max-w-[250px]"> */}

                    {formatText(log.processName)}
                  </TableCell>

                  {/* Parent Process */}
                  <TableCell className="font-mono text-white whitespace-normal break-all">
                  {/* <TableCell className="font-mono text-white whitespace-pre-wrap break-words max-w-[250px]"> */}
                    {formatText(log.parentProcess)}
                  </TableCell>

                  {/* Command Line */}
                  <TableCell className="font-mono text-xs text-white whitespace-normal break-all">
                  {/* <TableCell className="font-mono text-xs text-white whitespace-pre-wrap break-words max-w-[400px]"> */}
                    {formatText(log.commandLine)}
                  </TableCell>

                  {/* User */}
                  <TableCell className="text-white">
                  {/* <TableCell className="font-mono text-xs text-white whitespace-pre-wrap break-words max-w-[250px]"> */}
                    {formatText(log.user)}
                  </TableCell>

                  {/* Hashes */}
                  <TableCell className="font-mono text-xs text-white whitespace-normal break-all">
                  {/* <TableCell className="font-mono text-xs text-white whitespace-pre-wrap break-words max-w-[250px]"> */}
                    {log.hashes}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-slate-500 py-6"
                >
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
