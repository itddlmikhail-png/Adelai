"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type City = {
  size: number;
  links: number[];
  pos: THREE.Vector3;
};

const BASE =
  typeof window !== "undefined" && window.location.pathname.startsWith("/Adelai")
    ? "/Adelai"
    : "";

const REGIONS = [
  { lon: 15, lat: 50, spreadLon: 28, spreadLat: 16, count: 180 }, // Europe
  { lon: 5, lat: 48, spreadLon: 18, spreadLat: 12, count: 70 }, // West Europe
  { lon: 30, lat: 28, spreadLon: 6, spreadLat: 22, count: 55 }, // Nile
  { lon: 45, lat: 28, spreadLon: 22, spreadLat: 14, count: 70 }, // Middle East
  { lon: 78, lat: 22, spreadLon: 18, spreadLat: 18, count: 90 }, // India
  { lon: 115, lat: 32, spreadLon: 24, spreadLat: 18, count: 110 }, // China
  { lon: 138, lat: 36, spreadLon: 10, spreadLat: 10, count: 45 }, // Japan
  { lon: 105, lat: 12, spreadLon: 16, spreadLat: 12, count: 40 }, // SE Asia
  { lon: -75, lat: 40, spreadLon: 28, spreadLat: 18, count: 110 }, // US East
  { lon: -95, lat: 35, spreadLon: 18, spreadLat: 14, count: 50 }, // US Central
  { lon: -120, lat: 38, spreadLon: 14, spreadLat: 16, count: 55 }, // US West
  { lon: -50, lat: -15, spreadLon: 18, spreadLat: 28, count: 60 }, // Brazil
  { lon: -70, lat: -30, spreadLon: 12, spreadLat: 16, count: 30 }, // Argentina/Chile
  { lon: 135, lat: -28, spreadLon: 22, spreadLat: 14, count: 36 }, // Australia
  { lon: 28, lat: -28, spreadLon: 12, spreadLat: 10, count: 24 }, // S Africa
  { lon: 55, lat: 55, spreadLon: 45, spreadLat: 12, count: 55 }, // Russia
  { lon: -100, lat: 22, spreadLon: 14, spreadLat: 10, count: 28 }, // Mexico
  { lon: 3, lat: 8, spreadLon: 16, spreadLat: 10, count: 30 }, // W Africa coast
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
        size: 0.7 + Math.random() * 1.4,
        links: [],
        pos: degToVec(lon, lat, 1.012),
      });
    }
  }

  for (let a = 0; a < cities.length; a += 1) {
    const near: { i: number; d: number }[] = [];
    for (let b = 0; b < cities.length; b += 1) {
      if (a === b) continue;
      const d = cities[a].pos.distanceToSquared(cities[b].pos);
      if (d < 0.014) near.push({ i: b, d });
    }
    near.sort((p, q) => p.d - q.d);
    cities[a].links = near.slice(0, 4).map((n) => n.i);
  }
  return cities;
}

/** Keep the whole globe (with atmosphere) inside the viewport */
function fitCameraDistance(camera: THREE.PerspectiveCamera, radius = 1.14) {
  const vFov = (camera.fov * Math.PI) / 180;
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
  const distV = radius / Math.tan(vFov / 2);
  const distH = radius / Math.tan(hFov / 2);
  return Math.max(distV, distH) * 1.06;
}

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
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
    const birth = new Float32Array(cities.length);
    for (let i = 0; i < cities.length; i += 1) {
      birth[i] = Math.random() * 1.6;
    }
    const pointer = { x: 0.5, y: 0.5, active: false };
    const follow = { x: 0.5, y: 0.5 };
    let baseZ = 3.6;
    let spinY = 0.12;
    let yawFollow = 0;
    let raf = 0;
    let disposed = false;
    let elapsed = 0;
    let last = performance.now();
    let viewW = 1;
    let viewH = 1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, baseZ);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(0x000000, 1);
    wrap.insertBefore(renderer.domElement, overlay);
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
    });

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    {
      const starGeo = new THREE.BufferGeometry();
      const starCount = 700;
      const positions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i += 1) {
        const r = 10 + Math.random() * 24;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
      }
      starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      scene.add(
        new THREE.Points(
          starGeo,
          new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.028,
            sizeAttenuation: true,
            opacity: 0.65,
            transparent: true,
          })
        )
      );
    }

    const textureLoader = new THREE.TextureLoader();
    const earthTex = textureLoader.load(`${BASE}/earth-day.jpg`);
    earthTex.colorSpace = THREE.SRGBColorSpace;
    earthTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    earthTex.minFilter = THREE.LinearMipmapLinearFilter;
    earthTex.magFilter = THREE.LinearFilter;
    earthTex.generateMipmaps = true;

    // Soft key light from the sun — natural day Earth shading
    const sunDir = new THREE.Vector3(1.15, 0.35, 0.85).normalize();

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 256, 256),
      new THREE.ShaderMaterial({
        uniforms: {
          map: { value: earthTex },
          sunDirection: { value: sunDir },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormalW;
          varying vec3 vPosW;
          void main() {
            vUv = uv;
            vec4 world = modelMatrix * vec4(position, 1.0);
            vPosW = world.xyz;
            vNormalW = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          uniform sampler2D map;
          uniform vec3 sunDirection;
          varying vec2 vUv;
          varying vec3 vNormalW;
          varying vec3 vPosW;

          void main() {
            vec3 albedo = texture2D(map, vUv).rgb;

            // Keep NASA true-color look — light natural lift only
            albedo = pow(max(albedo, 0.0), vec3(0.96));

            vec3 N = normalize(vNormalW);
            float ndl = max(dot(N, normalize(sunDirection)), 0.0);

            // Soft daylight wrap — no harsh night side
            float diffuse = mix(0.42, 1.0, ndl);
            float hemi = 0.55 + 0.45 * N.y;

            vec3 color = albedo * diffuse * (0.88 + 0.12 * hemi);

            // Subtle specular sheen on oceans
            vec3 V = normalize(cameraPosition - vPosW);
            vec3 H = normalize(normalize(sunDirection) + V);
            float ocean = smoothstep(0.18, 0.42, albedo.b - albedo.r);
            float spec = pow(max(dot(N, H), 0.0), 48.0) * ocean * 0.28;
            color += vec3(0.85, 0.92, 1.0) * spec;

            gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
          }
        `,
      })
    );
    globeGroup.add(earth);

    // Soft outer atmosphere bloom — sky blue
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.065, 128, 128),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: { glowColor: { value: new THREE.Color(0x5eb0ff) } },
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
            float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
            gl_FragColor = vec4(glowColor, 1.0) * intensity * 1.25;
          }
        `,
      })
    );
    globeGroup.add(atmosphere);

    // Crisp limb / contour fresnel
    const rim = new THREE.Mesh(
      new THREE.SphereGeometry(1.008, 256, 256),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          rimColor: { value: new THREE.Color(0x9fd4ff) },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorldPos = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          uniform vec3 rimColor;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 3.2);
            float edge = smoothstep(0.15, 0.85, fresnel);
            gl_FragColor = vec4(rimColor, edge * 0.88);
          }
        `,
      })
    );
    globeGroup.add(rim);

    globeGroup.rotation.y = 0.12;
    globeGroup.rotation.x = 0.12;

    const worldPos = new THREE.Vector3();
    const projected = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const viewDir = new THREE.Vector3();

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      viewW = Math.max(rect.width, 1);
      viewH = Math.max(rect.height, 1);
      camera.aspect = viewW / viewH;
      camera.updateProjectionMatrix();
      baseZ = fitCameraDistance(camera, 1.45);
      camera.position.z = baseZ;
      renderer.setSize(viewW, viewH, false);
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      overlay.width = Math.floor(viewW * dpr);
      overlay.height = Math.floor(viewH * dpr);
      overlay.style.width = `${viewW}px`;
      overlay.style.height = `${viewH}px`;
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawOverlay = (dt: number) => {
      const w = viewW;
      const h = viewH;
      octx.clearRect(0, 0, w, h);

      const px = follow.x * w;
      const py = follow.y * h;

      type Node = { i: number; sx: number; sy: number; glow: number; size: number };
      const nodes: Node[] = [];
      const byIndex = new Map<number, Node>();

      for (let i = 0; i < cities.length; i += 1) {
        worldPos.copy(cities[i].pos).applyMatrix4(earth.matrixWorld);
        normal.copy(worldPos).normalize();
        viewDir.copy(camera.position).sub(worldPos).normalize();
        if (normal.dot(viewDir) < 0.08) {
          glow[i] = damp(glow[i], 0, 8, dt);
          continue;
        }

        projected.copy(worldPos).project(camera);
        if (projected.z > 1) continue;
        const sx = (projected.x * 0.5 + 0.5) * w;
        const sy = (-projected.y * 0.5 + 0.5) * h;
        if (sx < -30 || sy < -30 || sx > w + 30 || sy > h + 30) continue;

        const appear =
          elapsed > birth[i]
            ? easeOutCubic(Math.min(1, (elapsed - birth[i]) / 1.25))
            : 0;
        if (appear <= 0.01) continue;

        const dist = Math.hypot(px - sx, py - sy);
        const radiusPx = Math.min(w, h) * 0.42;
        const influence = pointer.active
          ? Math.max(0, 1 - dist / (radiusPx * 0.42)) ** 1.05
          : 0;
        const ambient = 0.16 + (cities[i].size % 1) * 0.12;
        const target = (ambient + influence * 1.2) * appear;
        glow[i] = damp(glow[i], target, 12, dt);
        if (glow[i] < 0.05) continue;

        const node = {
          i,
          sx,
          sy,
          glow: glow[i],
          size: cities[i].size * (0.55 + glow[i] * 0.9) * (0.6 + 0.4 * appear),
        };
        nodes.push(node);
        byIndex.set(i, node);
      }

      if (pointer.active) {
        octx.lineCap = "round";
        for (const node of nodes) {
          if (node.glow < 0.38) continue;
          for (const link of cities[node.i].links) {
            if (link <= node.i) continue;
            const other = byIndex.get(link);
            if (!other || other.glow < 0.38) continue;
            const strength = Math.min(node.glow, other.glow);
            octx.beginPath();
            octx.moveTo(node.sx, node.sy);
            octx.lineTo(other.sx, other.sy);
            octx.strokeStyle = `rgba(255, 195, 70, ${0.12 + strength * 0.52})`;
            octx.lineWidth = 0.45 + strength * 0.9;
            octx.stroke();
          }
        }
      }

      for (const node of nodes) {
        const a = node.glow;
        const hot = a > 0.45;
        const bloomR = node.size * (hot ? 4.8 : 2.6);
        const g = octx.createRadialGradient(
          node.sx,
          node.sy,
          0,
          node.sx,
          node.sy,
          bloomR
        );
        g.addColorStop(0, `rgba(255, 220, 120, ${a * (hot ? 1 : 0.62)})`);
        g.addColorStop(0.35, `rgba(255, 170, 35, ${a * (hot ? 0.38 : 0.18)})`);
        g.addColorStop(1, "rgba(255, 100, 20, 0)");
        octx.fillStyle = g;
        octx.beginPath();
        octx.arc(node.sx, node.sy, bloomR, 0, Math.PI * 2);
        octx.fill();

        octx.beginPath();
        octx.fillStyle = `rgba(255, 248, 210, ${Math.min(1, a * (hot ? 1.25 : 0.82))})`;
        octx.arc(node.sx, node.sy, Math.max(0.45, node.size * 0.28), 0, Math.PI * 2);
        octx.fill();
      }
    };

    const animate = (now: number) => {
      if (disposed) return;

      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      if (dt < 0) dt = 0;
      elapsed += dt;

      // Soft cursor tracking — inertia for a cinematic feel
      const aimX = pointer.active ? pointer.x : 0.5;
      const aimY = pointer.active ? pointer.y : 0.5;
      follow.x = damp(follow.x, aimX, 4.2, dt);
      follow.y = damp(follow.y, aimY, 4.2, dt);

      const nx = follow.x - 0.5;
      const ny = follow.y - 0.5;
      // Ease response toward edges for a richer arc
      const sx = Math.sign(nx) * Math.pow(Math.abs(nx) * 2, 1.15) * 0.5;
      const sy = Math.sign(ny) * Math.pow(Math.abs(ny) * 2, 1.15) * 0.5;

      spinY += 0.055 * dt;

      // Strong camera orbit with the cursor
      const parallaxX = sx * 1.55;
      const parallaxY = -sy * 1.15;
      camera.position.x = damp(camera.position.x, parallaxX, 3.8, dt);
      camera.position.y = damp(camera.position.y, parallaxY, 3.8, dt);
      camera.position.z = damp(camera.position.z, baseZ, 3.8, dt);
      camera.lookAt(0, 0, 0);

      // Deep planet tilt — layered, slower than camera for depth
      const tiltTarget = sy * 1.05;
      globeGroup.rotation.x = damp(globeGroup.rotation.x, tiltTarget, 3.2, dt);
      const yawTarget = sx * 1.25;
      yawFollow = damp(yawFollow, yawTarget, 3.2, dt);
      globeGroup.rotation.y = spinY + yawFollow;
      globeGroup.rotation.z = damp(globeGroup.rotation.z, -sx * 0.28, 2.8, dt);

      renderer.render(scene, camera);
      drawOverlay(dt);
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
    last = performance.now();
    raf = requestAnimationFrame(animate);
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
