import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Match } from '../lib/aho-corasick';

interface DetectionResultsProps {
  results: Match[];
}

export function DetectionResults({ results }: DetectionResultsProps) {
  const isMalicious = results.length > 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        {isMalicious ? (
          <>
            <XCircle className="size-5 text-red-400" />
            <h2 className="text-red-400">Threat Detected</h2>
          </>
        ) : (
          <>
            <CheckCircle className="size-5 text-green-400" />
            <h2 className="text-green-400">Analysis Results</h2>
          </>
        )}
      </div>

      {isMalicious ? (
        <div className="space-y-3">
          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="size-5 text-red-400" />
              <span className="text-red-300">
                ALERT: Malicious SQL Injection Detected
              </span>
            </div>
            <p className="text-red-200 text-sm">
              {results.length} malicious pattern{results.length > 1 ? 's' : ''} found in payload.
              Immediate action recommended.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-slate-300 text-sm">Detected Patterns:</h3>
            {results.map((match, index) => (
              <div
                key={index}
                className="bg-slate-950 border border-red-900/50 rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-500" />
                    <code className="text-red-400 text-sm font-mono">
                      {match.pattern.name}
                    </code>
                  </div>
                  <span className="text-xs text-slate-500">
                    pos: {match.position}
                  </span>
                </div>
                <p className="text-slate-400 text-xs ml-4">
                  {match.pattern.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
            <h4 className="text-slate-300 text-sm mb-2">Recommended Actions:</h4>
            <ul className="text-slate-400 text-xs space-y-1 ml-4">
              <li>• Block the incoming request immediately</li>
              <li>• Log the IP address and payload for analysis</li>
              <li>• Alert security team for investigation</li>
              <li>• Review application input validation</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="size-5 text-green-400" />
              <span className="text-green-300">Clean Payload</span>
            </div>
            <p className="text-green-200 text-sm">
              No SQL injection signatures detected. Payload appears safe.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
            <h4 className="text-slate-300 text-sm mb-2">Status:</h4>
            <ul className="text-slate-400 text-xs space-y-1 ml-4">
              <li>✓ No malicious patterns detected</li>
              <li>✓ DFA traversal completed successfully</li>
              <li>✓ All {16} signature checks passed</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
