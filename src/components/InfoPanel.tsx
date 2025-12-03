import { Info, BookOpen, Code, Cpu } from 'lucide-react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AhoCorasickProof } from './AhoCorasickProof';

export function InfoPanel() {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="size-5 text-blue-400" />
          <h2 className="text-blue-400">Project Information</h2>
        </div>

        <Tabs defaultValue="proof" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-900">
            <TabsTrigger value="proof">Aho-Corasick</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dfa">DFA</TabsTrigger>
            <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="proof" className="space-y-4">
            <AhoCorasickProof />
          </TabsContent>

          <TabsContent value="overview" className="space-y-3 text-slate-300 text-sm">
            <div className="flex items-start gap-3">
              <BookOpen className="size-5 text-cyan-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-cyan-400 mb-1">Project Overview</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  This project demonstrates how Regular Languages, Regular Expressions, Regular Grammars, 
                  and Deterministic Finite Automata (DFA) can be applied to cybersecurity, specifically 
                  to detect SQL Injection attempts inside network payloads.
                </p>
              </div>
            </div>
            <div className="bg-slate-950 rounded p-3 space-y-2">
              <h4 className="text-amber-400 text-xs">Key Features:</h4>
              <ul className="text-slate-400 text-xs space-y-1 ml-4">
                <li>• Real-time SQL injection pattern detection</li>
                <li>• 3D visualization of DFA state machine</li>
                <li>• Aho-Corasick automaton implementation</li>
                <li>• 16 distinct malicious signature patterns</li>
                <li>• O(n) time complexity for linear scanning</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="dfa" className="space-y-3 text-slate-300 text-sm">
            <div className="flex items-start gap-3">
              <Cpu className="size-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-purple-400 mb-1">DFA Structure</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  The automaton uses a trie-based structure with failure links, allowing efficient 
                  multi-pattern matching in a single pass through the input.
                </p>
              </div>
            </div>
            <div className="bg-slate-950 rounded p-3 space-y-2">
              <h4 className="text-purple-400 text-xs">State Definitions:</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan-400" />
                  <code className="text-cyan-400">q0 (START)</code>
                  <span className="text-slate-500">- Initial state</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-violet-400" />
                  <code className="text-violet-400">q1-q5</code>
                  <span className="text-slate-500">- Pattern matching states</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-red-400" />
                  <code className="text-red-400">q6 (ACCEPT)</code>
                  <span className="text-slate-500">- Malicious pattern detected</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="algorithm" className="space-y-3 text-slate-300 text-sm">
            <div className="flex items-start gap-3">
              <Code className="size-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-green-400 mb-1">Aho-Corasick Algorithm</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  The Aho-Corasick algorithm builds a finite state machine that matches multiple patterns 
                  simultaneously, making it ideal for intrusion detection systems.
                </p>
              </div>
            </div>
            <div className="bg-slate-950 rounded p-3 space-y-2">
              <h4 className="text-green-400 text-xs">Algorithm Steps:</h4>
              <ol className="text-slate-400 text-xs space-y-1 ml-4 list-decimal">
                <li>Build trie from all SQL injection patterns</li>
                <li>Construct failure links using BFS traversal</li>
                <li>Merge output functions from failure states</li>
                <li>Process input character by character</li>
                <li>Follow transitions or failure links as needed</li>
                <li>Report matches when output states are reached</li>
              </ol>
            </div>
            <div className="bg-slate-950 rounded p-3">
              <h4 className="text-amber-400 text-xs mb-2">Complexity Analysis:</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Complexity:</span>
                  <code className="text-green-400">O(n + m + z)</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Space Complexity:</span>
                  <code className="text-blue-400">O(m × k)</code>
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  n = input length, m = total pattern length, z = matches, k = alphabet size
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-3 text-slate-300 text-sm">
            <div className="bg-slate-950 rounded p-3 space-y-2">
              <h4 className="text-blue-400 text-xs">How to Use:</h4>
              <ol className="text-slate-400 text-xs space-y-2 ml-4 list-decimal">
                <li>Enter a network payload in the analyzer input field</li>
                <li>Or click on any example payload to auto-fill</li>
                <li>Click "Analyze Payload" to run detection</li>
                <li>Watch the 3D DFA visualizer show state transitions</li>
                <li>Review detection results in the right panel</li>
              </ol>
            </div>
            <div className="bg-slate-950 rounded p-3 space-y-2">
              <h4 className="text-amber-400 text-xs">Example Test Cases:</h4>
              <div className="space-y-1 text-xs">
                <div className="p-2 bg-red-950/20 border border-red-900/50 rounded">
                  <div className="text-red-400 mb-1">Malicious:</div>
                  <code className="text-slate-300">GET /login.php?id=1 OR 1=1 --</code>
                </div>
                <div className="p-2 bg-green-950/20 border border-green-900/50 rounded">
                  <div className="text-green-400 mb-1">Clean:</div>
                  <code className="text-slate-300">POST /submit.php?name=John</code>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}