"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { useIsMobile } from "@/hooks/useIsMobile";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const ParticlesCanvas = dynamic(
  () =>
    import("@/components/three/ParticlesCanvas").then(
      (m) => m.ParticlesCanvas
    ),
  { ssr: false }
);

const DollarCanvas = dynamic(
  () =>
    import("@/components/three/DollarCanvas").then((m) => m.DollarCanvas),
  { ssr: false }
);

const EASE = [0.2, 0.8, 0.2, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

export function Hero() {
  const t = useTranslations("hero");
  const [mounted, setMounted] = useState(false);
  const hideDollar = useIsMobile(1024);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      id="home"
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Three.js canvas — lazy loaded */}
      {mounted && <ParticlesCanvas />}

      {/* Particle "$" — full-bleed canvas, the symbol is placed at the
          container's right edge inside the scene. Hidden on small screens. */}
      {mounted && !hideDollar && <DollarCanvas />}

      {/* Warm radial glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          right: "-5%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle, rgba(217,106,58,0.14) 0%, transparent 65%)",
          pointerEvents: "none",
          filter: "blur(40px)",
          animation: "glowPulse 8s ease-in-out infinite",
          opacity: "var(--hero-glow-opacity)" as React.CSSProperties["opacity"],
        }}
      />
      {/* Secondary glow — bottom left */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "5%",
          left: "-10%",
          width: "35vw",
          height: "35vw",
          background:
            "radial-gradient(circle, rgba(217,106,58,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
          filter: "blur(60px)",
          animation: "glowPulse 12s ease-in-out infinite reverse",
          opacity: "var(--hero-glow-opacity)" as React.CSSProperties["opacity"],
        }}
      />

      {/* Grain */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "var(--grain)",
          opacity: 0.18,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Bottom fade */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "22%",
          background: "linear-gradient(to top, var(--bg), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1080,
          margin: "0 auto",
          padding:
            "clamp(100px, 15vh, 150px) clamp(24px, 5vw, 48px) clamp(72px, 10vh, 100px)",
          width: "100%",
        }}
      >
        {/* Available badge */}
        <motion.div {...fadeUp(0.2)}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-micro)",
              letterSpacing: "var(--tracking-wider)",
              textTransform: "uppercase",
              color: "var(--fg-3)",
              marginBottom: 32,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid var(--border)",
              borderRadius: "var(--r-full)",
              padding: "5px 14px 5px 10px",
              background: "var(--bg-raised)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--signal-green)",
                boxShadow: "0 0 8px var(--signal-green)",
                flexShrink: 0,
              }}
            />
            {t("badge")}
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.35)}
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(52px, 12vw, 132px)",
            lineHeight: 0.95,
            letterSpacing: "-0.045em",
            color: "var(--fg-1)",
            margin: "0 0 40px",
            maxWidth: 740,
          }}
        >
          {t("headline1")}
          <br />
          <span style={{ color: "var(--fg-2)" }}>{t("headline2")}</span>
          <span style={{ color: "var(--accent)" }}> {t("headline3")}</span>
          <br />
          <span style={{ color: "var(--fg-2)" }}>{t("headline4")}</span>
        </motion.h1>

        {/* Lead */}
        <motion.p
          {...fadeUp(0.5)}
          style={{
            maxWidth: 480,
            fontFamily: "var(--font-sans)",
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--fg-2)",
            marginBottom: 44,
          }}
        >
          {t("lead")}{" "}
          <span style={{ color: "var(--fg-1)", fontWeight: 500 }}>
            {t("company")}
          </span>
          .
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.65)}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <Button
            variant="primary"
            onClick={() => scrollTo("projects")}
          >
            {t("cta1")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => scrollTo("contact")}
          >
            {t("cta2")}
          </Button>
        </motion.div>

        {/* ⌘+K hint */}
        <motion.button
          {...fadeUp(0.8)}
          onClick={() =>
            document.dispatchEvent(new CustomEvent("open-palette"))
          }
          whileHover={{ x: 2 }}
          style={{
            marginTop: 40,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "inherit",
          }}
        >
          <kbd
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--r-1)",
              padding: "1px 5px",
              fontSize: 10,
              background: "var(--bg-raised)",
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            ⌘+K
          </kbd>
          <span style={{ color: "var(--fg-3)" }}>{t("palette")}</span>
        </motion.button>

        {/* Scroll hint */}
        <motion.div
          aria-hidden
          {...fadeUp(1)}
          style={{
            position: "absolute",
            bottom: 26,
            left: "clamp(24px, 5vw, 48px)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-micro)",
            letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>{t("scroll")}</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: 16 }}
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
