import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { FileDown, LogOut, TriangleAlert } from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportResultsProps {
  onEndSession: () => void;
  logs?: any[];
  threats?: any[];
  mitreLogs?: any[];
  processingTime?: number;
}

export function ExportResults({
  onEndSession,
  logs = [],
  threats = [],
  mitreLogs = [],
  processingTime = 0
}: ExportResultsProps) {

  const totalLogs = logs.length;
  const suspiciousEvents = threats.length;

  const criticalThreats = threats.filter((t: any) => t.severity === "critical").length;
  const highThreats = threats.filter((t: any) => t.severity === "high").length;
  const mediumThreats = threats.filter((t: any) => t.severity === "medium").length;

  const highRiskEvents = criticalThreats + highThreats;

  /* ---------------- MITRE ---------------- */

  const mitreSet = new Set<string>();
  const mitreMap = new Map();

  mitreLogs.forEach((log: any) => {
    if (Array.isArray(log.mitre)) {
      log.mitre.forEach((tech: any) => {
        if (tech?.id) {
          mitreSet.add(tech.id);

          if (!mitreMap.has(tech.id)) {
            mitreMap.set(tech.id, [
              tech.id,
              tech.name || "-",
              tech.tactic || "-"
            ]);
          }
        }
      });
    }
  });

  const mitreTechniques = mitreSet.size;
  const mitreRows = Array.from(mitreMap.values());

  /* ---------------- IOC ---------------- */

  let iocCount = 0;
  const iocRows: any[] = [];

  threats.forEach((t: any) => {
    if (t.iocs) {
      iocCount += t.iocs.length;
      t.iocs.forEach((ioc: any) => {
        iocRows.push([ioc.type, ioc.value]);
      });
    }
  });

  /* ---------------- RULES ---------------- */

  let ruleCount = 0;
  const ruleRows: any[] = [];

  threats.forEach((t: any) => {
    if (t.triggeredRules) {
      ruleCount += t.triggeredRules.length;
      t.triggeredRules.forEach((rule: any) => {
        ruleRows.push([rule]);
      });
    }
  });

  /* ---------------- PDF ---------------- */

  const downloadThreatReport = () => {

    const doc = new jsPDF();

    /* HEADER */
    doc.setFontSize(22);
    doc.text("ALTM", 14, 20);

    doc.setFontSize(14);
    doc.text("Automated Log Threat Mapper", 14, 28);

    doc.setFontSize(12);
    doc.text("Threat Analysis Report", 14, 36);

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 44);

    /* SUMMARY */
    doc.setFontSize(14);
    doc.text("Analysis Summary", 14, 60);

    autoTable(doc, {
      startY: 65,
      head: [["Metric", "Value"]],
      body: [
        ["Total Logs Processed", totalLogs],
        ["Suspicious Events", suspiciousEvents],
        ["High Risk Events", highRiskEvents],
        ["Critical Threats", criticalThreats],
        ["High Severity", highThreats],
        ["Medium Severity", mediumThreats],
        ["MITRE Techniques", mitreTechniques],
        ["IOCs Extracted", iocCount],
        ["Rules Triggered", ruleCount],
        ["Processing Time (s)", processingTime.toFixed(2)]
      ]
    });

    /* MITRE TABLE */
    if (mitreRows.length > 0) {
      doc.text("MITRE ATT&CK Techniques", 14, (doc as any).lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [["ID", "Technique", "Tactic"]],
        body: mitreRows
      });
    }

    /* 🔥 MITRE RESPONSE PLAYBOOK */

    const playbookRows: any[] = [];

    const seen = new Set();

    mitreLogs.forEach((log: any) => {
      if (Array.isArray(log.mitre)) {

        log.mitre.forEach((tech: any) => {

          if (tech?.id && !seen.has(tech.id)) {

            seen.add(tech.id);

            playbookRows.push([
              tech.id,
              tech.name,
              tech.tactic,

              `PREVENTION:\n${tech.response?.prevention || "-"}

DETECTION:\n${tech.response?.detection || "-"}

CONTAINMENT:\n${tech.response?.containment || "-"}

ERADICATION:\n${tech.response?.eradication || "-"}

RECOVERY:\n${tech.response?.recovery || "-"}

MONITORING:\n${tech.response?.monitoring || "-"}`
            ]);

          }

        });

      }
    });

    if (playbookRows.length > 0) {

      doc.addPage();
      doc.setFontSize(14);
      doc.text("MITRE Response Playbook", 14, 20);

      autoTable(doc, {
        startY: 25,
        head: [["ID", "Technique", "Tactic", "Response Flow"]],
        body: playbookRows,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          valign: "top"
        },
        columnStyles: {
          3: { cellWidth: 100 }
        }
      });

    }

    /* SUSPICIOUS LOGS */
    const suspiciousRows = threats.map((t: any) => [
      t.timestamp || "-",
      t.process || "-",
      (t.triggeredRules || []).join(", ")
    ]);

    if (suspiciousRows.length > 0) {
      doc.addPage();
      doc.text("Suspicious Events", 14, 20);

      autoTable(doc, {
        startY: 25,
        head: [["Time", "Process", "Rules"]],
        body: suspiciousRows
      });
    }

    /* IOC */
    if (iocRows.length > 0) {
      doc.addPage();
      doc.text("Indicators of Compromise", 14, 20);

      autoTable(doc, {
        startY: 25,
        head: [["Type", "Value"]],
        body: iocRows
      });
    }

    /* RULES */
    if (ruleRows.length > 0) {
      doc.addPage();
      doc.text("Triggered Rules", 14, 20);

      autoTable(doc, {
        startY: 25,
        head: [["Rule"]],
        body: ruleRows
      });
    }

    doc.save("ALTM_Threat_Report.pdf");
  };

  return (
    <div className="p-8 space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Export Results
        </h1>
        <p className="text-slate-400">
          Download analysis reports and end session
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Analysis Summary
        </h3>

        <div className="grid grid-cols-2 gap-6">

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Logs</span>
              <span className="text-white">{totalLogs}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Suspicious</span>
              <span className="text-yellow-400">{suspiciousEvents}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">High Risk</span>
              <span className="text-red-400">{highRiskEvents}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">MITRE</span>
              <span className="text-white">{mitreTechniques}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">IOCs</span>
              <span className="text-white">{iocCount}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Rules</span>
              <span className="text-white">{ruleCount}</span>
            </div>
          </div>

        </div>
      </Card>

      <Card className="bg-slate-900 border-slate-800 p-6 flex justify-between">
        <div>
          <h3 className="text-white text-lg">Threat Report</h3>
          <p className="text-slate-400 text-sm">
            Download full SOC-style report
          </p>
        </div>

        <Button
  onClick={downloadThreatReport}
  className="bg-blue-600 hover:bg-blue-700 text-white"
>
  <FileDown className="mr-2 size-4" />
  Download
</Button>
      </Card>

      <Card className="bg-red-950/20 border-red-900 p-6">
        <Button onClick={onEndSession} className="bg-red-600">
          <LogOut className="mr-2 size-4" />
          End Session
        </Button>
      </Card>

    </div>
  );
}