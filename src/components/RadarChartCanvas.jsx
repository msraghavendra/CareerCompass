import React, { useEffect, useRef } from 'react';

export default function RadarChartCanvas({
  labels = [],
  datasets = [],
  width = 420,
  height = 360
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 55;
    const numAxes = labels.length;
    if (numAxes < 3) return;

    const angleStep = (Math.PI * 2) / numAxes;

    // 1. Draw Concentric Polygon Grids
    const levels = 5;
    ctx.lineWidth = 1;
    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Percentage Labels on Top Axis
      ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
      ctx.font = "10px sans-serif";
      ctx.fillText(`${level * 20}%`, centerX + 4, centerY - r + 3);
    }

    // 2. Draw Spokes / Axes lines
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Axis Labels
      const labelX = centerX + (radius + 28) * Math.cos(angle);
      const labelY = centerY + (radius + 18) * Math.sin(angle);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Split label if too long
      const text = labels[i];
      if (text.length > 16) {
        const parts = text.split(" ");
        const mid = Math.ceil(parts.length / 2);
        const line1 = parts.slice(0, mid).join(" ");
        const line2 = parts.slice(mid).join(" ");
        ctx.fillText(line1, labelX, labelY - 6);
        ctx.fillText(line2, labelX, labelY + 7);
      } else {
        ctx.fillText(text, labelX, labelY);
      }
    }

    // 3. Draw Datasets
    datasets.forEach((ds) => {
      const data = ds.data || [];
      ctx.beginPath();
      ctx.fillStyle = ds.backgroundColor || "rgba(99, 102, 241, 0.25)";
      ctx.strokeStyle = ds.borderColor || "#6366f1";
      ctx.lineWidth = ds.borderWidth || 2;

      for (let i = 0; i < numAxes; i++) {
        const value = Math.min(100, Math.max(0, data[i] || 0));
        const r = (radius * value) / 100;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw Data Point Dots
      for (let i = 0; i < numAxes; i++) {
        const value = Math.min(100, Math.max(0, data[i] || 0));
        const r = (radius * value) / 100;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        ctx.beginPath();
        ctx.fillStyle = ds.borderColor || "#6366f1";
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

  }, [labels, datasets, width, height]);

  return (
    <div className="radar-canvas-container" style={{ width: `${width}px`, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px`, display: 'block' }}
      />
    </div>
  );
}
