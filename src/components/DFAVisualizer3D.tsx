import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Info, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

interface DFAVisualizer3DProps {
  activeStates: number[];
  processedChars: number;
}

export function DFAVisualizer3D({ activeStates, processedChars }: DFAVisualizer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isRotating, setIsRotating] = useState(true);
  const rotationRef = useRef(0);
  const [showHelp, setShowHelp] = useState(true);

  // Define DFA states (simplified representation)
  const states = [
    { id: 0, label: 'START', sublabel: 'q0', x: 0, y: 0, z: 0, color: '#06b6d4', desc: 'Initial State' },
    { id: 1, label: 'OR', sublabel: 'q1', x: 200, y: 50, z: 100, color: '#8b5cf6', desc: 'OR Pattern' },
    { id: 2, label: 'DROP', sublabel: 'q2', x: -200, y: 50, z: 100, color: '#8b5cf6', desc: 'DROP Pattern' },
    { id: 3, label: 'UNION', sublabel: 'q3', x: 0, y: 100, z: -100, color: '#8b5cf6', desc: 'UNION Pattern' },
    { id: 4, label: 'COMMENT', sublabel: 'q4', x: 200, y: -50, z: -100, color: '#8b5cf6', desc: 'Comment Pattern' },
    { id: 5, label: 'EXEC', sublabel: 'q5', x: -200, y: -50, z: -100, color: '#8b5cf6', desc: 'EXEC Pattern' },
    { id: 6, label: 'THREAT!', sublabel: 'q6', x: 0, y: 150, z: 0, color: '#ef4444', desc: 'Attack Detected!' },
  ];

  // Define transitions with clearer labels
  const transitions = [
    { from: 0, to: 1, label: 'OR' },
    { from: 0, to: 2, label: 'DROP' },
    { from: 0, to: 3, label: 'UNION' },
    { from: 0, to: 4, label: '--/#' },
    { from: 0, to: 5, label: 'EXEC' },
    { from: 1, to: 6, label: '1=1' },
    { from: 2, to: 6, label: 'TABLE' },
    { from: 3, to: 6, label: 'SELECT' },
    { from: 4, to: 6, label: 'comment' },
    { from: 5, to: 6, label: 'cmd' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const draw = () => {
      // Clear canvas with grid background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Update rotation
      if (isRotating) {
        rotationRef.current += 0.005;
      }

      const rotation = rotationRef.current;

      // Project 3D to 2D with rotation
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const cosY = Math.cos(rotation);
        const sinY = Math.sin(rotation);
        const xRot = x * cosY - z * sinY;
        const zRot = x * sinY + z * cosY;

        // Simple perspective projection
        const scale = 300 / (300 + zRot);
        return {
          x: centerX + xRot * scale,
          y: centerY + y * scale,
          scale: scale,
          z: zRot,
        };
      };

      // Sort states by z-order (back to front)
      const projectedStates = states.map(state => ({
        ...state,
        projected: project(state.x, state.y, state.z),
      })).sort((a, b) => a.projected.z - b.projected.z);

      // Draw transitions (edges) first
      ctx.lineWidth = 2;
      transitions.forEach(trans => {
        const from = projectedStates.find(s => s.id === trans.from);
        const to = projectedStates.find(s => s.id === trans.to);
        if (from && to) {
          const fromProj = from.projected;
          const toProj = to.projected;

          // Determine if this transition is active
          const isActive = activeStates.includes(from.id) && activeStates.includes(to.id);
          
          ctx.strokeStyle = isActive ? '#8b5cf6' : '#334155';
          ctx.setLineDash(isActive ? [] : [5, 5]);

          // Draw line
          ctx.beginPath();
          ctx.moveTo(fromProj.x, fromProj.y);
          ctx.lineTo(toProj.x, toProj.y);
          ctx.stroke();

          // Draw arrowhead
          const angle = Math.atan2(toProj.y - fromProj.y, toProj.x - fromProj.x);
          const arrowSize = 10;
          ctx.fillStyle = isActive ? '#8b5cf6' : '#334155';
          ctx.beginPath();
          ctx.moveTo(toProj.x, toProj.y);
          ctx.lineTo(
            toProj.x - arrowSize * Math.cos(angle - Math.PI / 6),
            toProj.y - arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            toProj.x - arrowSize * Math.cos(angle + Math.PI / 6),
            toProj.y - arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();

          ctx.setLineDash([]);
        }
      });

      // Draw states (nodes)
      projectedStates.forEach(state => {
        const proj = state.projected;
        const radius = 35 * proj.scale;
        const isActive = activeStates.includes(state.id);

        // Glow effect for active states
        if (isActive) {
          ctx.shadowBlur = 25;
          ctx.shadowColor = state.color;
          
          // Pulsing ring for active state
          const pulseRadius = radius + 10 + Math.sin(Date.now() / 200) * 5;
          ctx.strokeStyle = state.color;
          ctx.lineWidth = 3;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw outer circle (accepting state indicator) for q6
        if (state.id === 6) {
          ctx.strokeStyle = state.color;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, radius + 8, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw node circle with gradient
        if (isActive) {
          const gradient = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, radius);
          gradient.addColorStop(0, state.color);
          gradient.addColorStop(1, state.id === 6 ? '#991b1b' : '#1e293b');
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = '#1e293b';
        }
        
        ctx.strokeStyle = isActive ? state.color : '#475569';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Draw main label
        ctx.fillStyle = isActive ? '#ffffff' : '#64748b';
        ctx.font = `bold ${Math.floor(14 * proj.scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(state.label, proj.x, proj.y - 5 * proj.scale);

        // Draw sublabel (state number)
        ctx.fillStyle = isActive ? '#cbd5e1' : '#475569';
        ctx.font = `${Math.floor(11 * proj.scale)}px monospace`;
        ctx.fillText(state.sublabel, proj.x, proj.y + 10 * proj.scale);
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeStates, isRotating]);

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  const resetRotation = () => {
    rotationRef.current = 0;
  };

  return (
    <div className="space-y-4">
      {/* Help Alert */}
      {showHelp && (
        <Alert className="bg-blue-950/30 border-blue-900/50">
          <HelpCircle className="size-4 text-blue-400" />
          <AlertDescription className="text-blue-200 text-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <strong>How to read this diagram:</strong>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>• <strong className="text-cyan-400">Blue circle (START)</strong> - The automaton begins here</li>
                  <li>• <strong className="text-purple-400">Purple circles</strong> - Pattern matching states (OR, DROP, UNION, etc.)</li>
                  <li>• <strong className="text-red-400">Red circle (THREAT!)</strong> - Accepting state = Attack detected!</li>
                  <li>• <strong>Glowing circles</strong> - Currently active states during analysis</li>
                  <li>• <strong>Arrows</strong> - Show how the automaton moves between states</li>
                </ul>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-blue-400 hover:text-blue-300 ml-4"
              >
                ✕
              </button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!showHelp && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowHelp(true)}
          className="border-blue-600 text-blue-400 hover:bg-blue-950/30"
        >
          <HelpCircle className="size-4 mr-2" />
          Show Help
        </Button>
      )}

      <div className="relative bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-auto"
        />
        
        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleRotation}
            className="bg-slate-800/80 hover:bg-slate-700"
          >
            {isRotating ? (
              <>
                <Pause className="size-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="size-4 mr-1" />
                Rotate
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={resetRotation}
            className="bg-slate-800/80 hover:bg-slate-700"
          >
            <RotateCcw className="size-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-3 text-xs">
          <h4 className="text-slate-300 mb-2">State Legend:</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-cyan-400 border-2 border-cyan-500"></div>
              <span className="text-slate-400">Start State (q0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-purple-400 border-2 border-purple-500"></div>
              <span className="text-slate-400">Pattern States (q1-q5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-red-400 border-4 border-red-500"></div>
              <span className="text-slate-400">Accept State (q6) - Threat!</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-purple-400 border-2 border-purple-500 shadow-lg shadow-purple-500"></div>
              <span className="text-slate-400">Active (glowing)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Information */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="bg-slate-900 rounded p-3 border border-slate-700">
          <div className="text-slate-500 text-xs mb-1">Current State</div>
          <div className="text-cyan-400">
            {activeStates.length > 0 ? `q${activeStates[0]}` : 'q0'}
          </div>
        </div>
        <div className="bg-slate-900 rounded p-3 border border-slate-700">
          <div className="text-slate-500 text-xs mb-1">Characters Processed</div>
          <div className="text-purple-400">{processedChars}</div>
        </div>
        <div className="bg-slate-900 rounded p-3 border border-slate-700">
          <div className="text-slate-500 text-xs mb-1">Status</div>
          <div className={activeStates.includes(6) ? 'text-red-400' : 'text-green-400'}>
            {activeStates.includes(6) ? 'THREAT DETECTED' : 'Scanning...'}
          </div>
        </div>
      </div>
    </div>
  );
}