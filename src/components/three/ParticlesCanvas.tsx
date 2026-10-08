"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const THEMES = {
  dark: {
    primary: 0xd96a3a,
    primaryOpacity: 0.3,
    secondary: 0xf5ece0,
    secondaryOpacity: 0.12,
  },
  light: {
    primary: 0xc4521f,
    primaryOpacity: 0.22,
    secondary: 0x5a3425,
    secondaryOpacity: 0.1,
  },
} as const;

const readTheme = () =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

export function ParticlesCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const density = isMobile ? 0.55 : 1;
    const count = Math.round(520 * density);
    const count2 = Math.round(260 * density);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
    );
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const theme = THEMES[readTheme()];

    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(theme.primary),
      size: 0.026,
      sizeAttenuation: true,
      transparent: true,
      opacity: theme.primaryOpacity,
    });

    const positions2 = new Float32Array(count2 * 3);
    for (let i = 0; i < count2; i++) {
      positions2[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positions2[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions2[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const geometry2 = new THREE.BufferGeometry();
    geometry2.setAttribute(
      "position",
      new THREE.BufferAttribute(positions2, 3)
    );

    const material2 = new THREE.PointsMaterial({
      color: new THREE.Color(theme.secondary),
      size: 0.014,
      sizeAttenuation: true,
      transparent: true,
      opacity: theme.secondaryOpacity,
    });

    const points = new THREE.Points(geometry, material);
    const points2 = new THREE.Points(geometry2, material2);
    scene.add(points, points2);

    const themeObs = new MutationObserver(() => {
      const next = THEMES[readTheme()];
      material.color.setHex(next.primary);
      material.opacity = next.primaryOpacity;
      material2.color.setHex(next.secondary);
      material2.opacity = next.secondaryOpacity;
      renderer.render(scene, camera);
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!isMobile) window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObs = new ResizeObserver(onResize);
    resizeObs.observe(mount);

    const timer = new THREE.Timer();
    timer.connect(document);

    let reduced = motionQuery.matches;
    let animId = 0;
    let lastFrame = 0;
    const FPS_CAP = 1 / 60;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      timer.update();
      lastFrame += timer.getDelta();
      if (lastFrame < FPS_CAP) return;
      lastFrame %= FPS_CAP;

      const elapsed = timer.getElapsed();

      points.rotation.y = elapsed * 0.022;
      points2.rotation.y = elapsed * 0.015;
      points.rotation.x = elapsed * 0.008;

      if (!isMobile) {
        targetX += (mouseX * 0.22 - targetX) * 0.035;
        targetY += (mouseY * 0.16 - targetY) * 0.035;
        points.rotation.y += targetX * 0.12;
        points.rotation.x += targetY * 0.08;
        points2.rotation.y += targetX * 0.06;
        points2.rotation.x += targetY * 0.04;
      }

      renderer.render(scene, camera);
    };

    const start = () => {
      if (!animId) animate();
    };
    const stop = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
    };

    const onMotionChange = () => {
      reduced = motionQuery.matches;
      if (reduced) {
        stop();
        renderer.render(scene, camera);
      } else {
        start();
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    if (reduced) renderer.render(scene, camera);
    else start();

    return () => {
      stop();
      motionQuery.removeEventListener("change", onMotionChange);
      if (!isMobile) window.removeEventListener("mousemove", onMouseMove);
      themeObs.disconnect();
      resizeObs.disconnect();
      timer.dispose();
      geometry.dispose();
      geometry2.dispose();
      material.dispose();
      material2.dispose();
      renderer.forceContextLoss();
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
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
