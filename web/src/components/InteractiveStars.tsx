"use client";

import { useEffect, useRef } from "react";

type StarKind = "dot" | "spark" | "diamond" | "cross";

type Star = {
  x: number;
  y: number;
  r: number;
  kind: StarKind;
  base: number;
  twinkle: number;
  phase: number;
  hue: number;
};

function seedStars(w: number, h: number): Star[] {
  const area = w * h;
  const count = Math.min(220, Math.max(90, Math.floor(area / 14000)));
  const kinds: StarKind[] = ["dot", "spark", "diamond", "cross"];
  const stars: Star[] = [];

  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.8,
      kind: kinds[Math.floor(Math.random() * kinds.length)],
      base: 0.18 + Math.random() * 0.35,
      twinkle: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.82 ? 210 + Math.random() * 30 : 40 + Math.random() * 20,
    });
  }
  return stars;
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  star: Star,
  glow: number,
  time: number
) {
  const pulse = 0.75 + Math.sin(time * star.twinkle + star.phase) * 0.25;
  const alpha = Math.min(1, (star.base + glow * 0.9) * pulse);
  const size = star.r * (1 + glow * 1.8);
  const warm = star.hue < 100;
  const core = warm
    ? `rgba(255, 245, 210, ${alpha})`
    : `rgba(220, 235, 255, ${alpha})`;
  const bloom = warm
    ? `rgba(255, 210, 120, ${alpha * 0.45})`
    : `rgba(160, 200, 255, ${alpha * 0.4})`;

  if (glow > 0.05) {
    const g = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 6);
    g.addColorStop(0, bloom);
    g.addColorStop(0.45, warm ? `rgba(255, 190, 80, ${alpha * 0.12})` : `rgba(140, 180, 255, ${alpha * 0.1})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(star.x, star.y, size * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(star.x, star.y);
  ctx.fillStyle = core;
  ctx.strokeStyle = core;

  switch (star.kind) {
    case "dot": {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "spark": {
      ctx.rotate(star.phase * 0.2);
      ctx.beginPath();
      for (let i = 0; i < 4; i += 1) {
        const a = (i * Math.PI) / 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * size * 2.2, Math.sin(a) * size * 2.2);
      }
      ctx.lineWidth = Math.max(0.6, size * 0.35);
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "diamond": {
      ctx.rotate(Math.PI / 4 + star.phase * 0.05);
      ctx.beginPath();
      ctx.rect(-size * 0.45, -size * 0.45, size * 0.9, size * 0.9);
      ctx.fill();
      break;
    }
    case "cross": {
      ctx.rotate(star.phase * 0.15);
      ctx.lineWidth = Math.max(0.7, size * 0.4);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-size * 1.6, 0);
      ctx.lineTo(size * 1.6, 0);
      ctx.moveTo(0, -size * 1.6);
      ctx.lineTo(0, size * 1.6);
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}

export function InteractiveStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let glow: Float32Array = new Float32Array(0);
    let w = 0;
    let h = 0;
    let raf = 0;
    let time = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = seedStars(w, h);
      glow = new Float32Array(stars.length);
    };

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      const radius = Math.min(w, h) * 0.12;

      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        let target = 0;
        if (pointer.active) {
          const d = Math.hypot(pointer.x - star.x, pointer.y - star.y);
          target = Math.max(0, 1 - d / radius) ** 1.35;
        }
        glow[i] += (target - glow[i]) * 0.18;
        drawStar(ctx, star, glow[i], time);
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[5]"
      aria-hidden
    />
  );
}
