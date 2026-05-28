"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ParticlesCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Particles
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Brand sienna particle color
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(0xd96a3a),
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
    });

    // Secondary cream particles (smaller, less visible)
    const count2 = 400;
    const positions2 = new Float32Array(count2 * 3);
    for (let i = 0; i < count2; i++) {
      positions2[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positions2[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions2[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const geometry2 = new THREE.BufferGeometry();
    geometry2.setAttribute(
      "position",
      new THREE.BufferAttribute(positions2, 3)
    );
    const material2 = new THREE.PointsMaterial({
      color: new THREE.Color(0xf5ece0),
      size: 0.018,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.2,
    });

    const points = new THREE.Points(geometry, material);
    const points2 = new THREE.Points(geometry2, material2);
    scene.add(points);
    scene.add(points2);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const resizeObs = new ResizeObserver(onResize);
    resizeObs.observe(mount);

    // Animation
    const timer = new THREE.Timer();
    let animId: number;
    let lastFrame = 0;
    const FPS_CAP = 1 / 60;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      timer.update();
      const delta = timer.getDelta();
      lastFrame += delta;
      if (lastFrame < FPS_CAP) return;
      lastFrame = 0;

      const elapsed = timer.getElapsed();

      if (!prefersReduced) {
        // Slow auto-rotation
        points.rotation.y = elapsed * 0.04;
        points2.rotation.y = elapsed * 0.025;
        points.rotation.x = elapsed * 0.015;

        // Mouse parallax (smooth lerp)
        targetX += (mouseX * 0.4 - targetX) * 0.05;
        targetY += (mouseY * 0.3 - targetY) * 0.05;
        points.rotation.y += targetX * 0.12;
        points.rotation.x += targetY * 0.08;
        points2.rotation.y += targetX * 0.06;
        points2.rotation.x += targetY * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      resizeObs.disconnect();
      geometry.dispose();
      geometry2.dispose();
      material.dispose();
      material2.dispose();
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
        zIndex: 0,
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
