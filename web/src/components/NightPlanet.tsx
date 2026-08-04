"use client";

import { useEffect, useRef } from "react";

type City = {
  x: number;
  y: number;
  z: number;
  size: number;
  base: number;
  links: number[];
};

type Star = { x: number; y: number; r: number; a: number };

type Projected = {
  i: number;
  sx: number;
  sy: number;
  z: number;
  glow: number;
  size: number;
};

/** Approximate city belts / continent clusters on a unit sphere */
const CITY_REGIONS: { lon: number; lat: number; spread: number; count: number }[] = [
  { lon: -1.3, lat: 0.65, spread: 0.55, count: 55 }, // N America
  { lon: -0.95, lat: 0.25, spread: 0.35, count: 28 }, // Central America
  { lon: -0.8, lat: -0.35, spread: 0.45, count: 35 }, // S America
  { lon: 0.15, lat: 0.85, spread: 0.5, count: 70 }, // Europe
  { lon: 0.4, lat: 0.35, spread: 0.45, count: 40 }, // N Africa / Mid East
  { lon: 0.55, lat: -0.25, spread: 0.4, count: 30 }, // Africa
  { lon: 1.1, lat: 0.55, spread: 0.55, count: 65 }, // India / SE Asia
  { lon: 1.7, lat: 0.55, spread: 0.45, count: 55 }, // East Asia
  { lon: 2.2, lat: -0.5, spread: 0.35, count: 25 }, // Australia
  { lon: -2.6, lat: 0.55, spread: 0.25, count: 18 }, // West coast / Pacific
];

function lonLatToXYZ(lon: number, lat: number) {
  const cosLat = Math.cos(lat);
  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon),
  };
}

function seedCities(): City[] {
  const cities: City[] = [];

  for (const region of CITY_REGIONS) {
    for (let i = 0; i < region.count; i += 1) {
      const lon = region.lon + (Math.random() - 0.5) * region.spread;
      const lat = region.lat + (Math.random() - 0.5) * region.spread * 0.7;
      const p = lonLatToXYZ(lon, lat);
      if (p.z < -0.35) continue;
      cities.push({
        x: p.x,
        y: p.y,
        z: p.z,
        size: 0.7 + Math.random() * 1.8,
        base: 0.03 + Math.random() * 0.08,
        links: [],
      });
    }
  }

  // Dense mega-city hubs
  const hubs = [
    [-1.29, 0.71],
    [-1.22, 0.6],
    [-0.76, -0.41],
    [0.04, 0.9],
    [0.2, 0.85],
    [0.55, 0.52],
    [1.2, 0.5],
    [1.85, 0.62],
    [2.35, -0.59],
  ];
  for (const [lon, lat] of hubs) {
    for (let i = 0; i < 10; i += 1) {
      const p = lonLatToXYZ(
        lon + (Math.random() - 0.5) * 0.12,
        lat + (Math.random() - 0.5) * 0.08
      );
      cities.push({
        x: p.x,
        y: p.y,
        z: p.z,
        size: 1.1 + Math.random() * 1.6,
        base: 0.06 + Math.random() * 0.08,
        links: [],
      });
    }
  }

  // Nearest neighbor links
  for (let a = 0; a < cities.length; a += 1) {
    const dists: { i: number; d: number }[] = [];
    for (let b = 0; b < cities.length; b += 1) {
      if (a === b) continue;
      const dx = cities[a].x - cities[b].x;
      const dy = cities[a].y - cities[b].y;
      const dz = cities[a].z - cities[b].z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < 0.05) dists.push({ i: b, d });
    }
    dists.sort((p, q) => p.d - q.d);
    cities[a].links = dists.slice(0, 4).map((item) => item.i);
  }

  return cities;
}

function seedStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.3 + 0.2,
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
  return {
    x: x1,
    y: y * cosP - z1 * sinP,
    z: y * sinP + z1 * cosP,
  };
}

/** Soft continent blotches painted in lon/lat space */
function drawContinents(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  yaw: number,
  pitch: number
) {
  const blobs = [
    { lon: -1.3, lat: 0.7, rx: 0.42, ry: 0.28, rot: 0.2, color: "#2f6b3c" },
    { lon: -1.0, lat: 0.35, rx: 0.18, ry: 0.22, rot: -0.3, color: "#3a7a45" },
    { lon: -0.85, lat: -0.3, rx: 0.28, ry: 0.45, rot: 0.4, color: "#2d7340" },
    { lon: 0.2, lat: 0.85, rx: 0.35, ry: 0.2, rot: 0.1, color: "#3f7d4a" },
    { lon: 0.45, lat: 0.2, rx: 0.38, ry: 0.5, rot: 0.15, color: "#4a7a3a" },
    { lon: 1.2, lat: 0.45, rx: 0.48, ry: 0.35, rot: -0.2, color: "#356f3f" },
    { lon: 1.9, lat: 0.65, rx: 0.28, ry: 0.22, rot: 0.3, color: "#2f6840" },
    { lon: 2.3, lat: -0.5, rx: 0.28, ry: 0.2, rot: 0.1, color: "#3b7544" },
    { lon: -0.1, lat: -1.1, rx: 0.35, ry: 0.16, rot: 0, color: "#d8e6f0" }, // Antarctica hint
  ];

  for (const blob of blobs) {
    const p = lonLatToXYZ(blob.lon, blob.lat);
    const spun = rotatePoint(p.x, p.y, p.z, yaw, pitch);
    if (spun.z < 0.05) continue;
    const perspective = 1 / (1.12 - spun.z * 0.4);
    const sx = cx + spun.x * radius * perspective;
    const sy = cy + spun.y * radius * perspective;
    const depth = Math.max(0.15, spun.z);

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(blob.rot + yaw * 0.4);
    ctx.scale(perspective, perspective * 0.92);
    ctx.globalAlpha = 0.35 + depth * 0.35;
    ctx.fillStyle = blob.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * blob.rx, radius * blob.ry, 0, 0, Math.PI * 2);
    ctx.fill();
    // secondary peninsula
    ctx.beginPath();
    ctx.ellipse(
      radius * blob.rx * 0.35,
      radius * blob.ry * 0.15,
      radius * blob.rx * 0.45,
      radius * blob.ry * 0.35,
      0.4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }
}

function drawClouds(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  yaw: number,
  pitch: number,
  time: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 18; i += 1) {
    const lon = ((i * 1.7 + time * 0.08) % (Math.PI * 2)) - Math.PI;
    const lat = Math.sin(i * 1.3 + time * 0.05) * 0.7;
    const p = lonLatToXYZ(lon, lat);
    const spun = rotatePoint(p.x, p.y, p.z, yaw, pitch);
    if (spun.z < 0.1) continue;
    const perspective = 1 / (1.1 - spun.z * 0.35);
    ctx.beginPath();
    ctx.ellipse(
      cx + spun.x * radius * perspective,
      cy + spun.y * radius * perspective,
      radius * (0.12 + (i % 4) * 0.03) * perspective,
      radius * (0.04 + (i % 3) * 0.015) * perspective,
      lon,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  ctx.restore();
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
    const cities = seedCities();
    let stars: Star[] = [];
    const glow = new Float32Array(cities.length);

    const pointer = { x: 0.5, y: 0.58, active: false };
    const tilt = { yaw: 0, pitch: 0 };
    const targetTilt = { yaw: 0, pitch: 0 };
    const follow = { x: 0.5, y: 0.58 };
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

    const draw = () => {
      time += 0.016;

      // Very responsive follow
      tilt.yaw += (targetTilt.yaw - tilt.yaw) * 0.22;
      tilt.pitch += (targetTilt.pitch - tilt.pitch) * 0.22;
      follow.x += ((pointer.active ? pointer.x : 0.5) - follow.x) * 0.25;
      follow.y += ((pointer.active ? pointer.y : 0.58) - follow.y) * 0.25;

      ctx.clearRect(0, 0, w, h);

      // Space
      const space = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.55, Math.max(w, h) * 0.85);
      space.addColorStop(0, "#0d1528");
      space.addColorStop(0.5, "#080c16");
      space.addColorStop(1, "#04050a");
      ctx.fillStyle = space;
      ctx.fillRect(0, 0, w, h);

      for (const star of stars) {
        const twinkle = 0.7 + Math.sin(time * 1.7 + star.x) * 0.3;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${star.a * twinkle})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const radius = Math.min(w, h) * (w < 640 ? 0.43 : 0.41);
      const cx = w * 0.5 + tilt.yaw * radius * 0.18;
      const cy = h * 0.58 + tilt.pitch * radius * 0.14;

      // Cursor atmosphere bloom
      const gx = follow.x * w;
      const gy = follow.y * h;
      const bloom = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius * 1.05);
      bloom.addColorStop(0, pointer.active ? "rgba(255,210,90,0.2)" : "rgba(100,170,255,0.06)");
      bloom.addColorStop(0.4, "rgba(80,150,255,0.08)");
      bloom.addColorStop(1, "rgba(40,80,160,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      // Atmosphere halo
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.28);
      halo.addColorStop(0, "rgba(90,170,255,0)");
      halo.addColorStop(0.65, "rgba(90,170,255,0.22)");
      halo.addColorStop(1, "rgba(90,170,255,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.28, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // Ocean body
      const lightX = cx + (follow.x - 0.5) * radius * 0.9;
      const lightY = cy + (follow.y - 0.5) * radius * 0.7;
      const ocean = ctx.createRadialGradient(lightX, lightY, radius * 0.05, cx, cy, radius);
      ocean.addColorStop(0, "#6ec8ff");
      ocean.addColorStop(0.18, "#2f8fe0");
      ocean.addColorStop(0.42, "#1560b8");
      ocean.addColorStop(0.7, "#0b2f6e");
      ocean.addColorStop(1, "#061533");
      ctx.fillStyle = ocean;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      const yaw = tilt.yaw * 0.95 + time * 0.02;
      const pitch = tilt.pitch * 0.85;
      drawContinents(ctx, cx, cy, radius, yaw, pitch);

      // Night terminator
      const night = ctx.createLinearGradient(
        cx - radius + tilt.yaw * radius * 0.6,
        cy,
        cx + radius + tilt.yaw * radius * 0.6,
        cy
      );
      night.addColorStop(0, "rgba(2,8,24,0.05)");
      night.addColorStop(0.4, "rgba(2,8,24,0.18)");
      night.addColorStop(0.75, "rgba(1,4,16,0.55)");
      night.addColorStop(1, "rgba(0,2,10,0.78)");
      ctx.fillStyle = night;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      drawClouds(ctx, cx, cy, radius, yaw + 0.15, pitch, time);

      // Cities
      const px = follow.x * w;
      const py = follow.y * h;
      const projected: Projected[] = [];
      const byIndex = new Map<number, Projected>();

      for (let i = 0; i < cities.length; i += 1) {
        const city = cities[i];
        const spun = rotatePoint(city.x, city.y, city.z, yaw, pitch);
        if (spun.z < 0.08) {
          glow[i] *= 0.82;
          continue;
        }
        const perspective = 1 / (1.1 - spun.z * 0.4);
        const sx = cx + spun.x * radius * 0.93 * perspective;
        const sy = cy + spun.y * radius * 0.93 * perspective;
        const dist = Math.hypot(px - sx, py - sy);
        const influence = pointer.active
          ? Math.max(0, 1 - dist / (radius * 0.38)) ** 1.15
          : 0;
        const target = city.base + influence * 1.35;
        glow[i] += (target - glow[i]) * 0.28;

        // faint always-on city texture on night side
        const nightSide = spun.x * Math.cos(tilt.yaw) > -0.1;
        const ambient = nightSide ? city.base * 0.55 : city.base * 0.15;
        const g = Math.max(glow[i], ambient * (pointer.active ? 0.35 : 0.7));

        if (g < 0.04) continue;

        const node: Projected = {
          i,
          sx,
          sy,
          z: spun.z,
          glow: g,
          size: city.size * perspective * (0.7 + g * 1.5),
        };
        projected.push(node);
        byIndex.set(i, node);
      }

      // Links between glowing cities
      ctx.lineCap = "round";
      for (const node of projected) {
        if (node.glow < 0.18) continue;
        for (const link of cities[node.i].links) {
          if (link <= node.i) continue;
          const other = byIndex.get(link);
          if (!other || other.glow < 0.18) continue;
          const strength = Math.min(node.glow, other.glow);
          if (strength < 0.22) continue;

          const midX = (node.sx + other.sx) / 2;
          const midY = (node.sy + other.sy) / 2 - 8 * strength;
          const grad = ctx.createLinearGradient(node.sx, node.sy, other.sx, other.sy);
          grad.addColorStop(0, `rgba(255, 210, 70, ${0.08 + strength * 0.55})`);
          grad.addColorStop(0.5, `rgba(255, 240, 150, ${0.16 + strength * 0.5})`);
          grad.addColorStop(1, `rgba(255, 200, 60, ${0.08 + strength * 0.55})`);

          ctx.beginPath();
          ctx.moveTo(node.sx, node.sy);
          ctx.quadraticCurveTo(midX, midY, other.sx, other.sy);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.7 + strength * 2;
          ctx.stroke();

          const t = (Math.sin(time * 4 + node.i) + 1) / 2;
          const qx = (1 - t) * (1 - t) * node.sx + 2 * (1 - t) * t * midX + t * t * other.sx;
          const qy = (1 - t) * (1 - t) * node.sy + 2 * (1 - t) * t * midY + t * t * other.sy;
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 245, 180, ${0.45 + strength * 0.5})`;
          ctx.arc(qx, qy, 1.2 + strength * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Yellow city lights
      for (const node of projected) {
        const alpha = node.glow * (0.4 + node.z * 0.6);
        const light = ctx.createRadialGradient(
          node.sx,
          node.sy,
          0,
          node.sx,
          node.sy,
          node.size * 5
        );
        light.addColorStop(0, `rgba(255, 230, 120, ${alpha * 0.85})`);
        light.addColorStop(0.35, `rgba(255, 190, 40, ${alpha * 0.28})`);
        light.addColorStop(1, "rgba(255, 160, 0, 0)");
        ctx.fillStyle = light;
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, node.size * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 248, 200, ${Math.min(1, alpha * 1.4)})`;
        ctx.arc(node.sx, node.sy, Math.max(0.7, node.size * 0.45), 0, Math.PI * 2);
        ctx.fill();
      }

      // Specular water highlight following cursor tightly
      const sheen = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, radius * 0.5);
      sheen.addColorStop(0, "rgba(200,240,255,0.28)");
      sheen.addColorStop(0.35, "rgba(140,200,255,0.08)");
      sheen.addColorStop(1, "rgba(100,170,255,0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      ctx.restore();

      // Crisp limb
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(150,210,255,0.35)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Inner atmosphere ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(120,190,255,0.12)";
      ctx.lineWidth = 4;
      ctx.stroke();

      const fade = ctx.createLinearGradient(0, h * 0.8, 0, h);
      fade.addColorStop(0, "rgba(9,9,11,0)");
      fade.addColorStop(1, "rgba(9,9,11,0.55)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, h * 0.8, w, h * 0.2);

      raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      pointer.x = nx;
      pointer.y = ny;
      pointer.active = true;
      targetTilt.yaw = (nx - 0.5) * 1.15;
      targetTilt.pitch = (ny - 0.55) * 0.75;
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
    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onMove, { passive: true });

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
