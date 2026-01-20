import { useState } from "react";
import { LandingUpload } from "./components/LandingUpload";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [processedLogs, setProcessedLogs] = useState<any[]>([]);

  // Called AFTER CSV is parsed & preprocessed
  const handleUpload = (logs: any[]) => {
    console.log("Processed logs received in App:", logs);
    setProcessedLogs(logs);
    setHasUploadedFile(true);
  };

  const handleEndSession = () => {
    setHasUploadedFile(false);
    setProcessedLogs([]);
  };

  return (
    <div className="size-full">
      {!hasUploadedFile ? (
        <LandingUpload onUpload={handleUpload} />
      ) : (
        <Dashboard
          logs={processedLogs}
          onEndSession={handleEndSession}
        />
      )}
    </div>
  );
}
