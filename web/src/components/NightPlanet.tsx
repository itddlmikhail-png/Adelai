"use client";

import { useEffect, useRef } from "react";

type CityLight = {
  x: number;
  y: number;
  z: number;
  size: number;
  base: number;
  warmth: number;
};

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
};

function seedLights(count: number): CityLight[] {
  const lights: CityLight[] = [];
  let i = 0;
  while (lights.length < count && i < count * 8) {
    i += 1;
    // Bias toward mid-latitudes / coastal clusters for a believable night map
    const lon = (Math.random() * 2 - 1) * Math.PI;
    const lat = (Math.random() * 2 - 1) * (Math.PI / 2.15);
    const cluster = Math.random();
    const clat = lat + (cluster > 0.72 ? (Math.random() - 0.5) * 0.18 : 0);
    const clon = lon + (cluster > 0.72 ? (Math.random() - 0.5) * 0.22 : 0);

    const cosLat = Math.cos(clat);
    const x = cosLat * Math.sin(clon);
    const y = Math.sin(clat);
    const z = cosLat * Math.cos(clon);

    // Prefer the night-facing / front hemisphere
    if (z < -0.15) continue;

    lights.push({
      x,
      y,
      z,
      size: 0.55 + Math.random() * 1.7,
      base: Math.random() * 0.12,
      warmth: 0.35 + Math.random() * 0.65,
    });
  }
  return lights;
}

function seedStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.4 + 0.2,
    a: 0.15 + Math.random() * 0.55,
  }));
}

export function NightPlanet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let lights = seedLights(420);
    let stars: Star[] = [];
    let pointer = { x: -9999, y: -9999, active: false };
    let glow = new Float32Array(lights.length);
    let time = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = seedStars(Math.floor((w * h) / 9000), w, h);
    };

    const project = (light: CityLight, cx: number, cy: number, radius: number) => {
      // Soft rotation for life
      const rot = time * 0.015;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const rx = light.x * cos + light.z * sin;
      const rz = -light.x * sin + light.z * cos;
      const ry = light.y;

      if (rz < 0.02) return null;

      const perspective = 1 / (1.15 - rz * 0.35);
      return {
        px: cx + rx * radius * perspective,
        py: cy + ry * radius * perspective * 0.98,
        depth: rz,
        scale: perspective,
      };
    };

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Deep space
      const space = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
      space.addColorStop(0, "#0c1018");
      space.addColorStop(0.55, "#09090b");
      space.addColorStop(1, "#050507");
      ctx.fillStyle = space;
      ctx.fillRect(0, 0, w, h);

      // Stars
      for (const star of stars) {
        const twinkle = 0.75 + Math.sin(time * 1.4 + star.x * 0.01) * 0.25;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${star.a * twinkle})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const radius = Math.min(w, h) * 0.38;
      const cx = w * 0.5;
      const cy = h * 0.56;

      // Atmospheric outer glow
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.28);
      halo.addColorStop(0, "rgba(120,160,255,0.00)");
      halo.addColorStop(0.55, "rgba(90,140,255,0.08)");
      halo.addColorStop(1, "rgba(90,140,255,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.28, 0, Math.PI * 2);
      ctx.fill();

      // Planet body
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      const body = ctx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.42,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      body.addColorStop(0, "#1a2740");
      body.addColorStop(0.35, "#101929");
      body.addColorStop(0.7, "#0a1019");
      body.addColorStop(1, "#05070c");
      ctx.fillStyle = body;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // Subtle continent silhouettes
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#152033";
      for (let i = 0; i < 18; i += 1) {
        const a = (i / 18) * Math.PI * 2 + time * 0.01;
        const rx = radius * (0.18 + (i % 5) * 0.05);
        const ry = radius * (0.08 + (i % 3) * 0.04);
        ctx.beginPath();
        ctx.ellipse(
          cx + Math.cos(a) * radius * 0.35,
          cy + Math.sin(a * 1.3) * radius * 0.28,
          rx,
          ry,
          a,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Terminator / night softness
      const night = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
      night.addColorStop(0, "rgba(0,0,0,0.15)");
      night.addColorStop(0.45, "rgba(0,0,0,0.05)");
      night.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = night;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // City lights
      for (let i = 0; i < lights.length; i += 1) {
        const light = lights[i];
        const p = project(light, cx, cy, radius * 0.92);
        if (!p) {
          glow[i] *= 0.9;
          continue;
        }

        const dx = pointer.x - p.px;
        const dy = pointer.y - p.py;
        const dist = Math.hypot(dx, dy);
        const influence = pointer.active
          ? Math.max(0, 1 - dist / (radius * 0.28))
          : 0;
        const target = light.base + influence ** 1.6 * (0.75 + light.warmth * 0.5);
        glow[i] += (target - glow[i]) * 0.14;

        if (glow[i] < 0.02) continue;

        const alpha = glow[i] * (0.35 + p.depth * 0.65);
        const size = light.size * p.scale * (0.8 + glow[i] * 1.4);
        const warm = light.warmth;
        const r = 255;
        const g = Math.floor(210 + warm * 35);
        const b = Math.floor(140 + (1 - warm) * 80);

        // Soft bloom
        const bloom = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, size * 5);
        bloom.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.55})`);
        bloom.addColorStop(0.35, `rgba(${r},${g},${b},${alpha * 0.18})`);
        bloom.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(p.px, p.py, size * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 248, 230, ${Math.min(1, alpha * 1.25)})`;
        ctx.arc(p.px, p.py, size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Rim light
      const rim = ctx.createRadialGradient(
        cx - radius * 0.55,
        cy - radius * 0.6,
        radius * 0.2,
        cx,
        cy,
        radius
      );
      rim.addColorStop(0, "rgba(180,210,255,0.18)");
      rim.addColorStop(0.45, "rgba(180,210,255,0.04)");
      rim.addColorStop(1, "rgba(180,210,255,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = rim;
      ctx.fill();

      // Crisp limb
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(160,190,255,0.18)";
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Soft ground fade into page
      const fade = ctx.createLinearGradient(0, h * 0.72, 0, h);
      fade.addColorStop(0, "rgba(9,9,11,0)");
      fade.addColorStop(1, "rgba(9,9,11,0.92)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, h * 0.72, w, h * 0.28);

      raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 z-0 cursor-crosshair">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
    </div>
  );
}
