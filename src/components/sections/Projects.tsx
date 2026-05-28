"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTextScramble } from "@/hooks/useTextScramble";

interface Project {
  title: string;
  description: { pt: string; en: string };
  stack: string[];
  href?: string;
  featured?: boolean;
  wip?: boolean;
}

const PROJECTS: Project[] = [
  {
    title: "daviaviss.me",
    description: {
      pt: "portfólio pessoal com three.js, framer motion e next-intl. design system warm cinematic derivado de paleta de retrato.",
      en: "personal portfolio with three.js, framer motion and next-intl. warm cinematic design system derived from portrait palette.",
    },
    stack: ["next.js", "three.js", "framer motion", "tailwind"],
    href: "https://daviaviss.me",
    featured: true,
  },
  {
    title: "projeto em breve",
    description: {
      pt: "em desenvolvimento — em breve aqui.",
      en: "in development — coming soon.",
    },
    stack: [],
    wip: true,
  },
  {
    title: "projeto em breve",
    description: {
      pt: "em desenvolvimento — em breve aqui.",
      en: "in development — coming soon.",
    },
    stack: [],
    wip: true,
  },
];

function ProjectCard({
  project,
  index,
  visible,
}: {
  project: Project;
  index: number;
  visible: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("projects");

  const isWip = project.wip;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
      }}
      whileHover={!isWip ? { y: -3 } : {}}
    >
      <a
        href={project.href ?? undefined}
        target={project.href ? "_blank" : undefined}
        rel="noopener noreferrer"
        style={{
          display: "block",
          background: isWip ? "transparent" : "var(--bg-raised)",
          border: `1px solid ${isWip ? "var(--border-soft)" : "var(--border)"}`,
          borderRadius: "var(--r-3)",
          padding: "var(--s-5) var(--s-6)",
          textDecoration: "none",
          color: "inherit",
          position: "relative",
          overflow: "hidden",
          height: "100%",
          transition:
            "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
          opacity: isWip ? 0.4 : 1,
          cursor: isWip ? "default" : "pointer",
        }}
        onMouseEnter={(e) => {
          if (!isWip) {
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(217,106,58,0.4)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "var(--shadow-2)";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
        onClick={(e) => {
          if (isWip) e.preventDefault();
        }}
      >
        {!isWip && (
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
        )}

        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 12,
              gap: 8,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 20,
                color: isWip ? "var(--fg-3)" : "var(--fg-1)",
                margin: 0,
              }}
            >
              {project.title}
            </h3>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {project.featured && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    borderRadius: "var(--r-full)",
                    border: "1px solid rgba(217,106,58,0.2)",
                  }}
                >
                  {t("featured")}
                </span>
              )}
              {isWip && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    background: "var(--bg-elevated)",
                    color: "var(--fg-3)",
                    borderRadius: "var(--r-full)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {t("wip")}
                </span>
              )}
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--fg-2)",
              margin: "0 0 16px",
            }}
          >
            {project.description[locale as "pt" | "en"]}
          </p>

          {project.stack.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {project.stack.map((s) => (
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
          )}

          {project.href && (
            <div
              style={{
                marginTop: 16,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {project.href.replace("https://", "")} ↗
            </div>
          )}
        </div>
      </a>
    </motion.div>
  );
}

export function Projects() {
  const t = useTranslations("projects");
  const { ref, visible } = useScrollReveal();
  const title = useTextScramble(t("title"), visible);

  return (
    <section
      id="projects"
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
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 12,
        }}
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={i}
            project={project}
            index={i}
            visible={visible}
          />
        ))}
      </div>
    </section>
  );
}
