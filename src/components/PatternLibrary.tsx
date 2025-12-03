import { AlertTriangle, Shield, AlertCircle } from 'lucide-react';
import { createSQLInjectionDetector } from '../lib/aho-corasick';
import { Badge } from './ui/badge';

export function PatternLibrary() {
  const detector = createSQLInjectionDetector();
  const patterns = detector.getPatterns();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="size-3" />;
      case 'high':
        return <AlertCircle className="size-3" />;
      default:
        return <Shield className="size-3" />;
    }
  };

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      {patterns.map((pattern) => (
        <div
          key={pattern.id}
          className="bg-slate-950 border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <code className="text-amber-400 text-sm font-mono">
              {pattern.pattern}
            </code>
            <Badge
              variant="outline"
              className={`text-xs ${getSeverityColor(pattern.severity)}`}
            >
              <span className="mr-1">{getSeverityIcon(pattern.severity)}</span>
              {pattern.severity}
            </Badge>
          </div>
          <div className="text-slate-400 text-xs">
            {pattern.description}
          </div>
        </div>
      ))}
      <div className="text-slate-500 text-xs text-center pt-2 border-t border-slate-700">
        Total Signatures: {patterns.length}
      </div>
    </div>
  );
}
