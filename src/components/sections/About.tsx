"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTextScramble } from "@/hooks/useTextScramble";
import { useIsMobile } from "@/hooks/useIsMobile";

export function About() {
  const t = useTranslations("about");
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const title = useTextScramble(t("title"), visible);

  return (
    <section
      id="about"
      ref={ref as React.Ref<HTMLElement>}
      style={{
        padding: "var(--s-9) clamp(24px, 5vw, 48px)",
        maxWidth: 1080,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] }}
        style={{ marginBottom: 52 }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-micro)",
            letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            marginBottom: 10,
          }}
        >
          <span style={{ color: "var(--accent)" }}>▸</span> {t("label")}
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "var(--fs-h2)",
            letterSpacing: "var(--tracking-tight)",
            margin: 0,
            color: "var(--fg-1)",
          }}
        >
          {title}
        </h2>
      </motion.div>

      {/* Content grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.6,
          delay: 0.12,
          ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
        }}
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "auto 1fr",
          gap: isMobile ? 28 : 44,
          alignItems: "flex-start",
        }}
      >
        {/* Portrait */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              width: 188,
              height: 188,
              borderRadius: "50%",
              overflow: "hidden",
              border: "1px solid var(--border)",
              boxShadow: "0 0 48px -4px rgba(217, 106, 58, 0.5)",
              position: "relative",
            }}
          >
            <Image
              src="/davi-portrait.jpg"
              alt="Davi Vissotto"
              width={188}
              height={188}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 20%",
                filter: "sepia(0.12) saturate(1.1) contrast(1.03)",
              }}
              priority
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "var(--grain)",
                opacity: 0.35,
                mixBlendMode: "overlay",
              }}
            />
          </motion.div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
              marginTop: 14,
              textAlign: isMobile ? "left" : "center",
            }}
          >
            {t("location")}
          </div>
        </div>

        {/* Bio */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 24,
              lineHeight: 1.4,
              color: "var(--fg-1)",
              margin: "0 0 24px",
              maxWidth: 580,
            }}
          >
            {t("p1")}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              lineHeight: 1.68,
              color: "var(--fg-2)",
              margin: "0 0 16px",
              maxWidth: 580,
            }}
          >
            {t("p2")}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              lineHeight: 1.68,
              color: "var(--fg-2)",
              maxWidth: 580,
            }}
          >
            {t("p3")}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
