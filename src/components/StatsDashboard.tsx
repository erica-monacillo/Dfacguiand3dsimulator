import { Activity, Zap, Target, TrendingUp } from 'lucide-react';

interface StatsDashboardProps {
  processedChars: number;
  detectionResults: any[];
  activeStates: number[];
}

export function StatsDashboard({ processedChars, detectionResults, activeStates }: StatsDashboardProps) {
  const isMalicious = detectionResults.length > 0;
  const threatLevel = detectionResults.length >= 3 ? 'CRITICAL' : detectionResults.length >= 2 ? 'HIGH' : detectionResults.length === 1 ? 'MEDIUM' : 'SAFE';
  const threatColor = threatLevel === 'CRITICAL' ? 'text-red-400' : threatLevel === 'HIGH' ? 'text-orange-400' : threatLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <Activity className="size-5 text-cyan-400" />
          <span className="text-xs text-slate-500">Chars</span>
        </div>
        <div className="text-2xl text-cyan-400">{processedChars}</div>
        <div className="text-xs text-slate-400">Characters Processed</div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <Zap className="size-5 text-purple-400" />
          <span className="text-xs text-slate-500">State</span>
        </div>
        <div className="text-2xl text-purple-400">
          q{activeStates[0] ?? 0}
        </div>
        <div className="text-xs text-slate-400">Current DFA State</div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <Target className="size-5 text-amber-400" />
          <span className="text-xs text-slate-500">Matches</span>
        </div>
        <div className="text-2xl text-amber-400">
          {detectionResults.length}
        </div>
        <div className="text-xs text-slate-400">Patterns Detected</div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <TrendingUp className="size-5 text-red-400" />
          <span className="text-xs text-slate-500">Level</span>
        </div>
        <div className={`text-2xl ${threatColor}`}>
          {threatLevel}
        </div>
        <div className="text-xs text-slate-400">Threat Level</div>
      </div>
    </div>
  );
}
