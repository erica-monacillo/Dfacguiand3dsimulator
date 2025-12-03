import { ArrowRight, X, Check } from 'lucide-react';

export function AlgorithmComparison() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Naive Approach */}
      <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <X className="size-5 text-red-400" />
          <h3 className="text-red-300">Naive Pattern Matching</h3>
          <span className="ml-auto text-xs text-red-400 bg-red-950/50 px-2 py-1 rounded">
            NOT USED
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="bg-slate-950 rounded p-3">
            <div className="text-slate-400 text-xs mb-2">Example: Search "OR 1=1" and "DROP TABLE"</div>
            <div className="font-mono text-xs space-y-1">
              <div className="text-slate-500">Input: "SELECT * FROM users WHERE id=1 OR 1=1"</div>
              <div className="text-red-400 mt-2">Step 1: Check "OR 1=1"</div>
              <div className="text-slate-400 ml-4">S E L E C T ... (no match, continue)</div>
              <div className="text-slate-400 ml-4">E L E C T ... (no match, continue)</div>
              <div className="text-slate-400 ml-4">L E C T ... (no match, continue)</div>
              <div className="text-green-400 ml-4">...eventually finds at position 35 ✓</div>
              
              <div className="text-red-400 mt-2">Step 2: Check "DROP TABLE"</div>
              <div className="text-slate-400 ml-4">S E L E C T ... (no match, continue)</div>
              <div className="text-slate-400 ml-4">E L E C T ... (no match, continue)</div>
              <div className="text-slate-500 ml-4">...check entire string again ✗</div>
            </div>
          </div>

          <div className="bg-red-950/30 rounded p-3">
            <div className="text-red-300 text-xs mb-2">Problems:</div>
            <ul className="text-slate-400 text-xs space-y-1 ml-4">
              <li>• Each pattern checked separately</li>
              <li>• Must scan input multiple times</li>
              <li>• Lots of redundant comparisons</li>
              <li>• <strong className="text-red-400">O(n × m × k) time</strong></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Aho-Corasick */}
      <div className="bg-green-950/20 border border-green-900/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Check className="size-5 text-green-400" />
          <h3 className="text-green-300">Aho-Corasick Algorithm</h3>
          <span className="ml-auto text-xs text-green-400 bg-green-950/50 px-2 py-1 rounded">
            USED HERE
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="bg-slate-950 rounded p-3">
            <div className="text-slate-400 text-xs mb-2">Example: Search "OR 1=1" and "DROP TABLE" simultaneously</div>
            <div className="font-mono text-xs space-y-1">
              <div className="text-slate-500">Input: "SELECT * FROM users WHERE id=1 OR 1=1"</div>
              <div className="text-green-400 mt-2">Single Pass Through Input:</div>
              <div className="text-slate-400 ml-4">S → check trie → no match</div>
              <div className="text-slate-400 ml-4">E → check trie → no match</div>
              <div className="text-slate-400 ml-4">L → check trie → no match</div>
              <div className="text-cyan-400 ml-4">...O → trie path starts</div>
              <div className="text-cyan-400 ml-4">...R → continue in trie</div>
              <div className="text-cyan-400 ml-4">...[space] → continue</div>
              <div className="text-cyan-400 ml-4">...1 → continue</div>
              <div className="text-green-400 ml-4">...= → "OR 1=1" DETECTED! ✓</div>
              <div className="text-slate-500 ml-4">(Also checked "DROP TABLE" in same pass!)</div>
            </div>
          </div>

          <div className="bg-green-950/30 rounded p-3">
            <div className="text-green-300 text-xs mb-2">Advantages:</div>
            <ul className="text-slate-400 text-xs space-y-1 ml-4">
              <li>• All patterns checked at once</li>
              <li>• Single scan of input</li>
              <li>• Failure links avoid backtracking</li>
              <li>• <strong className="text-green-400">O(n + m + z) time</strong></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Visual Flow */}
      <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <h4 className="text-slate-300 mb-4">Visual Flow Comparison:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-red-300 text-sm mb-2">Naive (Multiple Passes):</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="bg-red-950/30 px-2 py-1 rounded">Pass 1</div>
                <ArrowRight className="size-3 text-red-400" />
                <div className="text-slate-400">Check Pattern 1</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-red-950/30 px-2 py-1 rounded">Pass 2</div>
                <ArrowRight className="size-3 text-red-400" />
                <div className="text-slate-400">Check Pattern 2</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-red-950/30 px-2 py-1 rounded">Pass 3</div>
                <ArrowRight className="size-3 text-red-400" />
                <div className="text-slate-400">Check Pattern 3</div>
              </div>
              <div className="text-red-400 text-center mt-2">...continues for 16 patterns</div>
            </div>
          </div>
          
          <div>
            <div className="text-green-300 text-sm mb-2">Aho-Corasick (Single Pass):</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="bg-green-950/30 px-2 py-1 rounded">Pass 1</div>
                <ArrowRight className="size-3 text-green-400" />
                <div className="text-slate-400">Check ALL 16 Patterns</div>
              </div>
              <div className="text-green-400 text-center mt-8">✓ Done! All patterns checked simultaneously</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
