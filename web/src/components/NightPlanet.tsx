"use client";

import { useEffect, useRef } from "react";

type City = {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
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

/** Real-world-ish city belts: lon/lat in radians */
const REGIONS: { lon: number; lat: number; spreadLon: number; spreadLat: number; count: number; size: number }[] = [
  // Europe dense web
  { lon: 0.2, lat: 0.9, spreadLon: 0.7, spreadLat: 0.35, count: 110, size: 1.1 },
  // UK / west Europe
  { lon: -0.05, lat: 0.92, spreadLon: 0.25, spreadLat: 0.2, count: 35, size: 1.0 },
  // Nile corridor
  { lon: 0.55, lat: 0.45, spreadLon: 0.08, spreadLat: 0.55, count: 40, size: 1.0 },
  // Middle East
  { lon: 0.8, lat: 0.5, spreadLon: 0.45, spreadLat: 0.3, count: 45, size: 0.95 },
  // India
  { lon: 1.35, lat: 0.4, spreadLon: 0.35, spreadLat: 0.4, count: 55, size: 1.0 },
  // East Asia
  { lon: 2.0, lat: 0.6, spreadLon: 0.45, spreadLat: 0.35, count: 70, size: 1.15 },
  // Japan
  { lon: 2.4, lat: 0.65, spreadLon: 0.18, spreadLat: 0.2, count: 28, size: 1.05 },
  // SE Asia
  { lon: 1.85, lat: 0.15, spreadLon: 0.35, spreadLat: 0.25, count: 30, size: 0.9 },
  // Russia belt
  { lon: 1.0, lat: 1.0, spreadLon: 1.2, spreadLat: 0.2, count: 40, size: 0.85 },
  // N America east
  { lon: -1.3, lat: 0.7, spreadLon: 0.45, spreadLat: 0.35, count: 70, size: 1.05 },
  // N America west
  { lon: -2.1, lat: 0.65, spreadLon: 0.25, spreadLat: 0.3, count: 35, size: 1.0 },
  // S America
  { lon: -0.9, lat: -0.35, spreadLon: 0.35, spreadLat: 0.55, count: 40, size: 0.9 },
  // Australia
  { lon: 2.4, lat: -0.55, spreadLon: 0.4, spreadLat: 0.25, count: 25, size: 0.9 },
  // S Africa
  { lon: 0.5, lat: -0.5, spreadLon: 0.25, spreadLat: 0.2, count: 18, size: 0.85 },
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

  for (const region of REGIONS) {
    for (let n = 0; n < region.count; n += 1) {
      // Cluster toward region center
      const t = Math.pow(Math.random(), 1.35);
      const ang = Math.random() * Math.PI * 2;
      const lon = region.lon + Math.cos(ang) * region.spreadLon * t * 0.5;
      const lat = region.lat + Math.sin(ang) * region.spreadLat * t * 0.5;
      const p = lonLatToXYZ(lon, lat);
      cities.push({
        x: p.x,
        y: p.y,
        z: p.z,
        size: region.size * (0.55 + Math.random() * 1.1),
        brightness: 0.55 + Math.random() * 0.45,
        links: [],
      });
    }
  }

  // Links to nearby cities only (thin network)
  for (let a = 0; a < cities.length; a += 1) {
    const near: { i: number; d: number }[] = [];
    for (let b = 0; b < cities.length; b += 1) {
      if (a === b) continue;
      const dx = cities[a].x - cities[b].x;
      const dy = cities[a].y - cities[b].y;
      const dz = cities[a].z - cities[b].z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < 0.028) near.push({ i: b, d });
    }
    near.sort((p, q) => p.d - q.d);
    cities[a].links = near.slice(0, 3).map((item) => item.i);
  }

  return cities;
}

function seedStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.1 + 0.15,
    a: 0.1 + Math.random() * 0.4,
  }));
}

function rotateY(x: number, y: number, z: number, angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: x * c + z * s, y, z: -x * s + z * c };
}

function rotateX(x: number, y: number, z: number, angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x, y: y * c - z * s, z: y * s + z * c };
}

function drawLand(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  rotY: number,
  rotX: number
) {
  const lands = [
    { lon: 0.25, lat: 0.9, rx: 0.38, ry: 0.22, color: "#1a2a22" }, // Europe
    { lon: 0.5, lat: 0.25, rx: 0.4, ry: 0.55, color: "#1c281f" }, // Africa
    { lon: 1.5, lat: 0.55, rx: 0.55, ry: 0.4, color: "#1a2720" }, // Asia
    { lon: 2.35, lat: -0.5, rx: 0.28, ry: 0.2, color: "#1b2921" }, // Australia
    { lon: -1.35, lat: 0.7, rx: 0.45, ry: 0.32, color: "#1a2720" }, // N America
    { lon: -0.95, lat: -0.25, rx: 0.28, ry: 0.48, color: "#1c2a21" }, // S America
    { lon: 0.1, lat: -1.15, rx: 0.4, ry: 0.14, color: "#2a3038" }, // Antarctica
  ];

  for (const land of lands) {
    let p = lonLatToXYZ(land.lon, land.lat);
    p = rotateY(p.x, p.y, p.z, rotY);
    p = rotateX(p.x, p.y, p.z, rotX);
    if (p.z < 0.02) continue;
    const persp = 1 / (1.15 - p.z * 0.35);
    const sx = cx + p.x * radius * persp;
    const sy = cy + p.y * radius * persp;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(rotY * 0.2);
    ctx.globalAlpha = 0.55 + p.z * 0.35;
    ctx.fillStyle = land.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * land.rx * persp, radius * land.ry * persp, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(
      radius * land.rx * 0.25 * persp,
      radius * land.ry * 0.1 * persp,
      radius * land.rx * 0.4 * persp,
      radius * land.ry * 0.3 * persp,
      0.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }
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

    const pointer = { x: 0.5, y: 0.55, active: false };
    const follow = { x: 0.5, y: 0.55 };
    let rotation = 0.35; // start facing Europe/Africa-ish
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
      stars = seedStars(Math.floor((w * h) / 11000), w, h);
    };

    const draw = () => {
      time += 0.016;
      // Slow continuous spin
      rotation += 0.00115;
      follow.x += ((pointer.active ? pointer.x : 0.5) - follow.x) * 0.2;
      follow.y += ((pointer.active ? pointer.y : 0.55) - follow.y) * 0.2;

      ctx.clearRect(0, 0, w, h);

      // Deep space — mostly black like reference
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      for (const star of stars) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${star.a * (0.75 + Math.sin(time + star.x) * 0.25)})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const radius = Math.min(w, h) * (w < 640 ? 0.44 : 0.42);
      const cx = w * 0.5;
      const cy = h * 0.56;
      const tiltX = -0.18 + (follow.y - 0.5) * 0.25;
      const rotY = rotation + (follow.x - 0.5) * 0.55;

      // Thin luminous blue atmosphere crescent (left limb like reference)
      const atmos = ctx.createRadialGradient(
        cx - radius * 0.55,
        cy - radius * 0.1,
        radius * 0.7,
        cx,
        cy,
        radius * 1.18
      );
      atmos.addColorStop(0, "rgba(90,170,255,0)");
      atmos.addColorStop(0.72, "rgba(90,170,255,0)");
      atmos.addColorStop(0.88, "rgba(110,190,255,0.35)");
      atmos.addColorStop(0.96, "rgba(140,210,255,0.15)");
      atmos.addColorStop(1, "rgba(100,180,255,0)");
      ctx.fillStyle = atmos;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.16, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // Night ocean / planet fill
      const body = ctx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.2,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      body.addColorStop(0, "#0d1b33");
      body.addColorStop(0.45, "#07101f");
      body.addColorStop(0.8, "#040914");
      body.addColorStop(1, "#02050c");
      ctx.fillStyle = body;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      drawLand(ctx, cx, cy, radius, rotY, tiltX);

      // Soft limb lighting on left
      const limb = ctx.createLinearGradient(cx - radius, cy, cx + radius * 0.2, cy);
      limb.addColorStop(0, "rgba(70,140,220,0.22)");
      limb.addColorStop(0.25, "rgba(40,90,160,0.08)");
      limb.addColorStop(0.55, "rgba(0,0,0,0)");
      ctx.fillStyle = limb;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      const px = follow.x * w;
      const py = follow.y * h;
      const projected: Projected[] = [];
      const byIndex = new Map<number, Projected>();

      for (let i = 0; i < cities.length; i += 1) {
        const city = cities[i];
        let p = rotateY(city.x, city.y, city.z, rotY);
        p = rotateX(p.x, p.y, p.z, tiltX);
        if (p.z < 0.06) {
          glow[i] *= 0.88;
          continue;
        }

        const persp = 1 / (1.12 - p.z * 0.38);
        const sx = cx + p.x * radius * 0.94 * persp;
        const sy = cy + p.y * radius * 0.94 * persp;

        // Always-visible night city texture (like the photo)
        const ambient = city.brightness * (0.35 + p.z * 0.35);

        const dist = Math.hypot(px - sx, py - sy);
        const influence = pointer.active
          ? Math.max(0, 1 - dist / (radius * 0.36)) ** 1.2
          : 0;
        const target = ambient + influence * 1.25;
        glow[i] += (target - glow[i]) * 0.22;

        if (glow[i] < 0.08) continue;

        const node: Projected = {
          i,
          sx,
          sy,
          z: p.z,
          glow: glow[i],
          size: city.size * persp * (0.65 + glow[i] * 0.9),
        };
        projected.push(node);
        byIndex.set(i, node);
      }

      // Thin connection lines only when cursor activates nearby lights
      ctx.lineCap = "round";
      if (pointer.active) {
        for (const node of projected) {
          if (node.glow < 0.55) continue;
          for (const link of cities[node.i].links) {
            if (link <= node.i) continue;
            const other = byIndex.get(link);
            if (!other || other.glow < 0.55) continue;
            const strength = Math.min(node.glow, other.glow);
            if (strength < 0.6) continue;

            ctx.beginPath();
            ctx.moveTo(node.sx, node.sy);
            ctx.lineTo(other.sx, other.sy);
            ctx.strokeStyle = `rgba(255, 210, 90, ${0.12 + (strength - 0.55) * 0.55})`;
            ctx.lineWidth = 0.45 + (strength - 0.55) * 1.1;
            ctx.stroke();
          }
        }
      }

      // Yellow / warm city lights
      for (const node of projected) {
        const alpha = Math.min(1, node.glow * (0.45 + node.z * 0.55));
        const isHot = node.glow > 0.55 && pointer.active;

        const light = ctx.createRadialGradient(
          node.sx,
          node.sy,
          0,
          node.sx,
          node.sy,
          node.size * (isHot ? 4.2 : 2.8)
        );
        light.addColorStop(0, `rgba(255, 230, 140, ${alpha * (isHot ? 0.95 : 0.55)})`);
        light.addColorStop(0.4, `rgba(255, 180, 50, ${alpha * (isHot ? 0.35 : 0.18)})`);
        light.addColorStop(1, "rgba(255, 140, 20, 0)");
        ctx.fillStyle = light;
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, node.size * (isHot ? 4.2 : 2.8), 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 240, 180, ${Math.min(1, alpha * (isHot ? 1.3 : 0.85))})`;
        ctx.arc(node.sx, node.sy, Math.max(0.45, node.size * 0.35), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Sharp planet edge + thin blue halo ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(120,190,255,0.22)";
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Soft bottom fade into UI
      const fade = ctx.createLinearGradient(0, h * 0.82, 0, h);
      fade.addColorStop(0, "rgba(0,0,0,0)");
      fade.addColorStop(1, "rgba(0,0,0,0.65)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, h * 0.82, w, h * 0.18);

      raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
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
