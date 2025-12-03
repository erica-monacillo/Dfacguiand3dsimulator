import { useState, useEffect } from 'react';
import { Terminal, Send, Trash2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { createSQLInjectionDetector, normalizePayload } from '../lib/aho-corasick';
import { StateTransitionViewer } from './StateTransitionViewer';

interface NetworkAnalyzerProps {
  currentPayload: string;
  setCurrentPayload: (payload: string) => void;
  setDetectionResults: (results: any[]) => void;
  setActiveStates: (states: number[]) => void;
  setProcessedChars: (chars: number) => void;
}

const examplePayloads = [
  "GET /login.php?id=1 OR 1=1 --",
  "POST /submit.php?name=John",
  "SELECT * FROM users WHERE id='1' OR '1'='1'",
  "GET /api/data?query='; DROP TABLE users; --",
  "UNION SELECT username, password FROM accounts",
  "GET /search?q=admin' --",
  "; EXEC xp_cmdshell('dir');",
  "LOAD_FILE('/etc/passwd')",
  "SELECT * FROM INFORMATION_SCHEMA.TABLES",
  "GET /profile?user=normaluser",
];

export function NetworkAnalyzer({
  currentPayload,
  setCurrentPayload,
  setDetectionResults,
  setActiveStates,
  setProcessedChars,
}: NetworkAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<Array<{ payload: string; malicious: boolean }>>([]);
  const [stateSequence, setStateSequence] = useState<number[]>([]);

  const detector = createSQLInjectionDetector();

  const analyzePayload = async () => {
    if (!currentPayload.trim()) return;

    setIsAnalyzing(true);

    // Simulate network packet processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const normalized = normalizePayload(currentPayload);
    const { matches, stateSequence: sequence } = detector.search(normalized);

    setProcessedChars(normalized.length);
    setActiveStates(sequence.slice(-1)); // Last state
    setStateSequence(sequence);

    if (matches.length > 0) {
      // Malicious
      setDetectionResults(matches);
      setHistory(prev => [{ payload: currentPayload, malicious: true }, ...prev.slice(0, 9)]);
    } else {
      // Clean
      setDetectionResults([]);
      setHistory(prev => [{ payload: currentPayload, malicious: false }, ...prev.slice(0, 9)]);
    }

    setIsAnalyzing(false);
  };

  const loadExample = (example: string) => {
    setCurrentPayload(example);
  };

  const clearPayload = () => {
    setCurrentPayload('');
    setDetectionResults([]);
    setActiveStates([0]);
    setProcessedChars(0);
    setStateSequence([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="size-5 text-green-400" />
          <h2 className="text-green-400">Network Packet Analyzer</h2>
        </div>

        <div className="space-y-4">
          {/* Payload Input */}
          <div>
            <label className="block text-slate-300 mb-2">
              Enter Network Payload:
            </label>
            <Textarea
              value={currentPayload}
              onChange={(e) => setCurrentPayload(e.target.value)}
              placeholder="Example: GET /login.php?id=1 OR 1=1 --"
              className="font-mono text-sm bg-slate-950 border-slate-600 text-slate-200 min-h-[120px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={analyzePayload}
              disabled={isAnalyzing || !currentPayload.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Analyze Payload
                </>
              )}
            </Button>
            <Button
              onClick={clearPayload}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              <Trash2 className="size-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Example Payloads */}
          <div>
            <label className="block text-slate-300 mb-2 text-sm">
              Example Payloads (Click to Load):
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {examplePayloads.map((example, index) => (
                <button
                  key={index}
                  onClick={() => loadExample(example)}
                  className="w-full text-left px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-700 rounded text-sm font-mono text-slate-300 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis History */}
          {history.length > 0 && (
            <div>
              <label className="block text-slate-300 mb-2 text-sm">
                Recent Analysis History:
              </label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-2 ${
                      item.malicious
                        ? 'bg-red-950/30 text-red-300 border border-red-900/50'
                        : 'bg-green-950/30 text-green-300 border border-green-900/50'
                    }`}
                  >
                    <span className={`size-2 rounded-full ${item.malicious ? 'bg-red-500' : 'bg-green-500'}`} />
                    {item.payload.substring(0, 60)}
                    {item.payload.length > 60 && '...'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* State Transition Viewer */}
      {currentPayload && stateSequence.length > 0 && (
        <StateTransitionViewer 
          payload={currentPayload}
          stateSequence={stateSequence}
        />
      )}
    </div>
  );
}