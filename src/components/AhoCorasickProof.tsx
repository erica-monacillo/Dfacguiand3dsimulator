import { CheckCircle, Code, GitBranch, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { AlgorithmComparison } from './AlgorithmComparison';
import { TrieDiagram } from './TrieDiagram';

export function AhoCorasickProof() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-blue-900/50 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <CheckCircle className="size-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-blue-300">Yes! This Uses Aho-Corasick Algorithm</h3>
              <p className="text-blue-400/70 text-sm">True multi-pattern string matching automaton</p>
            </div>
          </div>

          {/* Key Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-900/30">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="size-4 text-cyan-400" />
                <h4 className="text-cyan-300 text-sm">1. Trie Structure</h4>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                All 16 SQL patterns are stored in a trie (prefix tree). Each node has children 
                representing characters, allowing shared prefixes between patterns.
              </p>
              <code className="block mt-2 text-xs text-cyan-400 bg-slate-950 p-2 rounded">
                root → O → R → [space] → 1 → = → 1 ✓
              </code>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-900/30">
              <div className="flex items-center gap-2 mb-2">
                <Code className="size-4 text-purple-400" />
                <h4 className="text-purple-300 text-sm">2. Failure Links</h4>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Each node has a failure link pointing to the longest proper suffix. Built using BFS. 
                This is THE key feature that makes it Aho-Corasick!
              </p>
              <code className="block mt-2 text-xs text-purple-400 bg-slate-950 p-2 rounded">
                failureLink = longestSuffix()
              </code>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-green-900/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="size-4 text-green-400" />
                <h4 className="text-green-300 text-sm">3. O(n) Matching</h4>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Single pass through input. When no match, follow failure links instead of 
                backtracking. Processes each character exactly once.
              </p>
              <code className="block mt-2 text-xs text-green-400 bg-slate-950 p-2 rounded">
                while (!match) node = node.failureLink
              </code>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-amber-900/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="size-4 text-amber-400" />
                <h4 className="text-amber-300 text-sm">4. Output Function</h4>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Nodes store all patterns that end there. Output functions are merged from 
                failure links, enabling detection of overlapping patterns.
              </p>
              <code className="block mt-2 text-xs text-amber-400 bg-slate-950 p-2 rounded">
                output = [...node.output, ...failureLink.output]
              </code>
            </div>
          </div>

          {/* Add Trie Diagram */}
          <TrieDiagram />

          {/* Code Proof */}
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
            <h4 className="text-slate-300 mb-3 flex items-center gap-2">
              <Code className="size-4" />
              Actual Implementation (TypeScript):
            </h4>
            <pre className="text-xs text-slate-300 overflow-x-auto">
{`// Build failure links using BFS (Aho-Corasick core)
build(): void {
  const queue: TrieNode[] = [];
  
  // Initialize depth-1 nodes
  for (const [, child] of this.root.children) {
    child.failureLink = this.root;
    queue.push(child);
  }
  
  // BFS to construct failure links
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    for (const [char, child] of current.children) {
      queue.push(child);
      
      // Find failure link
      let failureNode = current.failureLink;
      while (failureNode !== this.root && 
             !failureNode!.children.has(char)) {
        failureNode = failureNode!.failureLink;
      }
      
      if (failureNode!.children.has(char)) {
        child.failureLink = failureNode!.children.get(char)!;
      } else {
        child.failureLink = this.root;
      }
      
      // Merge output functions
      child.output.push(...child.failureLink.output);
    }
  }
}`}
            </pre>
          </div>

          {/* Real-World Usage */}
          <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-900/50">
            <h4 className="text-blue-300 mb-2">Same Algorithm Used By:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-950 rounded p-2 text-center text-slate-300">
                Snort IDS
              </div>
              <div className="bg-slate-950 rounded p-2 text-center text-slate-300">
                Suricata
              </div>
              <div className="bg-slate-950 rounded p-2 text-center text-slate-300">
                ClamAV
              </div>
              <div className="bg-slate-950 rounded p-2 text-center text-slate-300">
                Grep -F
              </div>
            </div>
            <p className="text-blue-400/70 text-xs mt-3">
              Industry-standard algorithm for network intrusion detection and virus scanning.
            </p>
          </div>
        </div>
      </Card>

      {/* Add comparison */}
      <AlgorithmComparison />
    </div>
  );
}