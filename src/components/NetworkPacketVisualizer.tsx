import { useEffect, useRef, useState } from 'react';

interface Packet {
  id: number;
  x: number;
  y: number;
  progress: number;
  malicious: boolean;
}

interface NetworkPacketVisualizerProps {
  isAnalyzing: boolean;
  isMalicious: boolean | null;
}

export function NetworkPacketVisualizer({ isAnalyzing, isMalicious }: NetworkPacketVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const packetIdRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw network nodes
      const nodes = [
        { x: 50, y: canvas.height / 2, label: 'CLIENT', color: '#06b6d4' },
        { x: canvas.width / 2, y: canvas.height / 2, label: 'DFA', color: '#8b5cf6' },
        { x: canvas.width - 50, y: canvas.height / 2, label: 'SERVER', color: '#10b981' },
      ];

      nodes.forEach(node => {
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = node.color;

        // Node circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 40);
      });

      // Draw connection lines
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[1].x, nodes[1].y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(nodes[1].x, nodes[1].y);
      ctx.lineTo(nodes[2].x, nodes[2].y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Update and draw packets
      setPackets(prev => {
        const updated = prev
          .map(packet => ({
            ...packet,
            progress: packet.progress + 0.01,
          }))
          .filter(packet => packet.progress <= 1);

        // Draw packets
        updated.forEach(packet => {
          const startX = nodes[0].x;
          const endX = nodes[2].x;
          const x = startX + (endX - startX) * packet.progress;

          // Packet glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = packet.malicious ? '#ef4444' : '#10b981';

          // Packet
          ctx.fillStyle = packet.malicious ? '#ef4444' : '#10b981';
          ctx.beginPath();
          ctx.arc(x, packet.y, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;

          // Scanning effect at DFA node
          if (packet.progress > 0.4 && packet.progress < 0.6) {
            ctx.strokeStyle = packet.malicious ? '#ef4444' : '#10b981';
            ctx.lineWidth = 2;
            const scanRadius = 30 + (packet.progress - 0.4) * 100;
            ctx.globalAlpha = 1 - (packet.progress - 0.4) * 5;
            ctx.beginPath();
            ctx.arc(nodes[1].x, nodes[1].y, scanRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });

        return updated;
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setPackets(prev => [
          ...prev,
          {
            id: packetIdRef.current++,
            x: 50,
            y: (Math.random() * 60 + 140),
            progress: 0,
            malicious: isMalicious ?? false,
          },
        ]);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isAnalyzing, isMalicious]);

  return (
    <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full h-auto"
      />
    </div>
  );
}
