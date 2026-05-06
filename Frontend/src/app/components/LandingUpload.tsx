import { useState } from "react";
import { Upload, Shield, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface LandingUploadProps {
  onUpload: (logs: any[], timings: any) => void;
}

export function LandingUpload({ onUpload }: LandingUploadProps) {

  const [error, setError] = useState("");
  const [lastUploadTime, setLastUploadTime] = useState(0);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(""), 4000);
  };

  /* -----------------------------
     SHA256 File Hash Generator
  ----------------------------- */

  const generateFileHash = async (file: File) => {

    const buffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  };

  /* -----------------------------
     File Upload + Backend Call
  ----------------------------- */

  const processFile = async (file: File) => {

    const now = Date.now();

    /* Upload cooldown */
    if (now - lastUploadTime < 2000) {
      showError("Please wait before uploading another file.");
      return;
    }

    setLastUploadTime(now);

    /* File size validation */
    if (file.size > MAX_FILE_SIZE) {
      showError("File too large. Maximum allowed size is 10MB.");
      return;
    }

    /* Extension validation */
    if (!file.name.toLowerCase().endsWith(".csv")) {
      showError("Security restriction: Only CSV log files are allowed.");
      return;
    }

    /* MIME validation */
    if (file.type !== "text/csv" && file.type !== "application/vnd.ms-excel") {
      showError("Invalid file format. Please upload a valid CSV file.");
      return;
    }

    /* Generate SHA256 hash */
    const hash = await generateFileHash(file);
    localStorage.setItem("uploaded_log_sha256", hash);

    /* Send file to backend */
    const formData = new FormData();
    formData.append("file", file);

    try {

      const res = await fetch("http://localhost:5000/analyze-logs", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Backend processing failed");
      }

      const data = await res.json();

      /* Send processed logs to parent (Dashboard) */
      onUpload(data.logs, data.timings);

    } catch (err) {
      console.error(err);
      showError("Failed to analyze logs via backend.");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (file) processFile(file);

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">

      <div className="max-w-3xl w-full space-y-6">

        {/* Error Alert */}
        {error && (
          <div className="animate-slide-in bg-red-500/10 border border-red-500/40 text-red-400 px-6 py-4 rounded-lg flex items-center gap-3">
            <AlertTriangle className="size-5" />
            <span>{error}</span>
          </div>
        )}

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

        {/* Upload Card */}
        <Card className="bg-slate-900/50 border-slate-800 p-8">

          <div className="text-center">

            <Upload className="size-16 text-slate-500 mx-auto mb-4" />

            <h3 className="text-xl font-semibold text-white mb-2">
              Upload your CSV log file
            </h3>

            <p className="text-slate-400 mb-6">
              Only <span className="text-blue-400 font-semibold">.csv</span> files are accepted
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />

            <label htmlFor="file-upload">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <span>Upload & Analyze</span>
              </Button>
            </label>

          </div>

        </Card>

      </div>

    </div>
  );
}