import { evaluateLog } from "../detection/detectionEngine";

/* -----------------------------
   Types
----------------------------- */
export interface Threat {
    id: number;
    title: string;
    severity: "critical" | "high" | "medium";
    riskScore: number;
    timestamp: string;
    process: string;
    triggeredRules: string[];
    iocs: { type: string; value: string }[];
    mitreMapping: string[];
}

/* -----------------------------
   🔥 RULE WEIGHTS (CORE LOGIC)
----------------------------- */
const RULE_WEIGHTS: Record<string, number> = {
    encoded_powershell: 25,
    powershell_download: 30,
    certutil_download: 30,
    rundll32_abuse: 22,
    mshta_execution: 25,

    office_to_script: 18,
    script_to_lolbin: 22,
    browser_to_script: 15,

    registry_run_key: 35,
    scheduled_task: 35,

    weird_time_script: 10,
    weird_time_download: 10
};

/* -----------------------------
   Threat Builder
----------------------------- */
export function buildThreatsFromLogs(logs: any[]): Threat[] {
    return logs
        .map<Threat | null>((log, index) => {
            const { result, iocs } = evaluateLog(log);

            const triggeredRules = Object.entries(result)
                .filter(([, fired]) => fired)
                .map(([ruleId]) =>
                    ruleId.replaceAll("_", " ")
                );

            if (triggeredRules.length === 0) return null;

            /* -----------------------------
               🔥 UPDATED SCORING (RULE + ML)
            ----------------------------- */

            let riskScore = 0;

            /*
            🔥 RULE-BASED SCORING (PRIMARY)
            */
            Object.entries(result).forEach(([ruleId, fired]) => {
                if (fired) {
                    const weight = RULE_WEIGHTS[ruleId] ?? 5;
                    riskScore += weight;
                }
            });

            /*
            🔥 ML CONTRIBUTION (SECONDARY)
            */
            const mlConfidence = log.confidence ?? 0; // 0–1
            const mlClass = log.prediction ?? 0;      // 0–4

            riskScore += mlConfidence * 20;

            if (mlClass === 3) riskScore += 15; // Persistence
            if (mlClass === 4) riskScore += 12; // Defense Evasion
            if (mlClass === 1) riskScore += 10; // Execution
            if (mlClass === 2) riskScore += 5;  // Suspicious

            /*
            🔥 NORMALIZE
            */
            riskScore = Math.min(Math.round(riskScore), 100);

            /*
            🔥 SEVERITY MAPPING
            */
            let severity: Threat["severity"];

            if (riskScore >= 85) severity = "critical";
            else if (riskScore >= 60) severity = "high";
            else severity = "medium";

            /* ----------------------------- */

            return {
                id: index,
                title: "Suspicious Execution Detected",
                severity,
                riskScore,
                timestamp: iocs.timestamp ?? "Unknown",
                process: iocs.processName,
                triggeredRules,
                iocs: [
                    { type: "Process", value: iocs.processName },
                    { type: "Command Line", value: iocs.commandLine },
                    { type: "Parent", value: iocs.parentProcess },
                    { type: "Integrity", value: iocs.integrityLevel },
                ],
                mitreMapping: [],
            };
        })
        .filter((t): t is Threat => t !== null);
}

/* -----------------------------
   Enrich Logs with Severity
----------------------------- */
export function enrichLogsWithRisk(logs: any[]) {
    const threats = buildThreatsFromLogs(logs);

    const threatMap = new Map<number, string>();
    threats.forEach((threat) => {
        threatMap.set(threat.id, threat.severity);
    });

    return logs.map((log, index) => ({
        ...log,
        risk: threatMap.get(index) ?? "low",
    }));
}