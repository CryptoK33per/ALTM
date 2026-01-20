import { useState } from "react";
import Papa from "papaparse";
import { Upload, FileJson, FileSpreadsheet, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface LandingUploadProps {
  onUpload: (logs: any[]) => void; // ✅ CHANGED
}

export function LandingUpload({ onUpload }: LandingUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /* -----------------------------
     CSV / JSON Parsing Logic
  ----------------------------- */
  const processFile = (file: File) => {
    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

    transformHeader: (header) =>
      header
        .trim()
      .replace(/\s+/g, " "), // 🔥 NORMALIZES CSV HEADERS

  complete: (result) => {
    const parsedLogs = result.data as any[];
    console.log("Normalized headers:", Object.keys(parsedLogs[0] || {}));
    onUpload(parsedLogs);
  },
});

    } else if (file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          const logsArray = Array.isArray(parsed) ? parsed : [];
          console.log("Parsed JSON logs:", logsArray);
          onUpload(logsArray); // ✅ FINAL FIX
        } catch (err) {
          console.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSampleData = () => {
    // Optional: simple demo dataset
    const sampleLogs = [
      {
        "Date and Time": "2026-01-01 12:00:00",
        "Event ID": 1,
        "Process Name (Image)": "powershell.exe",
        "Parent Process Name": "cmd.exe",
        "Command Line": "powershell.exe -enc ...",
        "User / Integrity Level": "SYSTEM | High",
        "Hashes": "SHA256=demo",
      },
    ];
    onUpload(sampleLogs);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Shield className="size-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Automated Log Threat Mapper
          </h1>
          <p className="text-xl text-slate-400">
            Session-based Sysmon Log Threat Analysis Tool
          </p>
        </div>

        {/* Upload Area */}
        <Card className="bg-slate-900/50 border-slate-800 p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-all
              ${
                isDragging
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 hover:border-slate-600 bg-slate-900/30"
              }
            `}
          >
            <Upload className="size-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Drop your log files here
            </h3>
            <p className="text-slate-400 mb-6">or click to browse</p>

            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <span>Upload & Analyze</span>
              </Button>
            </label>
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSampleData}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Use Sample Dataset
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
