import { Card } from "./ui/card";
import { Check, Loader2, FileUp, Database, Search, Shield, Brain, Grid3x3 } from "lucide-react";

interface ProcessingStatusProps {
  logsCount: number;
  pipelineStage: string;
  stageTimings: Record<string, number>;
}

export function ProcessingStatus({
  logsCount,
  pipelineStage,
  stageTimings,
}: ProcessingStatusProps) {

  const pipelineSteps = [
    { id: 1, name: "Log Ingestion", icon: FileUp, key: "ingestion" },
    { id: 2, name: "Parsing & Normalization", icon: Database, key: "parsing" },
    { id: 3, name: "IOC Extraction", icon: Search, key: "ioc" },
    { id: 4, name: "Rule Engine", icon: Shield, key: "rules" },
    { id: 5, name: "ML Risk Scoring", icon: Brain, key: "ml" },
    { id: 6, name: "MITRE Mapping", icon: Grid3x3, key: "mitre" },
  ];

  const completedSteps = pipelineSteps.filter(
    (step) => stageTimings[step.key] !== undefined
  ).length;

  const totalTime = Object.values(stageTimings).reduce((a, b) => a + b, 0);
  const logsPerSecond = totalTime > 0 ? (logsCount / totalTime).toFixed(1) : "0";

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Processing Status</h1>
        <p className="text-slate-400">Analysis pipeline execution details</p>
      </div>

      {/* Overall Status */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Pipeline Status</h3>
            <p className="text-sm text-slate-400">{pipelineStage}</p>
          </div>
          <div className="flex items-center gap-2 bg-green-600/10 px-4 py-2 rounded-lg">
            <Check className="size-5 text-green-400" />
            <span className="text-green-400 font-semibold">Active</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all"
            style={{ width: `${(completedSteps / pipelineSteps.length) * 100}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white mb-1">{logsCount}</div>
            <div className="text-sm text-slate-400">Logs Processed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {totalTime.toFixed(2)}s
            </div>
            <div className="text-sm text-slate-400">Total Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{logsPerSecond}</div>
            <div className="text-sm text-slate-400">Logs/sec</div>
          </div>
        </div>
      </Card>

      {/* Pipeline Steps */}
      <div className="space-y-4">
        {pipelineSteps.map((step, index) => {
          const Icon = step.icon;
          const isComplete = stageTimings[step.key] !== undefined;
          const isProcessing = pipelineStage.toLowerCase().includes(step.name.toLowerCase());

          return (
            <Card key={step.id} className="bg-slate-900 border-slate-800 p-6 relative">
              {index < pipelineSteps.length - 1 && (
                <div className="absolute left-[47px] top-[72px] w-0.5 h-8 bg-slate-700" />
              )}

              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isComplete ? "bg-green-600/10" : "bg-slate-800"}`}>
                  {isProcessing ? (
                    <Loader2 className="size-6 text-blue-400 animate-spin" />
                  ) : (
                    <Icon className={`size-6 ${isComplete ? "text-green-400" : "text-slate-500"}`} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{step.name}</h3>
                    {isComplete && (
                      <span className="text-sm text-slate-500">
                        {stageTimings[step.key].toFixed(2)}s
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Processing Logs */}
      <Card className="bg-slate-900 border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Processing Logs</h3>
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm space-y-1">
          {Object.entries(stageTimings).map(([stage, time], idx) => (
            <div key={idx} className="text-green-400">
              [{time.toFixed(2)}s] {stage.toUpperCase()} completed
            </div>
          ))}
          <div className="text-blue-400">Analysis pipeline running successfully</div>
        </div>
      </Card>
    </div>
  );
}
