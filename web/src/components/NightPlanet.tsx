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
  while (lights.length < count && i < count * 10) {
    i += 1;
    const lon = (Math.random() * 2 - 1) * Math.PI;
    const lat = (Math.random() * 2 - 1) * (Math.PI / 2.2);
    const cluster = Math.random();
    const clat = lat + (cluster > 0.7 ? (Math.random() - 0.5) * 0.2 : 0);
    const clon = lon + (cluster > 0.7 ? (Math.random() - 0.5) * 0.25 : 0);
    const cosLat = Math.cos(clat);
    const x = cosLat * Math.sin(clon);
    const y = Math.sin(clat);
    const z = cosLat * Math.cos(clon);
    if (z < -0.2) continue;
    lights.push({
      x,
      y,
      z,
      size: 0.5 + Math.random() * 1.8,
      base: Math.random() * 0.1,
      warmth: 0.3 + Math.random() * 0.7,
    });
  }
  return lights;
}

function seedStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.35 + 0.2,
    a: 0.12 + Math.random() * 0.5,
  }));
}

function rotatePoint(
  x: number,
  y: number,
  z: number,
  yaw: number,
  pitch: number
) {
  // yaw around Y
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  let x1 = x * cosY + z * sinY;
  let z1 = -x * sinY + z * cosY;
  let y1 = y;

  // pitch around X
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const y2 = y1 * cosP - z1 * sinP;
  const z2 = y1 * sinP + z1 * cosP;
  return { x: x1, y: y2, z: z2 };
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
    const lights = seedLights(480);
    let stars: Star[] = [];
    const glow = new Float32Array(lights.length);

    const pointer = { x: 0.5, y: 0.55, active: false };
    const tilt = { yaw: 0, pitch: 0 };
    const targetTilt = { yaw: 0, pitch: 0 };
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
      stars = seedStars(Math.floor((w * h) / 8500), w, h);
    };

    const draw = () => {
      time += 0.016;

      // Smooth tilt toward cursor
      tilt.yaw += (targetTilt.yaw - tilt.yaw) * 0.08;
      tilt.pitch += (targetTilt.pitch - tilt.pitch) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const space = ctx.createRadialGradient(
        w * 0.5,
        h * 0.4,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.8
      );
      space.addColorStop(0, "#0c1018");
      space.addColorStop(0.55, "#09090b");
      space.addColorStop(1, "#050507");
      ctx.fillStyle = space;
      ctx.fillRect(0, 0, w, h);

      for (const star of stars) {
        const twinkle = 0.75 + Math.sin(time * 1.5 + star.x * 0.02) * 0.25;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${star.a * twinkle})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const radius = Math.min(w, h) * (w < 640 ? 0.42 : 0.4);
      const cx = w * 0.5 + tilt.yaw * radius * 0.12;
      const cy = h * 0.62 + tilt.pitch * radius * 0.1;

      // Cursor-following atmospheric glow behind planet
      if (pointer.active) {
        const gx = pointer.x * w;
        const gy = pointer.y * h;
        const cursorGlow = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius * 0.9);
        cursorGlow.addColorStop(0, "rgba(255,210,140,0.16)");
        cursorGlow.addColorStop(0.35, "rgba(160,190,255,0.08)");
        cursorGlow.addColorStop(1, "rgba(160,190,255,0)");
        ctx.fillStyle = cursorGlow;
        ctx.fillRect(0, 0, w, h);
      }

      // Outer atmosphere
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.32);
      halo.addColorStop(0, "rgba(120,160,255,0)");
      halo.addColorStop(0.6, "rgba(100,150,255,0.1)");
      halo.addColorStop(1, "rgba(100,150,255,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.32, 0, Math.PI * 2);
      ctx.fill();

      // Tilted planet shadow ellipse feel via transform-ish offset light
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      const lightX = cx - radius * (0.35 - tilt.yaw * 0.25);
      const lightY = cy - radius * (0.42 - tilt.pitch * 0.2);
      const body = ctx.createRadialGradient(lightX, lightY, radius * 0.08, cx, cy, radius);
      body.addColorStop(0, "#1c2a44");
      body.addColorStop(0.35, "#101929");
      body.addColorStop(0.72, "#0a1019");
      body.addColorStop(1, "#05070c");
      ctx.fillStyle = body;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // Soft landmasses with tilt
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#162033";
      for (let i = 0; i < 16; i += 1) {
        const a = (i / 16) * Math.PI * 2 + tilt.yaw;
        const rx = radius * (0.16 + (i % 4) * 0.05);
        const ry = radius * (0.07 + (i % 3) * 0.035);
        ctx.beginPath();
        ctx.ellipse(
          cx + Math.cos(a + tilt.pitch) * radius * 0.32,
          cy + Math.sin(a * 1.2) * radius * 0.26,
          rx,
          ry,
          a + tilt.yaw,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const night = ctx.createLinearGradient(
        cx - radius + tilt.yaw * radius * 0.4,
        cy,
        cx + radius + tilt.yaw * radius * 0.4,
        cy
      );
      night.addColorStop(0, "rgba(0,0,0,0.12)");
      night.addColorStop(0.5, "rgba(0,0,0,0.04)");
      night.addColorStop(1, "rgba(0,0,0,0.58)");
      ctx.fillStyle = night;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      const px = pointer.x * w;
      const py = pointer.y * h;

      for (let i = 0; i < lights.length; i += 1) {
        const light = lights[i];
        const spun = rotatePoint(
          light.x,
          light.y,
          light.z,
          tilt.yaw * 0.85 + time * 0.012,
          tilt.pitch * 0.7
        );
        if (spun.z < 0.04) {
          glow[i] *= 0.88;
          continue;
        }

        const perspective = 1 / (1.12 - spun.z * 0.38);
        const sx = cx + spun.x * radius * 0.92 * perspective;
        const sy = cy + spun.y * radius * 0.92 * perspective;
        const dist = Math.hypot(px - sx, py - sy);
        const influence = pointer.active
          ? Math.max(0, 1 - dist / (radius * 0.32))
          : 0;
        const target =
          light.base + influence ** 1.45 * (0.85 + light.warmth * 0.55);
        glow[i] += (target - glow[i]) * 0.18;

        if (glow[i] < 0.025) continue;

        const alpha = glow[i] * (0.3 + spun.z * 0.7);
        const size = light.size * perspective * (0.75 + glow[i] * 1.55);
        const warm = light.warmth;
        const r = 255;
        const g = Math.floor(205 + warm * 40);
        const b = Math.floor(130 + (1 - warm) * 70);

        const bloom = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 5.5);
        bloom.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.6})`);
        bloom.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.16})`);
        bloom.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(sx, sy, size * 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,250,230,${Math.min(1, alpha * 1.3)})`;
        ctx.arc(sx, sy, Math.max(0.6, size * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      // Soft specular sheen following tilt / cursor
      const sheenX = cx + (pointer.active ? (px - cx) * 0.15 : -radius * 0.2);
      const sheenY = cy + (pointer.active ? (py - cy) * 0.12 : -radius * 0.25);
      const sheen = ctx.createRadialGradient(sheenX, sheenY, 0, sheenX, sheenY, radius * 0.55);
      sheen.addColorStop(0, "rgba(200,220,255,0.14)");
      sheen.addColorStop(0.5, "rgba(160,190,255,0.04)");
      sheen.addColorStop(1, "rgba(160,190,255,0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      ctx.restore();

      // Rim
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(170,200,255,0.2)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Bottom page fade
      const fade = ctx.createLinearGradient(0, h * 0.78, 0, h);
      fade.addColorStop(0, "rgba(9,9,11,0)");
      fade.addColorStop(1, "rgba(9,9,11,0.55)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, h * 0.78, w, h * 0.22);

      raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      pointer.x = nx;
      pointer.y = ny;
      pointer.active = true;
      // Map cursor to planet tilt (radians)
      targetTilt.yaw = (nx - 0.5) * 0.85;
      targetTilt.pitch = (ny - 0.55) * 0.55;
    };

    const onLeave = () => {
      pointer.active = false;
      targetTilt.yaw = 0;
      targetTilt.pitch = 0;
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
    <div ref={wrapRef} className="absolute inset-0 z-0 touch-none">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
    </div>
  );
}
