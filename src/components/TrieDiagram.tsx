import { useEffect, useRef } from 'react';

export function TrieDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Define simplified trie nodes for "OR" and "DROP"
    const nodes = [
      { id: 'root', x: 400, y: 50, label: 'ROOT', color: '#06b6d4' },
      { id: 'O', x: 300, y: 150, label: 'O', color: '#8b5cf6' },
      { id: 'D', x: 500, y: 150, label: 'D', color: '#8b5cf6' },
      { id: 'R', x: 300, y: 250, label: 'R', color: '#8b5cf6' },
      { id: 'R2', x: 500, y: 250, label: 'R', color: '#8b5cf6' },
      { id: 'space', x: 300, y: 350, label: '␣', color: '#8b5cf6' },
      { id: 'O2', x: 500, y: 350, label: 'O', color: '#8b5cf6' },
      { id: '1', x: 300, y: 450, label: '1', color: '#ef4444' },
      { id: 'P', x: 500, y: 450, label: 'P', color: '#ef4444' },
    ];

    const edges = [
      { from: 'root', to: 'O', type: 'normal' },
      { from: 'root', to: 'D', type: 'normal' },
      { from: 'O', to: 'R', type: 'normal' },
      { from: 'D', to: 'R2', type: 'normal' },
      { from: 'R', to: 'space', type: 'normal' },
      { from: 'R2', to: 'O2', type: 'normal' },
      { from: 'space', to: '1', type: 'normal' },
      { from: 'O2', to: 'P', type: 'normal' },
    ];

    const failureLinks = [
      { from: 'O', to: 'root' },
      { from: 'D', to: 'root' },
      { from: 'R', to: 'root' },
      { from: 'R2', to: 'R' },
      { from: 'O2', to: 'O' },
    ];

    // Draw normal edges
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    edges.forEach(edge => {
      const from = nodes.find(n => n.id === edge.from)!;
      const to = nodes.find(n => n.id === edge.to)!;
      
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      // Arrow
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(to.x, to.y);
      ctx.lineTo(to.x - 8 * Math.cos(angle - Math.PI / 6), to.y - 8 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(to.x - 8 * Math.cos(angle + Math.PI / 6), to.y - 8 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    });

    // Draw failure links (dashed)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    failureLinks.forEach(link => {
      const from = nodes.find(n => n.id === link.from)!;
      const to = nodes.find(n => n.id === link.to)!;
      
      // Curved line
      const midX = (from.x + to.x) / 2 - 40;
      const midY = (from.y + to.y) / 2;
      
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(midX, midY, to.x, to.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Draw nodes
    nodes.forEach(node => {
      const isAccept = node.id === '1' || node.id === 'P';
      
      // Outer circle for accept states
      if (isAccept) {
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 28, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Node circle
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });

    // Draw legend
    const legendY = 520;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    
    // Normal edge
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, legendY);
    ctx.lineTo(100, legendY);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Trie Edge (character transition)', 110, legendY + 4);

    // Failure link
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(400, legendY);
    ctx.lineTo(450, legendY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Failure Link (suffix)', 460, legendY + 4);

    // Labels for paths
    ctx.fillStyle = '#8b5cf6';
    ctx.font = '11px sans-serif';
    ctx.fillText('Path: O→R→␣→1', 250, 100);
    ctx.fillText('= "OR 1"', 250, 115);
    
    ctx.fillText('Path: D→R→O→P', 520, 100);
    ctx.fillText('= "DROP"', 520, 115);

  }, []);

  return (
    <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-700 p-4">
      <h4 className="text-slate-300 mb-3 text-sm">Trie Structure with Failure Links:</h4>
      <canvas
        ref={canvasRef}
        width={800}
        height={550}
        className="w-full h-auto"
      />
      <p className="text-slate-400 text-xs mt-3">
        <strong className="text-purple-400">Trie edges (solid gray)</strong> follow character paths. 
        <strong className="text-red-400"> Failure links (red dashed)</strong> enable efficient backtracking without re-scanning input.
        When a character doesn't match, the automaton follows the failure link to the longest suffix that does match.
      </p>
    </div>
  );
}
