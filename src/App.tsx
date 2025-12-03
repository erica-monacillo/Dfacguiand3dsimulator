import { useState } from 'react';
import { NetworkAnalyzer } from './components/NetworkAnalyzer';
import { DFAVisualizer3D } from './components/DFAVisualizer3D';
import { PatternLibrary } from './components/PatternLibrary';
import { DetectionResults } from './components/DetectionResults';
import { InfoPanel } from './components/InfoPanel';
import { StatsDashboard } from './components/StatsDashboard';
import { Shield, Network, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

export default function App() {
  const [currentPayload, setCurrentPayload] = useState('');
  const [detectionResults, setDetectionResults] = useState<any[]>([]);
  const [activeStates, setActiveStates] = useState<number[]>([0]);
  const [processedChars, setProcessedChars] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="size-8 text-cyan-400" />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Shield className="size-8 text-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="text-cyan-400">DFA-Based SQL Injection Detector</h1>
                <p className="text-slate-400 text-sm">Network Security & Protocol Analysis Simulator</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-400 animate-pulse" />
                <span>System Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="simulator" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="simulator">Simulator</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="simulator">
            {/* Stats Dashboard */}
            <StatsDashboard 
              processedChars={processedChars}
              detectionResults={detectionResults}
              activeStates={activeStates}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
              {/* Left Column - 3D Visualizer and Input */}
              <div className="xl:col-span-2 space-y-6">
                {/* 3D DFA Visualizer */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Network className="size-5 text-purple-400" />
                    <h2 className="text-purple-400">3D Automaton Visualizer</h2>
                  </div>
                  <DFAVisualizer3D 
                    activeStates={activeStates}
                    processedChars={processedChars}
                  />
                </div>

                {/* Network Analyzer */}
                <NetworkAnalyzer
                  currentPayload={currentPayload}
                  setCurrentPayload={setCurrentPayload}
                  setDetectionResults={setDetectionResults}
                  setActiveStates={setActiveStates}
                  setProcessedChars={setProcessedChars}
                />
              </div>

              {/* Right Column - Pattern Library and Results */}
              <div className="space-y-6">
                {/* Pattern Library */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Database className="size-5 text-amber-400" />
                    <h2 className="text-amber-400">SQL Injection Signatures</h2>
                  </div>
                  <PatternLibrary />
                </div>

                {/* Detection Results */}
                <DetectionResults results={detectionResults} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documentation">
            <InfoPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-6 py-4">
          <p className="text-slate-500 text-sm text-center">
            Automata Theory Project - Regular Languages & DFA Pattern Matching | 
            Topic 2: Network Security and Protocol Analysis
          </p>
        </div>
      </footer>
    </div>
  );
}