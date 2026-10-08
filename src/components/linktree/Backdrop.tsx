"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const ParticlesCanvas = dynamic(
  () =>
    import("@/components/three/ParticlesCanvas").then((m) => m.ParticlesCanvas),
  { ssr: false }
);

export function Backdrop() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      aria-hidden
      style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}
    >
      {mounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "linear" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <ParticlesCanvas />
        </motion.div>
      )}

      <div className="lt-glow lt-glow--a" />
      <div className="lt-glow lt-glow--b" />
      <div className="lt-vignette" />
      <div className="lt-grain" />
      <div className="lt-fade" />
    </div>
  );
}
