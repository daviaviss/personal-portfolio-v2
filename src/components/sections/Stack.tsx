"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTextScramble } from "@/hooks/useTextScramble";

const STACK = [
  {
    key: "frameworks" as const,
    items: ["next.js", "expo", "react", "react native"],
    icon: "⬡",
  },
  {
    key: "languages" as const,
    items: ["typescript", "javascript", "python"],
    icon: "◈",
  },
  {
    key: "styling" as const,
    items: ["tailwind css", "shadcn/ui", "css modules"],
    icon: "◎",
  },
  {
    key: "tools" as const,
    items: ["zed", "claude", "obsidian", "git", "vercel"],
    icon: "▸",
  },
] as const;

export function Stack() {
  const t = useTranslations("stack");
  const tGroups = useTranslations("stack.groups");
  const { ref, visible } = useScrollReveal();
  const title = useTextScramble(t("title"), visible);

  return (
    <section
      id="stack"
      ref={ref as React.Ref<HTMLElement>}
      style={{
        padding: "var(--s-9) clamp(24px, 5vw, 48px)",
        maxWidth: 1080,
        margin: "0 auto",
      }}
    >
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {STACK.map((group, i) => (
          <motion.div
            key={group.key}
            initial={{ opacity: 0, y: 16 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
            }}
            whileHover={{ y: -2 }}
            className="stack-group-card"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-3)",
              padding: "var(--s-5)",
              position: "relative",
              overflow: "hidden",
              cursor: "default",
              transition:
                "border-color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(217,106,58,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--border)";
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
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 20,
                color: "var(--accent)",
                marginBottom: 12,
                opacity: 0.7,
              }}
            >
              {group.icon}
            </div>
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
              {tGroups(group.key)}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {group.items.map((item) => (
                <span
                  key={item}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "2px 7px",
                    borderRadius: "var(--r-1)",
                    border: "1px solid var(--border)",
                    color: "var(--fg-3)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
