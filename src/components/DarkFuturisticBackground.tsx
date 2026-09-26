import React, { useEffect, useRef } from 'react';

export const DarkFuturisticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle background particles - deeper, darker tones
    const particleCount = 24;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 1.75 + 0.75,
      color: Math.random() > 0.6 ? '#5A320C' : Math.random() > 0.3 ? '#422408' : '#2D1805',
      baseOpacity: Math.random() * 0.03 + 0.02, // 2% - 5% opacity for dark subtlety
      pulseSpeed: Math.random() * 0.015 + 0.008,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // AI data-flow nodes
    const nodeCount = 8;
    const nodes = Array.from({ length: nodeCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.8 + height * 0.1,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      radius: 2.5,
    }));

    let t = 0;
    let spikeTimer = 0;
    let spikeIntensity = 0; // occasional spike flare

    const render = () => {
      t += 0.016;
      spikeTimer += 0.014;

      // Occasional faint background heartbeat surge
      if (spikeTimer > 7.0) {
        spikeTimer = 0;
        spikeIntensity = 0.6;
      }
      if (spikeIntensity > 0) {
        spikeIntensity = Math.max(0, spikeIntensity - 0.015);
      }

      ctx.clearRect(0, 0, width, height);

      // Deep base layer fill #070B0F (darker pitch tone)
      ctx.fillStyle = '#070B0F';
      ctx.fillRect(0, 0, width, height);

      // 1. Subtle, darker tech grid dots
      const gridGap = 52;
      ctx.fillStyle = 'rgba(26, 38, 49, 0.10)';
      for (let x = 0; x < width; x += gridGap) {
        for (let y = 0; y < height; y += gridGap) {
          ctx.beginPath();
          ctx.arc(x, y, 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Large continuous dark ECG waveform behind the dashboard
      // Color: darker amber-brown #552D0C at 5% - 8% opacity
      const ecgY = height * 0.58;
      const ecgAmplitude = 42 + spikeIntensity * 24;
      const waveSpeed = t * 95;

      ctx.beginPath();
      const ecgAlpha = 0.055 + spikeIntensity * 0.035;
      ctx.strokeStyle = `rgba(85, 45, 12, ${ecgAlpha})`;
      ctx.lineWidth = 1.75;
      if (spikeIntensity > 0.3) {
        ctx.shadowColor = '#713F12';
        ctx.shadowBlur = 4 * spikeIntensity;
      } else {
        ctx.shadowBlur = 0;
      }

      // Wave calculation across canvas width
      for (let x = 0; x <= width; x += 3) {
        const wx = (x + waveSpeed) % 360;
        let yOffset = 0;

        // P wave
        if (wx > 80 && wx < 115) {
          const p = (wx - 80) / 35;
          yOffset = -Math.sin(p * Math.PI) * (ecgAmplitude * 0.18);
        }
        // Q dip
        else if (wx >= 120 && wx < 130) {
          const q = (wx - 120) / 10;
          yOffset = Math.sin(q * Math.PI) * (ecgAmplitude * 0.14);
        }
        // R sharp spike
        else if (wx >= 130 && wx < 145) {
          const r = (wx - 130) / 15;
          const peak = r < 0.5 ? r * 2 : (1 - r) * 2;
          yOffset = -peak * ecgAmplitude;
        }
        // S sharp dip
        else if (wx >= 145 && wx < 158) {
          const s = (wx - 145) / 13;
          yOffset = Math.sin(s * Math.PI) * (ecgAmplitude * 0.28);
        }
        // T recovery wave
        else if (wx >= 175 && wx < 225) {
          const tw = (wx - 175) / 50;
          yOffset = -Math.sin(tw * Math.PI) * (ecgAmplitude * 0.25);
        }

        const py = ecgY + yOffset;
        if (x === 0) {
          ctx.moveTo(x, py);
        } else {
          ctx.lineTo(x, py);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Darker AI Data-Flow Nodes & Connection Lines
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Connect to nearby nodes with subtle low-alpha lines
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 170) {
            const lineAlpha = (1 - dist / 170) * 0.05;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(85, 45, 12, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            // Traveling subtle micro-pulse
            const pulseT = (t * 0.4 + i * 0.25) % 1;
            const px = node.x + (other.x - node.x) * pulseT;
            const py = node.y + (other.y - node.y) * pulseT;
            ctx.beginPath();
            ctx.fillStyle = `rgba(113, 63, 18, ${lineAlpha * 1.5})`;
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.fillStyle = 'rgba(75, 40, 10, 0.08)';
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Subtle, Darker Data Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentOpacity = p.baseOpacity + Math.sin(t * p.pulseSpeed + p.pulsePhase) * 0.015;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.015, Math.min(0.06, currentOpacity));
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 5. Deep radial vignette to naturally darken outer borders & corners
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.3,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      vignette.addColorStop(0, 'rgba(7, 11, 15, 0)');
      vignette.addColorStop(1, 'rgba(4, 7, 10, 0.65)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
      style={{ background: '#070B0F' }}
      aria-hidden="true"
    />
  );
};
