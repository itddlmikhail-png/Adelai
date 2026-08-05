"use client";

import { useEffect, useRef } from "react";

type StarKind = "dot" | "spark" | "diamond" | "glint" | "flare" | "soft";

type Star = {
  x: number;
  y: number;
  r: number;
  kind: StarKind;
  base: number;
  twinkle: number;
  phase: number;
  drift: number;
};

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
  width: number;
};

/** Approximate on-screen Earth disk (matches NightPlanet framing). */
function planetDisk(w: number, h: number) {
  return {
    cx: w * 0.5,
    cy: h * 0.52,
    r: Math.min(w, h) * 0.44,
  };
}

function outsidePlanet(x: number, y: number, w: number, h: number) {
  const { cx, cy, r } = planetDisk(w, h);
  const dx = (x - cx) / r;
  const dy = (y - cy) / r;
  return dx * dx + dy * dy > 1.02;
}

function planetCover(x: number, y: number, w: number, h: number) {
  // 1 = fully on planet (hide), 0 = clear sky
  if (!shouldMaskPlanet()) return 0;
  const { cx, cy, r } = planetDisk(w, h);
  const d = Math.hypot(x - cx, y - cy) / r;
  if (d >= 1.06) return 0;
  if (d <= 0.96) return 1;
  return 1 - (d - 0.96) / 0.1;
}

function shouldMaskPlanet() {
  if (typeof window === "undefined") return true;
  return !window.location.pathname.includes("/plan");
}

function spawnShootingStar(w: number, h: number): ShootingStar {
  const fromTop = Math.random() > 0.35;
  let x = fromTop ? Math.random() * w * 0.85 : -40;
  let y = fromTop ? -30 : Math.random() * h * 0.4;
  // Prefer starting in the sky, not on the disk
  for (let i = 0; i < 8 && !outsidePlanet(x, y, w, h); i += 1) {
    x = Math.random() * w * 0.7;
    y = -20 - Math.random() * 40;
  }
  const speed = 52 + Math.random() * 36;
  const angle = Math.PI / 5 + Math.random() * (Math.PI / 8);
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 0,
    maxLife: 0.28 + Math.random() * 0.18,
    length: 90 + Math.random() * 130,
    width: 0.55 + Math.random() * 0.55,
  };
}

function drawShootingStar(
  ctx: CanvasRenderingContext2D,
  s: ShootingStar,
  w: number,
  h: number
) {
  const t = s.life / s.maxLife;
  // Bright start, then steadily fade out
  const alpha = Math.max(0, Math.pow(1 - t, 1.15));
  if (alpha <= 0.015) return;

  const cover = planetCover(s.x, s.y, w, h);
  const visible = alpha * (1 - cover);
  if (visible <= 0.015) return;

  const dx = s.vx;
  const dy = s.vy;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const tailLen = s.length * (0.7 + 0.3 * (1 - t));
  const tailX = s.x - ux * tailLen;
  const tailY = s.y - uy * tailLen;

  const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
  grad.addColorStop(0, "rgba(255,255,255,0)");
  grad.addColorStop(0.4, `rgba(255,255,255,${0.18 * visible})`);
  grad.addColorStop(0.8, `rgba(255,255,255,${0.7 * visible})`);
  grad.addColorStop(1, `rgba(255,255,255,${visible})`);

  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = grad;
  ctx.lineWidth = s.width * (0.9 + 0.1 * (1 - t));
  ctx.shadowColor = `rgba(255,255,255,${0.4 * visible})`;
  ctx.shadowBlur = 4 + s.width * 2;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(s.x, s.y);
  ctx.stroke();

  ctx.shadowBlur = 8;
  ctx.fillStyle = `rgba(255,255,255,${visible})`;
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.width * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function seedStars(w: number, h: number): Star[] {
  const area = w * h;
  const count = Math.min(520, Math.max(220, Math.floor(area / 5500)));
  const kinds: StarKind[] = ["dot", "dot", "dot", "spark", "diamond", "glint", "flare", "soft"];
  const stars: Star[] = [];
  const mask = shouldMaskPlanet();

  let attempts = 0;
  while (stars.length < count && attempts < count * 8) {
    attempts += 1;
    const x = Math.random() * w;
    const y = Math.random() * h;
    if (mask && !outsidePlanet(x, y, w, h)) continue;
    stars.push({
      x,
      y,
      r: 0.45 + Math.random() * 1.65,
      kind: kinds[Math.floor(Math.random() * kinds.length)],
      base: 0.22 + Math.random() * 0.42,
      twinkle: 0.35 + Math.random() * 0.95,
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.12,
    });
  }
  return stars;
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  star: Star,
  glow: number,
  time: number,
  w: number,
  h: number
) {
  const ox = star.x + Math.sin(time * 0.15 + star.phase) * star.drift * 8;
  const oy = star.y + Math.cos(time * 0.12 + star.phase) * star.drift * 6;
  const cover = planetCover(ox, oy, w, h);
  if (cover >= 0.98) return;

  const pulse = 0.72 + Math.sin(time * star.twinkle + star.phase) * 0.28;
  const alpha = Math.min(1, (star.base + glow * 1.05) * pulse) * (1 - cover);
  const size = star.r * (1 + glow * 2.2);

  const core = `rgba(255, 255, 255, ${alpha})`;
  const bloom = `rgba(255, 255, 255, ${alpha * 0.42})`;

  if (glow > 0.04) {
    const halo = size * (5.5 + glow * 4);
    const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, halo);
    g.addColorStop(0, bloom);
    g.addColorStop(0.35, `rgba(255, 255, 255, ${alpha * 0.14 * glow})`);
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
  ctx.shadowColor = `rgba(255, 255, 255, ${0.28 + glow * 0.5})`;
  ctx.shadowBlur = 2 + glow * 10;

  switch (star.kind) {
    case "dot": {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "spark": {
      // Soft 4-point twinkle — short tapered rays, not a hard cross
      ctx.rotate(star.phase * 0.2 + time * 0.06);
      ctx.lineCap = "round";
      for (let i = 0; i < 4; i += 1) {
        const a = (i * Math.PI) / 2;
        const len = size * (1.1 + (i % 2) * 0.55);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * size * 0.15, Math.sin(a) * size * 0.15);
        ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        ctx.lineWidth = Math.max(0.4, size * (0.22 - (i % 2) * 0.04));
        ctx.globalAlpha = alpha * (0.55 + (i % 2) * 0.25);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "diamond": {
      ctx.rotate(Math.PI / 4 + star.phase * 0.05);
      ctx.beginPath();
      ctx.rect(-size * 0.38, -size * 0.38, size * 0.76, size * 0.76);
      ctx.fill();
      break;
    }
    case "glint": {
      // Tiny asymmetric shimmer — barely suggests rays
      ctx.rotate(star.phase * 0.35);
      ctx.lineCap = "round";
      ctx.lineWidth = Math.max(0.4, size * 0.22);
      const long = size * 1.25;
      const short = size * 0.55;
      ctx.globalAlpha = alpha * 0.7;
      ctx.beginPath();
      ctx.moveTo(-long, 0);
      ctx.lineTo(long * 0.65, 0);
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.45;
      ctx.beginPath();
      ctx.moveTo(0, -short);
      ctx.lineTo(0, short * 0.8);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "flare": {
      ctx.rotate(star.phase * 0.1 + time * 0.05);
      ctx.lineCap = "round";
      for (let i = 0; i < 6; i += 1) {
        const a = (i * Math.PI) / 3;
        const len = i % 2 === 0 ? size * 2.2 : size * 0.85;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * size * 0.12, Math.sin(a) * size * 0.12);
        ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        ctx.lineWidth = Math.max(0.35, size * (i % 2 === 0 ? 0.2 : 0.14));
        ctx.globalAlpha = alpha * (i % 2 === 0 ? 0.75 : 0.4);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.26, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "soft": {
      // Soft oval speck — no hard geometry
      ctx.rotate(star.phase * 0.4);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.7, size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
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
    let shooters: ShootingStar[] = [];
    let nextShot = 1.2 + Math.random() * 2.5;
    let w = 0;
    let h = 0;
    let raf = 0;
    let time = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    const dt = 0.016;

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
      time += dt;
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
        drawStar(ctx, star, glow[i], time, w, h);
      }

      nextShot -= dt;
      if (nextShot <= 0 && shooters.length < 2) {
        shooters.push(spawnShootingStar(w, h));
        nextShot = 2.2 + Math.random() * 4.5;
      }

      for (let i = shooters.length - 1; i >= 0; i -= 1) {
        const s = shooters[i];
        s.life += dt;
        s.x += s.vx;
        s.y += s.vy;
        drawShootingStar(ctx, s, w, h);
        if (
          s.life >= s.maxLife ||
          s.x > w + 80 ||
          s.y > h + 80
        ) {
          shooters.splice(i, 1);
        }
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
