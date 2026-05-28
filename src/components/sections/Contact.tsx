"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTextScramble } from "@/hooks/useTextScramble";

const EMAIL = "daviaugustovissotto@gmail.com";

const SOCIALS = [
  {
    label: "linkedin",
    handle: "/in/daviaviss",
    href: "https://linkedin.com/in/daviaviss",
  },
  {
    label: "github",
    handle: "@daviaviss",
    href: "https://github.com/daviaviss",
  },
  {
    label: "instagram",
    handle: "@daviaviss",
    href: "https://www.instagram.com/daviaviss/",
  },
  {
    label: "whatsapp",
    handle: "+55 48 98461-6370",
    href: "https://wa.me/5548984616370",
  },
];

const EASE = [0.2, 0.8, 0.2, 1] as [number, number, number, number];

export function Contact() {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);
  const { ref, visible } = useScrollReveal();
  const title = useTextScramble(t("title"), visible);

  const copy = async () => {
    await navigator.clipboard?.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="contact"
      ref={ref as React.Ref<HTMLElement>}
      style={{
        padding: "var(--s-9) clamp(24px, 5vw, 48px) var(--s-10)",
        maxWidth: 1080,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE }}
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

      {/* Email — full width */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-micro)",
            letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            marginBottom: 14,
          }}
        >
          {t("direct")}
        </div>

        <motion.button
          onClick={copy}
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.998 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            width: "100%",
            padding: "20px 28px",
            borderRadius: "var(--r-3)",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(217,106,58,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "var(--grain)",
              opacity: 0.12,
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(13px, 1.4vw, 16px)",
              color: "var(--fg-1)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              position: "relative",
            }}
          >
            {EMAIL}
          </span>
          <motion.span
            animate={{ color: copied ? "var(--signal-green)" : "var(--accent)" }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              flexShrink: 0,
              position: "relative",
            }}
          >
            {copied ? t("copied") : t("copy")}
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Socials — 2×2 grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
        style={{ marginTop: 40 }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-micro)",
            letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            marginBottom: 16,
          }}
        >
          {t("elsewhere")}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {SOCIALS.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.22 + i * 0.06, ease: EASE }}
              whileHover={{ y: -2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "20px 24px",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-3)",
                textDecoration: "none",
                color: "var(--fg-1)",
                position: "relative",
                overflow: "hidden",
                transition:
                  "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(217,106,58,0.4)";
                el.style.boxShadow = "var(--shadow-2)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border)";
                el.style.boxShadow = "none";
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "var(--grain)",
                  opacity: 0.1,
                  mixBlendMode: "overlay",
                  pointerEvents: "none",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--fs-micro)",
                  letterSpacing: "var(--tracking-wider)",
                  textTransform: "uppercase",
                  color: "var(--fg-3)",
                  position: "relative",
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  color: "var(--fg-1)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {s.handle}
                <span style={{ color: "var(--accent)", fontSize: 16 }}>↗</span>
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
