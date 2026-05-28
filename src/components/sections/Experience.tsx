"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTextScramble } from "@/hooks/useTextScramble";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Role {
  company: string;
  role: { pt: string; en: string };
  period: { pt: string; en: string };
  duration: { pt: string; en: string };
  stack: string[];
  highlight: { pt: string; en: string };
}

const ROLES: Role[] = [
  {
    company: "ci&t",
    role: { pt: "desenvolvedor pleno", en: "mid-level developer" },
    period: { pt: "jul 2025 — presente", en: "jul 2025 — present" },
    duration: { pt: "atual", en: "current" },
    stack: ["react native", "expo", "typescript", "api integration"],
    highlight: {
      pt: "foco na experiência do usuário em um app bancário de uma grande rede de cosméticos.",
      en: "customer experience on banking app — major cosmetics chain.",
    },
  },
  {
    company: "ci&t",
    role: { pt: "desenvolvedor junior", en: "junior developer" },
    period: { pt: "jan 2025 — jun 2025", en: "jan 2025 — jun 2025" },
    duration: { pt: "6 meses", en: "6 months" },
    stack: ["react native", "expo", "typescript", "api integration"],
    highlight: {
      pt: "novas funcionalidades e integração de APIs em um app bancário de uma grande rede de cosméticos.",
      en: "new features and API integration on banking app — cosmetics chain.",
    },
  },
  {
    company: "quality digital",
    role: { pt: "desenvolvedor junior", en: "junior developer" },
    period: { pt: "fev 2023 — jan 2025", en: "feb 2023 — jan 2025" },
    duration: { pt: "2 anos", en: "2 years" },
    stack: ["vtex io", "react", "graphql", "typescript"],
    highlight: {
      pt: "e-commerce para grandes marcas: electrolux, vivara e fast shop.",
      en: "e-commerce for electrolux, vivara and fast shop.",
    },
  },
  {
    company: "quality digital",
    role: { pt: "desenvolvedor estagiário", en: "intern developer" },
    period: { pt: "jul 2022 — fev 2023", en: "jul 2022 — feb 2023" },
    duration: { pt: "8 meses", en: "8 months" },
    stack: ["vtex io", "javascript", "typescript", "react"],
    highlight: {
      pt: "desenvolvimento de soluções e-commerce para múltiplas plataformas.",
      en: "e-commerce solutions across multiple platforms.",
    },
  },
  {
    company: "infityworks",
    role: { pt: "desenvolvedor autônomo", en: "freelance developer" },
    period: { pt: "dez 2021 — fev 2022", en: "dec 2021 — feb 2022" },
    duration: { pt: "3 meses", en: "3 months" },
    stack: ["wordpress", "html", "css", "javascript"],
    highlight: {
      pt: "websites e apps personalizados para empresas locais em florianópolis.",
      en: "custom websites and apps for local businesses in florianópolis.",
    },
  },
];

function ExperienceCardContent({
  role,
  lang,
}: {
  role: Role;
  lang: string;
}) {
  const l = lang as "pt" | "en";
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg-3)",
          marginBottom: 8,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{role.period[l]}</span>
        <span
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
            padding: "1px 6px",
            borderRadius: "var(--r-1)",
          }}
        >
          {role.duration[l]}
        </span>
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 22,
          color: "var(--fg-1)",
          marginBottom: 2,
        }}
      >
        {role.role[l]}
      </div>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--accent)",
          marginBottom: 12,
        }}
      >
        @ {role.company}
      </div>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--fg-2)",
          marginBottom: 14,
        }}
      >
        {role.highlight[l]}
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {role.stack.map((s) => (
          <span
            key={s}
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
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function RoleItem({
  role,
  index,
  lineProgress,
  lang,
  isMobile,
}: {
  role: Role;
  index: number;
  lineProgress: number;
  lang: string;
  isMobile: boolean;
}) {
  const { ref, visible } = useScrollReveal(0.2);
  const [hov, setHov] = useState(false);
  const dotThreshold = index / (ROLES.length - 1);
  const dotActive = lineProgress >= dotThreshold;

  if (isMobile) {
    return (
      <motion.div
        ref={ref as React.Ref<HTMLDivElement>}
        initial={{ opacity: 0, y: 16 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.5,
          delay: index * 0.06,
          ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
        }}
        style={{ paddingBottom: 16 }}
      >
        <div
          style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-3)",
            padding: "var(--s-5)",
            position: "relative",
            overflow: "hidden",
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
          <ExperienceCardContent role={role} lang={lang} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      initial={{ opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 24px 1fr",
        gap: 0,
        alignItems: "start",
      }}
    >
      {index % 2 === 0 ? (
        <div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{ paddingRight: 32, paddingBottom: 48 }}
        >
          <motion.div
            animate={
              hov
                ? {
                    y: -2,
                    boxShadow: "var(--shadow-2)",
                    borderColor: "rgba(217,106,58,0.4)",
                    background: "var(--bg-elevated)",
                  }
                : {
                    y: 0,
                    boxShadow: "var(--shadow-1)",
                    borderColor: "var(--border)",
                    background: "var(--bg-raised)",
                  }
            }
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              borderRadius: "var(--r-3)",
              padding: "var(--s-5)",
              position: "relative",
              overflow: "hidden",
              border: "1px solid var(--border)",
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
            <ExperienceCardContent role={role} lang={lang} />
          </motion.div>
        </div>
      ) : (
        <div style={{ paddingBottom: 48 }} />
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div
          animate={
            dotActive
              ? { width: 14, height: 14, background: "var(--accent)" }
              : { width: 10, height: 10, background: "var(--border)" }
          }
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            borderRadius: "50%",
            border: dotActive
              ? "2px solid var(--bg)"
              : "2px solid var(--border)",
            boxShadow: dotActive ? "var(--glow-warm)" : "none",
            flexShrink: 0,
            marginTop: 16,
            position: "relative",
            zIndex: 1,
          }}
        />
      </div>

      {index % 2 === 1 ? (
        <div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{ paddingLeft: 32, paddingBottom: 48 }}
        >
          <motion.div
            animate={
              hov
                ? {
                    y: -2,
                    boxShadow: "var(--shadow-2)",
                    borderColor: "rgba(217,106,58,0.4)",
                    background: "var(--bg-elevated)",
                  }
                : {
                    y: 0,
                    boxShadow: "var(--shadow-1)",
                    borderColor: "var(--border)",
                    background: "var(--bg-raised)",
                  }
            }
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              borderRadius: "var(--r-3)",
              padding: "var(--s-5)",
              position: "relative",
              overflow: "hidden",
              border: "1px solid var(--border)",
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
            <ExperienceCardContent role={role} lang={lang} />
          </motion.div>
        </div>
      ) : (
        <div style={{ paddingBottom: 48 }} />
      )}
    </motion.div>
  );
}

export function Experience() {
  const t = useTranslations("experience");
  const locale = useLocale();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal(0.05);
  const { ref: eduRef, visible: eduVisible } = useScrollReveal(0.3);
  const title = useTextScramble(t("title"), visible);

  const lineRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    const container = lineRef.current;
    if (!container) return;
    const calc = () => {
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;
      setLineProgress(
        Math.max(
          0,
          Math.min(1, (windowH - rect.top) / (rect.height + windowH * 0.2))
        )
      );
    };
    const obs = new IntersectionObserver(calc, {
      threshold: Array.from({ length: 21 }, (_, i) => i / 20),
    });
    obs.observe(container);
    window.addEventListener("scroll", calc, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", calc);
    };
  }, []);

  return (
    <section
      id="experience"
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
        style={{ marginBottom: 64 }}
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

      {/* Timeline */}
      <div ref={lineRef} style={{ position: "relative" }}>
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 24,
              bottom: 0,
              width: 1,
              background: "var(--border)",
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: `${lineProgress * 100}%`,
                background:
                  "linear-gradient(to bottom, var(--accent), rgba(217,106,58,0.25))",
                transition: "height 200ms var(--ease-out)",
              }}
            />
          </div>
        )}

        {ROLES.map((role, i) => (
          <RoleItem
            key={i}
            role={role}
            index={i}
            lineProgress={lineProgress}
            lang={locale}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Education */}
      <motion.div
        ref={eduRef as React.Ref<HTMLDivElement>}
        initial={{ opacity: 0, y: 12 }}
        animate={eduVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] }}
        style={{ marginTop: 40 }}
      >
        <div
          style={{ height: 1, background: "var(--border)", marginBottom: 48 }}
        />
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-micro)",
            letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            marginBottom: 20,
          }}
        >
          — {t("education")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {
              course: {
                pt: "sistemas de informação",
                en: "information systems",
              },
              school: "universidade federal de santa catarina (ufsc)",
              period: "2021–2026",
            },
            {
              course: {
                pt: "colégio de aplicação",
                en: "colégio de aplicação",
              },
              school: "universidade federal de santa catarina (ufsc)",
              period: "2018–2020",
            },
          ].map((edu, i) => (
            <div
              key={i}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: "var(--fg-2)",
              }}
            >
              <span style={{ color: "var(--fg-1)" }}>
                {edu.course[locale as "pt" | "en"]}
              </span>{" "}
              — {edu.school}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--fg-3)",
                  marginLeft: 12,
                }}
              >
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
