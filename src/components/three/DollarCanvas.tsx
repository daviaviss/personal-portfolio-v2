"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* Design-system colors (globals.css) */
const SIENNA_500 = new THREE.Color(0xd96a3a); // --accent
const SIENNA_400 = new THREE.Color(0xe8885a); // --accent-hover
const INK_500 = new THREE.Color(0x8a7a66); // --fg-3 (gray, like the bg field)

const CONTAINER_MAX = 1080; // hero content container width
const FOV = 50;
const CAM_Z = 4.2;
const DOLLAR_HALF_W = 0.62; // half width of the "$" in world units

/**
 * Path of a "$": a symmetric S (two tangent arcs) plus a vertical bar that runs
 * through it. The two loops meet at the origin, both crossing it heading +x,
 * exactly like the waist of a hand-drawn S.
 */
function buildDollarCurves() {
  const r = 0.55;
  const deg = Math.PI / 180;
  const seg = 64;

  const sPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const a = (-30 + (300 * i) / seg) * deg; // top circle: -30 -> 270
    sPoints.push(new THREE.Vector3(r * Math.cos(a), r + r * Math.sin(a), 0));
  }
  for (let i = 1; i <= seg; i++) {
    const a = (90 - (300 * i) / seg) * deg; // bottom circle: 90 -> -210
    sPoints.push(new THREE.Vector3(r * Math.cos(a), -r + r * Math.sin(a), 0));
  }
  const sCurve = new THREE.CatmullRomCurve3(sPoints, false, "centripetal");

  const barCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, -0.5, 0),
      new THREE.Vector3(0, -1.5, 0),
    ],
    false,
    "catmullrom",
  );

  return { sCurve, barCurve };
}

export function DollarCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* ---- scene / camera / renderer ---- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      FOV,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.z = CAM_Z;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Half-extents of the visible world at z = 0.
    const halfH = Math.tan((FOV * Math.PI) / 360) * CAM_Z;
    const viewHalfW = () => halfH * (mount.clientWidth / mount.clientHeight);

    // World-space X where the "$" should sit: aligned to the container's right
    // edge, then nudged a touch further right per the design.
    const dollarX = () => {
      const vw = mount.clientWidth;
      const containerHalfPx = Math.min(vw, CONTAINER_MAX) / 2;
      const padPx = Math.min(Math.max(24, vw * 0.05), 48);
      const rightEdgePx = containerHalfPx - padPx;
      const worldRight = (rightEdgePx / (vw / 2)) * viewHalfW();
      return worldRight - DOLLAR_HALF_W; // +nudge = a bit more right
    };

    /* ---- sample target points along the "$" ---- */
    const { sCurve, barCurve } = buildDollarCurves();
    const COUNT = 3800;
    const S_COUNT = Math.round(COUNT * 0.7);

    const targets = new Float32Array(COUNT * 3);
    const starts = new Float32Array(COUNT * 3);
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const delays = new Float32Array(COUNT); // staggered arrival [0, 0.4]
    const seeds = new Float32Array(COUNT); // per-particle idle phase

    // Place the symbol; the group is translated so targets stay centered on the
    // "$" (clean idle rotation) while starts can fill the whole background.
    const gx = dollarX();
    group.position.x = gx;

    // Radius that comfortably clears the visible area — starts live beyond it,
    // so every particle flies in from off-screen.
    const viewRadius = Math.sqrt(viewHalfW() ** 2 + halfH ** 2);
    const tmp = new THREE.Vector3();
    const c = new THREE.Color();

    for (let i = 0; i < COUNT; i++) {
      const onS = i < S_COUNT;
      const curve = onS ? sCurve : barCurve;
      curve.getPointAt(Math.random(), tmp);

      // Thicken the stroke into a tube of particles with a small random offset.
      const radius = onS ? 0.075 : 0.06;
      targets[i * 3 + 0] = tmp.x + (Math.random() - 0.5) * 2 * radius;
      targets[i * 3 + 1] = tmp.y + (Math.random() - 0.5) * 2 * radius;
      targets[i * 3 + 2] = tmp.z + (Math.random() - 0.5) * 2 * radius;

      // Start off-screen: a random point on a ring beyond the visible edges, so
      // particles stream in from outside the screen. Stored in the group's local
      // space, so we subtract the group offset (gx) on x.
      const ang = Math.random() * Math.PI * 2;
      const rad = viewRadius * (1.15 + Math.random() * 0.9); // 1.15x .. 2.05x
      starts[i * 3 + 0] = Math.cos(ang) * rad - gx;
      starts[i * 3 + 1] = Math.sin(ang) * rad;
      starts[i * 3 + 2] = (Math.random() - 0.5) * 4;

      const src = prefersReduced ? targets : starts;
      positions[i * 3 + 0] = src[i * 3 + 0];
      positions[i * 3 + 1] = src[i * 3 + 1];
      positions[i * 3 + 2] = src[i * 3 + 2];

      // Mostly warm sienna, with a sprinkle of gray highlights (like the bg).
      const roll = Math.random();
      if (roll > 0.85) c.copy(INK_500);
      else if (roll > 0.55) c.copy(SIENNA_400);
      else c.copy(SIENNA_500);
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      delays[i] = Math.random() * 0.4;
      seeds[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", posAttr);
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Square particles, matching the hero background field (no sprite/glow).
    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);

    /* ---- mouse parallax ---- */
    let mouseX = 0;
    let mouseY = 0;
    let parX = 0;
    let parY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };
    if (!prefersReduced) window.addEventListener("mousemove", onMouseMove);

    /* ---- resize ---- */
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      group.position.x = dollarX(); // keep the "$" pinned to the container edge
    };
    const resizeObs = new ResizeObserver(onResize);
    resizeObs.observe(mount);

    /* ---- animation ---- */
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const FORM_DELAY = 0.3; // s — let the hero text settle first
    const FORM_DURATION = 5.4; // s — gather + transform into the "$"
    const SPAN = 1 - 0.4; // remaining timeline after max per-particle delay

    const timer = new THREE.Timer();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      timer.update();
      const elapsed = timer.getElapsed();

      const p = prefersReduced
        ? 1
        : THREE.MathUtils.clamp((elapsed - FORM_DELAY) / FORM_DURATION, 0, 1);

      material.opacity = Math.min(0.9, p * 3.5);

      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const lt = THREE.MathUtils.clamp((p - delays[i]) / SPAN, 0, 1);
        const e = easeOut(lt);
        const ix = i * 3;

        // Gentle idle drift, eased in as each particle settles onto the "$".
        const ph = seeds[i];
        const drift = 0.025 * e;
        const dx = Math.sin(elapsed * 0.9 + ph) * drift;
        const dy = Math.cos(elapsed * 0.7 + ph) * drift;

        arr[ix] = starts[ix] + (targets[ix] - starts[ix]) * e + dx;
        arr[ix + 1] =
          starts[ix + 1] + (targets[ix + 1] - starts[ix + 1]) * e + dy;
        arr[ix + 2] = starts[ix + 2] + (targets[ix + 2] - starts[ix + 2]) * e;
      }
      posAttr.needsUpdate = true;

      const settled = p;
      if (!prefersReduced) {
        parX += (mouseX - parX) * 0.05;
        parY += (mouseY - parY) * 0.05;
      }
      group.rotation.y = Math.sin(elapsed * 0.6) * 0.05 * settled + parX * 0.45;
      group.rotation.x = -parY * 0.28;
      group.position.y = Math.sin(elapsed * 0.5) * 0.05 * settled;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      resizeObs.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
