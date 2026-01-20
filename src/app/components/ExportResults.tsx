import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { FileDown, FileText, FileSpreadsheet, LogOut, TriangleAlert } from "lucide-react";
import { Badge } from "./ui/badge";

interface ExportResultsProps {
  onEndSession: () => void;
}

export function ExportResults({ onEndSession }: ExportResultsProps) {
  const handleExport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Export Results</h1>
        <p className="text-slate-400">Download analysis reports and end session</p>
      </div>

      {/* Analysis Summary */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Analysis Summary</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Logs Processed</span>
              <span className="text-white font-semibold">529</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Suspicious Events</span>
              <span className="text-yellow-400 font-semibold">65</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">High-Risk Events</span>
              <span className="text-red-400 font-semibold">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Critical Threats</span>
              <span className="text-red-400 font-semibold">2</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">MITRE Techniques</span>
              <span className="text-white font-semibold">47</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">IOCs Extracted</span>
              <span className="text-white font-semibold">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Rules Triggered</span>
              <span className="text-white font-semibold">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Processing Time</span>
              <span className="text-white font-semibold">8.3s</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-2 gap-6">
        {/* CSV Export */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-green-600/10 p-3 rounded-lg">
              <FileSpreadsheet className="size-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Export as CSV</h3>
              <p className="text-sm text-slate-400">
                Download raw data and analysis results in CSV format
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="size-1.5 bg-slate-500 rounded-full" />
              <span>All processed logs</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="size-1.5 bg-slate-500 rounded-full" />
              <span>Threat detection results</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="size-1.5 bg-slate-500 rounded-full" />
              <span>IOC list</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="size-1.5 bg-slate-500 rounded-full" />
              <span>MITRE mappings</span>
            </div>
          </div>

          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => handleExport('csv')}
          >
            <FileDown className="size-4 mr-2" />
            Download CSV
          </Button>
        </Card>

        {/* PDF Export */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-blue-600/10 p-3 rounded-lg">
              <FileText className="size-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Export as PDF</h3>
              <p className="text-sm text-slate-400">
                Generate comprehensive analysis report in PDF format
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="size-1.5 bg-slate-500 rounded-full" />
              <span>Executive summary</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="size-1.5 bg-slate-500 rounded-full" />
              <span>Detailed threat analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="size-1.5 bg-slate-500 rounded-full" />
              <span>Visual charts and graphs</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="size-1.5 bg-slate-500 rounded-full" />
              <span>Recommendations</span>
            </div>
          </div>

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => handleExport('pdf')}
          >
            <FileDown className="size-4 mr-2" />
            Download PDF
          </Button>
        </Card>
      </div>

      {/* Export Preview */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Report Preview</h3>
        <div className="bg-slate-950 rounded-lg p-6 space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <h4 className="text-white font-semibold mb-2">AUTOMATED LOG THREAT MAPPER</h4>
            <p className="text-sm text-slate-400">Analysis Report</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Session ID:</span>
              <span className="text-slate-300 font-mono">SESS-20260104-143215</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Analysis Date:</span>
              <span className="text-slate-300">January 4, 2026 14:32 UTC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Log Time Range:</span>
              <span className="text-slate-300">24 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Events:</span>
              <span className="text-slate-300">529</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <div className="text-sm text-slate-400 mb-2">Threat Summary:</div>
            <div className="flex gap-2">
              <Badge className="bg-red-600 text-white">2 Critical</Badge>
              <Badge className="bg-orange-600 text-white">2 High</Badge>
              <Badge className="bg-yellow-600 text-white">1 Medium</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* End Session */}
      <Card className="bg-red-950/20 border-red-900 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-red-600/10 p-3 rounded-lg shrink-0">
            <AlertTriangle className="size-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">End Session</h3>
            <p className="text-slate-300 mb-4">
              Ending your session will clear all analysis data from memory. Make sure to export any 
              reports you need before proceeding. This action cannot be undone.
            </p>
            <Button 
              variant="destructive"
              size="lg"
              onClick={onEndSession}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="size-4 mr-2" />
              End Session & Clear Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-sm text-slate-500">
        <p>All analysis is performed in-session with no persistent storage.</p>
        <p>Data is automatically cleared when you close the browser or end the session.</p>
      </div>
    </div>
  );
}