export interface IOCs {
  processName: string;
  processPath: string;
  parentProcess: string;
  commandLine: string;
  integrityLevel: string;
  timestamp?: string;
}

export type DetectionResult = Record<string, boolean>;

export type DetectionRule = {
  id: string;
  description: string;
  evaluate: (iocs: IOCs) => boolean;
};
