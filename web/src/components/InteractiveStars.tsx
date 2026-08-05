"use client";

import { useEffect, useRef } from "react";

type StarKind = "dot" | "spark" | "diamond" | "cross" | "flare" | "plus";

type Star = {
  x: number;
  y: number;
  r: number;
  kind: StarKind;
  base: number;
  twinkle: number;
  phase: number;
  hue: number;
  drift: number;
};

function seedStars(w: number, h: number): Star[] {
  const area = w * h;
  const count = Math.min(260, Math.max(110, Math.floor(area / 12000)));
  const kinds: StarKind[] = ["dot", "dot", "spark", "diamond", "cross", "flare", "plus"];
  const stars: Star[] = [];

  for (let i = 0; i < count; i += 1) {
    const roll = Math.random();
    const hue =
      roll > 0.88
        ? 200 + Math.random() * 40
        : roll > 0.72
          ? 35 + Math.random() * 25
          : 50 + Math.random() * 10;

    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.45 + Math.random() * 1.65,
      kind: kinds[Math.floor(Math.random() * kinds.length)],
      base: 0.22 + Math.random() * 0.42,
      twinkle: 0.35 + Math.random() * 0.95,
      phase: Math.random() * Math.PI * 2,
      hue,
      drift: (Math.random() - 0.5) * 0.12,
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
  const pulse = 0.72 + Math.sin(time * star.twinkle + star.phase) * 0.28;
  const alpha = Math.min(1, (star.base + glow * 1.05) * pulse);
  const size = star.r * (1 + glow * 2.2);
  const warm = star.hue < 100;
  const cool = star.hue > 180;

  const core = warm
    ? `rgba(255, 248, 220, ${alpha})`
    : cool
      ? `rgba(225, 238, 255, ${alpha})`
      : `rgba(255, 255, 255, ${alpha})`;

  const bloom = warm
    ? `rgba(255, 200, 110, ${alpha * 0.55})`
    : cool
      ? `rgba(150, 195, 255, ${alpha * 0.5})`
      : `rgba(255, 255, 255, ${alpha * 0.4})`;

  const ox = star.x + Math.sin(time * 0.15 + star.phase) * star.drift * 8;
  const oy = star.y + Math.cos(time * 0.12 + star.phase) * star.drift * 6;

  if (glow > 0.04) {
    const halo = size * (5.5 + glow * 4);
    const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, halo);
    g.addColorStop(0, bloom);
    g.addColorStop(
      0.35,
      warm
        ? `rgba(255, 180, 70, ${alpha * 0.18 * glow})`
        : cool
          ? `rgba(130, 175, 255, ${alpha * 0.16 * glow})`
          : `rgba(255, 255, 255, ${alpha * 0.14 * glow})`
    );
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(ox, oy, halo, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(ox, oy);
  ctx.fillStyle = core;
  ctx.strokeStyle = core;
  ctx.shadowColor = warm
    ? `rgba(255, 210, 120, ${0.35 + glow * 0.55})`
    : cool
      ? `rgba(160, 200, 255, ${0.3 + glow * 0.5})`
      : `rgba(255, 255, 255, ${0.25 + glow * 0.45})`;
  ctx.shadowBlur = 2 + glow * 10;

  switch (star.kind) {
    case "dot": {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "spark": {
      ctx.rotate(star.phase * 0.2 + time * 0.08);
      ctx.beginPath();
      for (let i = 0; i < 4; i += 1) {
        const a = (i * Math.PI) / 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * size * 2.4, Math.sin(a) * size * 2.4);
      }
      ctx.lineWidth = Math.max(0.55, size * 0.32);
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.32, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "diamond": {
      ctx.rotate(Math.PI / 4 + star.phase * 0.05);
      ctx.beginPath();
      ctx.rect(-size * 0.42, -size * 0.42, size * 0.84, size * 0.84);
      ctx.fill();
      break;
    }
    case "cross": {
      ctx.rotate(star.phase * 0.15);
      ctx.lineWidth = Math.max(0.65, size * 0.38);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-size * 1.7, 0);
      ctx.lineTo(size * 1.7, 0);
      ctx.moveTo(0, -size * 1.7);
      ctx.lineTo(0, size * 1.7);
      ctx.stroke();
      break;
    }
    case "flare": {
      ctx.rotate(star.phase * 0.1 + time * 0.05);
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const a = (i * Math.PI) / 3;
        const len = i % 2 === 0 ? size * 2.6 : size * 1.15;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
      }
      ctx.lineWidth = Math.max(0.5, size * 0.28);
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "plus": {
      ctx.rotate(Math.PI / 4);
      ctx.lineWidth = Math.max(0.55, size * 0.3);
      ctx.lineCap = "round";
      const arm = size * 1.35;
      ctx.beginPath();
      ctx.moveTo(-arm, 0);
      ctx.lineTo(arm, 0);
      ctx.moveTo(0, -arm);
      ctx.lineTo(0, arm);
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
    const ctx = canvas.getContext("2d", { alpha: true });
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

      const radius = Math.min(w, h) * 0.16;

      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        let target = 0;
        if (pointer.active) {
          const d = Math.hypot(pointer.x - star.x, pointer.y - star.y);
          target = Math.max(0, 1 - d / radius) ** 1.2;
        }
        glow[i] += (target - glow[i]) * 0.22;
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
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[25]"
      aria-hidden
    />
  );
}
