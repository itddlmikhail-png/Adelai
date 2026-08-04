"use client";

import { useEffect, useRef } from "react";

type CityLight = {
  x: number;
  y: number;
  z: number;
  size: number;
  base: number;
  hue: number;
  links: number[];
};

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
};

type Projected = {
  i: number;
  sx: number;
  sy: number;
  z: number;
  glow: number;
  size: number;
  hue: number;
};

function seedLights(count: number): CityLight[] {
  const lights: CityLight[] = [];
  let i = 0;
  while (lights.length < count && i < count * 12) {
    i += 1;
    const lon = (Math.random() * 2 - 1) * Math.PI;
    const lat = (Math.random() * 2 - 1) * (Math.PI / 2.25);
    const cluster = Math.random();
    const clat = lat + (cluster > 0.62 ? (Math.random() - 0.5) * 0.22 : 0);
    const clon = lon + (cluster > 0.62 ? (Math.random() - 0.5) * 0.28 : 0);
    const cosLat = Math.cos(clat);
    const x = cosLat * Math.sin(clon);
    const y = Math.sin(clat);
    const z = cosLat * Math.cos(clon);
    if (z < -0.18) continue;
    lights.push({
      x,
      y,
      z,
      size: 0.55 + Math.random() * 1.7,
      base: 0.04 + Math.random() * 0.1,
      hue: 28 + Math.random() * 42 + (Math.random() > 0.82 ? 160 : 0),
      links: [],
    });
  }

  // Precompute nearest-neighbor links on the sphere
  for (let a = 0; a < lights.length; a += 1) {
    const distances: { i: number; d: number }[] = [];
    for (let b = 0; b < lights.length; b += 1) {
      if (a === b) continue;
      const dx = lights[a].x - lights[b].x;
      const dy = lights[a].y - lights[b].y;
      const dz = lights[a].z - lights[b].z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < 0.085) distances.push({ i: b, d });
    }
    distances.sort((p, q) => p.d - q.d);
    lights[a].links = distances.slice(0, 3).map((item) => item.i);
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
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const y2 = y * cosP - z1 * sinP;
  const z2 = y * sinP + z1 * cosP;
  return { x: x1, y: y2, z: z2 };
}

function hsl(h: number, s: number, l: number, a = 1) {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
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
    const lights = seedLights(360);
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
      tilt.yaw += (targetTilt.yaw - tilt.yaw) * 0.08;
      tilt.pitch += (targetTilt.pitch - tilt.pitch) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const space = ctx.createRadialGradient(
        w * 0.5,
        h * 0.38,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.82
      );
      space.addColorStop(0, "#10182a");
      space.addColorStop(0.45, "#0a0f1a");
      space.addColorStop(1, "#05060a");
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
      const cy = h * 0.6 + tilt.pitch * radius * 0.1;

      if (pointer.active) {
        const gx = pointer.x * w;
        const gy = pointer.y * h;
        const cursorGlow = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius * 0.95);
        cursorGlow.addColorStop(0, "rgba(255,190,110,0.18)");
        cursorGlow.addColorStop(0.35, "rgba(120,180,255,0.1)");
        cursorGlow.addColorStop(1, "rgba(80,120,255,0)");
        ctx.fillStyle = cursorGlow;
        ctx.fillRect(0, 0, w, h);
      }

      // Colorful atmosphere / aurora rim
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.36);
      halo.addColorStop(0, "rgba(80,160,255,0)");
      halo.addColorStop(0.55, "rgba(70,170,255,0.16)");
      halo.addColorStop(0.78, "rgba(160,90,255,0.1)");
      halo.addColorStop(1, "rgba(255,120,80,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.36, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // Colorful planet body — deep ocean + lit limb
      const lightX = cx - radius * (0.38 - tilt.yaw * 0.28);
      const lightY = cy - radius * (0.4 - tilt.pitch * 0.22);
      const body = ctx.createRadialGradient(lightX, lightY, radius * 0.05, cx, cy, radius);
      body.addColorStop(0, "#4aa3ff");
      body.addColorStop(0.22, "#1f6fd0");
      body.addColorStop(0.48, "#123a7a");
      body.addColorStop(0.72, "#0a1d40");
      body.addColorStop(1, "#050d1c");
      ctx.fillStyle = body;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // Continent washes
      ctx.globalAlpha = 0.34;
      for (let i = 0; i < 14; i += 1) {
        const a = (i / 14) * Math.PI * 2 + tilt.yaw * 0.8;
        ctx.fillStyle = i % 2 === 0 ? "#2f8f6b" : "#3d7a4a";
        ctx.beginPath();
        ctx.ellipse(
          cx + Math.cos(a + tilt.pitch) * radius * 0.34,
          cy + Math.sin(a * 1.15) * radius * 0.28,
          radius * (0.14 + (i % 4) * 0.04),
          radius * (0.07 + (i % 3) * 0.03),
          a + tilt.yaw,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Soft night shade
      const night = ctx.createLinearGradient(
        cx - radius + tilt.yaw * radius * 0.45,
        cy,
        cx + radius + tilt.yaw * radius * 0.45,
        cy
      );
      night.addColorStop(0, "rgba(5,10,30,0.08)");
      night.addColorStop(0.45, "rgba(5,10,30,0.12)");
      night.addColorStop(1, "rgba(2,4,14,0.62)");
      ctx.fillStyle = night;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // Aurora band
      const aurora = ctx.createLinearGradient(cx - radius, cy - radius * 0.7, cx + radius, cy + radius * 0.2);
      aurora.addColorStop(0, "rgba(80,255,200,0)");
      aurora.addColorStop(0.35, "rgba(90,255,190,0.08)");
      aurora.addColorStop(0.55, "rgba(160,110,255,0.1)");
      aurora.addColorStop(1, "rgba(255,120,180,0)");
      ctx.fillStyle = aurora;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      const px = pointer.x * w;
      const py = pointer.y * h;
      const projected: Projected[] = [];
      const projectedByIndex = new Map<number, Projected>();

      for (let i = 0; i < lights.length; i += 1) {
        const light = lights[i];
        const spun = rotatePoint(
          light.x,
          light.y,
          light.z,
          tilt.yaw * 0.85 + time * 0.012,
          tilt.pitch * 0.7
        );
        if (spun.z < 0.05) {
          glow[i] *= 0.88;
          continue;
        }

        const perspective = 1 / (1.12 - spun.z * 0.38);
        const sx = cx + spun.x * radius * 0.92 * perspective;
        const sy = cy + spun.y * radius * 0.92 * perspective;
        const dist = Math.hypot(px - sx, py - sy);
        const influence = pointer.active
          ? Math.max(0, 1 - dist / (radius * 0.34))
          : 0;
        const target = light.base + influence ** 1.35 * 1.15;
        glow[i] += (target - glow[i]) * 0.18;

        if (glow[i] < 0.03) continue;

        const node: Projected = {
          i,
          sx,
          sy,
          z: spun.z,
          glow: glow[i],
          size: light.size * perspective * (0.75 + glow[i] * 1.5),
          hue: light.hue,
        };
        projected.push(node);
        projectedByIndex.set(i, node);
      }

      // Connection lines between lit neighbors
      ctx.lineCap = "round";
      for (const node of projected) {
        const source = lights[node.i];
        for (const linkIndex of source.links) {
          if (linkIndex <= node.i) continue;
          const otherGlow = glow[linkIndex];
          if (otherGlow < 0.08 || node.glow < 0.08) continue;

          const other = projectedByIndex.get(linkIndex);
          if (!other) continue;

          const strength = Math.min(node.glow, otherGlow);
          const midX = (node.sx + other.sx) / 2;
          const midY = (node.sy + other.sy) / 2 - 6 * strength;
          const grad = ctx.createLinearGradient(node.sx, node.sy, other.sx, other.sy);
          grad.addColorStop(0, hsl(node.hue, 95, 65, 0.05 + strength * 0.55));
          grad.addColorStop(0.5, hsl((node.hue + other.hue) / 2, 100, 72, 0.12 + strength * 0.5));
          grad.addColorStop(1, hsl(other.hue, 95, 65, 0.05 + strength * 0.55));

          ctx.beginPath();
          ctx.moveTo(node.sx, node.sy);
          ctx.quadraticCurveTo(midX, midY, other.sx, other.sy);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.6 + strength * 1.8;
          ctx.stroke();

          // traveling pulse
          const t = (Math.sin(time * 3 + node.i * 0.7) + 1) / 2;
          const pulseX = node.sx + (other.sx - node.sx) * t;
          const pulseY = node.sy + (other.sy - node.sy) * t - 6 * strength * Math.sin(Math.PI * t);
          ctx.beginPath();
          ctx.fillStyle = hsl((node.hue + other.hue) / 2, 100, 78, 0.35 + strength * 0.45);
          ctx.arc(pulseX, pulseY, 1.1 + strength * 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Lights on top of links
      for (const node of projected) {
        const alpha = node.glow * (0.35 + node.z * 0.65);
        const bloom = ctx.createRadialGradient(
          node.sx,
          node.sy,
          0,
          node.sx,
          node.sy,
          node.size * 5.5
        );
        bloom.addColorStop(0, hsl(node.hue, 100, 72, alpha * 0.75));
        bloom.addColorStop(0.4, hsl(node.hue, 95, 60, alpha * 0.2));
        bloom.addColorStop(1, hsl(node.hue, 90, 50, 0));
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, node.size * 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = hsl(node.hue, 100, 88, Math.min(1, alpha * 1.35));
        ctx.arc(node.sx, node.sy, Math.max(0.7, node.size * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      // Specular sheen
      const sheenX = cx + (pointer.active ? (px - cx) * 0.16 : -radius * 0.2);
      const sheenY = cy + (pointer.active ? (py - cy) * 0.12 : -radius * 0.25);
      const sheen = ctx.createRadialGradient(sheenX, sheenY, 0, sheenX, sheenY, radius * 0.55);
      sheen.addColorStop(0, "rgba(180,230,255,0.2)");
      sheen.addColorStop(0.45, "rgba(120,190,255,0.06)");
      sheen.addColorStop(1, "rgba(120,190,255,0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(140,210,255,0.28)";
      ctx.lineWidth = 1.3;
      ctx.stroke();

      const fade = ctx.createLinearGradient(0, h * 0.78, 0, h);
      fade.addColorStop(0, "rgba(9,9,11,0)");
      fade.addColorStop(1, "rgba(9,9,11,0.5)");
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
