"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type City = {
  lon: number;
  lat: number;
  size: number;
  links: number[];
  pos: THREE.Vector3;
};

const BASE =
  typeof window !== "undefined" && window.location.pathname.startsWith("/Adelai")
    ? "/Adelai"
    : "";

const REGIONS = [
  { lon: 15, lat: 50, spreadLon: 28, spreadLat: 16, count: 90 }, // Europe
  { lon: 30, lat: 28, spreadLon: 6, spreadLat: 22, count: 28 }, // Nile
  { lon: 45, lat: 28, spreadLon: 22, spreadLat: 14, count: 35 }, // Middle East
  { lon: 78, lat: 22, spreadLon: 18, spreadLat: 18, count: 45 }, // India
  { lon: 115, lat: 32, spreadLon: 24, spreadLat: 18, count: 55 }, // China
  { lon: 138, lat: 36, spreadLon: 10, spreadLat: 10, count: 22 }, // Japan
  { lon: -75, lat: 40, spreadLon: 28, spreadLat: 18, count: 55 }, // US East
  { lon: -120, lat: 38, spreadLon: 14, spreadLat: 16, count: 28 }, // US West
  { lon: -50, lat: -15, spreadLon: 18, spreadLat: 28, count: 30 }, // Brazil
  { lon: 135, lat: -28, spreadLon: 22, spreadLat: 14, count: 18 }, // Australia
  { lon: 28, lat: -28, spreadLon: 12, spreadLat: 10, count: 12 }, // S Africa
  { lon: 55, lat: 55, spreadLon: 40, spreadLat: 10, count: 25 }, // Russia
];

function degToVec(lon: number, lat: number, radius = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function seedCities(): City[] {
  const cities: City[] = [];
  for (const region of REGIONS) {
    for (let i = 0; i < region.count; i += 1) {
      const t = Math.pow(Math.random(), 1.4);
      const a = Math.random() * Math.PI * 2;
      const lon = region.lon + Math.cos(a) * region.spreadLon * t * 0.5;
      const lat = region.lat + Math.sin(a) * region.spreadLat * t * 0.5;
      cities.push({
        lon,
        lat,
        size: 0.7 + Math.random() * 1.4,
        links: [],
        pos: degToVec(lon, lat, 1.01),
      });
    }
  }

  for (let a = 0; a < cities.length; a += 1) {
    const near: { i: number; d: number }[] = [];
    for (let b = 0; b < cities.length; b += 1) {
      if (a === b) continue;
      const d = cities[a].pos.distanceToSquared(cities[b].pos);
      if (d < 0.02) near.push({ i: b, d });
    }
    near.sort((p, q) => p.d - q.d);
    cities[a].links = near.slice(0, 3).map((n) => n.i);
  }
  return cities;
}

export function NightPlanet() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const overlay = overlayRef.current;
    if (!wrap || !overlay) return;

    const octx = overlay.getContext("2d");
    if (!octx) return;

    const cities = seedCities();
    const glow = new Float32Array(cities.length);
    const pointer = { x: 0.5, y: 0.55, active: false };
    const follow = { x: 0.5, y: 0.55 };
    let raf = 0;
    let disposed = false;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 3.35;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 1);
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Soft stars
    {
      const starGeo = new THREE.BufferGeometry();
      const starCount = 900;
      const positions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i += 1) {
        const r = 8 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
      }
      starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const stars = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, sizeAttenuation: true, opacity: 0.7, transparent: true })
      );
      scene.add(stars);
    }

    const textureLoader = new THREE.TextureLoader();
    const earthTex = textureLoader.load(`${BASE}/earth-night.jpg`);
    earthTex.colorSpace = THREE.SRGBColorSpace;

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 96),
      new THREE.MeshBasicMaterial({ map: earthTex })
    );
    globeGroup.add(earth);

    // Atmosphere glow shell
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.045, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        uniforms: {
          glowColor: { value: new THREE.Color(0x6eb6ff) },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 glowColor;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
            gl_FragColor = vec4(glowColor, intensity * 0.85);
          }
        `,
      })
    );
    globeGroup.add(atmosphere);

    // Thin rim ring feel via slightly larger additive shell
    const rim = new THREE.Mesh(
      new THREE.SphereGeometry(1.02, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x89c4ff,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    globeGroup.add(rim);

    // Start facing Europe / Africa like the reference
    globeGroup.rotation.y = 0.15;
    globeGroup.rotation.x = 0.18;

    const worldPos = new THREE.Vector3();
    const projected = new THREE.Vector3();

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      overlay.width = Math.floor(w * dpr);
      overlay.height = Math.floor(h * dpr);
      overlay.style.width = `${w}px`;
      overlay.style.height = `${h}px`;
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawOverlay = () => {
      const rect = wrap.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      octx.clearRect(0, 0, w, h);

      follow.x += ((pointer.active ? pointer.x : 0.5) - follow.x) * 0.2;
      follow.y += ((pointer.active ? pointer.y : 0.55) - follow.y) * 0.2;

      const px = follow.x * w;
      const py = follow.y * h;

      type Node = { i: number; sx: number; sy: number; glow: number; size: number; visible: boolean };
      const nodes: Node[] = [];
      const byIndex = new Map<number, Node>();

      for (let i = 0; i < cities.length; i += 1) {
        worldPos.copy(cities[i].pos);
        worldPos.applyMatrix4(earth.matrixWorld);
        const normal = worldPos.clone().normalize();
        const viewDir = camera.position.clone().sub(worldPos).normalize();
        if (normal.dot(viewDir) < 0.06) {
          glow[i] *= 0.9;
          continue;
        }

        projected.copy(worldPos).project(camera);
        if (projected.z > 1) continue;
        const sx = (projected.x * 0.5 + 0.5) * w;
        const sy = (-projected.y * 0.5 + 0.5) * h;
        if (sx < -20 || sy < -20 || sx > w + 20 || sy > h + 20) continue;

        const dist = Math.hypot(px - sx, py - sy);
        const influence = pointer.active
          ? Math.max(0, 1 - dist / (Math.min(w, h) * 0.16)) ** 1.15
          : 0;
        const target = influence * 1.2;
        glow[i] += (target - glow[i]) * 0.24;
        if (glow[i] < 0.05) continue;

        const node = {
          i,
          sx,
          sy,
          glow: glow[i],
          size: cities[i].size * (0.7 + glow[i]),
          visible: true,
        };
        nodes.push(node);
        byIndex.set(i, node);
      }

      // Thin yellow links
      if (pointer.active) {
        octx.lineCap = "round";
        for (const node of nodes) {
          if (node.glow < 0.45) continue;
          for (const link of cities[node.i].links) {
            if (link <= node.i) continue;
            const other = byIndex.get(link);
            if (!other || other.glow < 0.45) continue;
            const strength = Math.min(node.glow, other.glow);
            octx.beginPath();
            octx.moveTo(node.sx, node.sy);
            octx.lineTo(other.sx, other.sy);
            octx.strokeStyle = `rgba(255, 210, 90, ${0.15 + strength * 0.45})`;
            octx.lineWidth = 0.5 + strength * 0.9;
            octx.stroke();
          }
        }
      }

      // Cursor-lit yellow sparks
      for (const node of nodes) {
        const a = node.glow;
        const g = octx.createRadialGradient(node.sx, node.sy, 0, node.sx, node.sy, node.size * 4);
        g.addColorStop(0, `rgba(255, 230, 140, ${a * 0.95})`);
        g.addColorStop(0.4, `rgba(255, 180, 40, ${a * 0.3})`);
        g.addColorStop(1, "rgba(255, 140, 0, 0)");
        octx.fillStyle = g;
        octx.beginPath();
        octx.arc(node.sx, node.sy, node.size * 4, 0, Math.PI * 2);
        octx.fill();

        octx.beginPath();
        octx.fillStyle = `rgba(255, 245, 190, ${Math.min(1, a)})`;
        octx.arc(node.sx, node.sy, Math.max(0.6, node.size * 0.35), 0, Math.PI * 2);
        octx.fill();
      }
    };

    const animate = () => {
      if (disposed) return;
      // Slow spin + subtle cursor follow tilt
      globeGroup.rotation.y += 0.00105;
      const targetX = 0.18 + (follow.y - 0.5) * 0.2;
      const targetZ = (follow.x - 0.5) * -0.12;
      globeGroup.rotation.x += (targetX - globeGroup.rotation.x) * 0.06;
      globeGroup.rotation.z += (targetZ - globeGroup.rotation.z) * 0.06;

      renderer.render(scene, camera);
      drawOverlay();
      raf = requestAnimationFrame(animate);
    };

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = (e.clientY - rect.top) / rect.height;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    animate();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onMove, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onMove);
      earthTex.dispose();
      earth.geometry.dispose();
      (earth.material as THREE.Material).dispose();
      atmosphere.geometry.dispose();
      (atmosphere.material as THREE.Material).dispose();
      rim.geometry.dispose();
      (rim.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === wrap) {
        wrap.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 z-0 touch-none bg-black">
      <canvas
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        aria-hidden
      />
    </div>
  );
}
