"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

interface NavItem {
  id: string;
  label: string;
  anchor: string;
}

const SECTIONS = ["about", "stack", "experience", "projects", "contact"];

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  const prefix = locale === "en" ? "/en" : "";

  const navItems: NavItem[] = [
    { id: "about",    label: t("about"),    anchor: "about" },
    { id: "stack",    label: t("stack"),    anchor: "stack" },
    { id: "exp",      label: t("exp"),      anchor: "experience" },
    { id: "projetos", label: t("projetos"), anchor: "projects" },
    { id: "contato",  label: t("contato"),  anchor: "contact" },
  ];

  useEffect(() => {
    const cleanPath = pathname.replace(/^\/en/, "") || "/";
    if (cleanPath !== "/") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = useCallback(
    (anchor: string) => {
      const cleanPath = pathname.replace(/^\/en/, "") || "/";
      if (cleanPath === "/") {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`${prefix}/`);
        setTimeout(() => {
          document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
        }, 400);
      }
    },
    [pathname, prefix, router]
  );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        background: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)",
      }}
    >
      {/* Logo */}
      <button
        onClick={() => {
          const cleanPath = pathname.replace(/^\/en/, "") || "/";
          if (cleanPath === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            router.push(`${prefix}/`);
          }
        }}
        aria-label="Home"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 22,
          color: "var(--fg-1)",
          letterSpacing: "-0.03em",
          display: "flex",
          alignItems: "baseline",
          padding: 0,
          transition: "color var(--dur-fast) var(--ease-out)",
        }}
      >
        daviaviss
        <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontStyle: "normal", fontSize: 16 }}>
          /
        </span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Nav items — hidden on mobile */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
            }}
          >
            {navItems.map((item, i) => {
              const active = activeSection === item.anchor;
              const hov = hover === item.id;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && (
                    <span style={{ color: "var(--fg-3)", margin: "0 1px" }}>/</span>
                  )}
                  <button
                    onClick={() => handleClick(item.anchor)}
                    onMouseEnter={() => setHover(item.id)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      padding: "6px 10px",
                      color: active ? "var(--accent)" : hov ? "var(--fg-1)" : "var(--fg-2)",
                      position: "relative",
                      transition: "color var(--dur-fast) var(--ease-out)",
                      letterSpacing: "var(--tracking-mono)",
                    }}
                  >
                    {active && <span style={{ color: "var(--accent)" }}>▸ </span>}
                    {item.label}
                    <motion.span
                      initial={false}
                      animate={{ scaleX: active || hov ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      style={{
                        position: "absolute",
                        left: 10,
                        right: 10,
                        bottom: 2,
                        height: 1,
                        background: "var(--accent)",
                        transformOrigin: "left",
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ⌘K — always visible */}
        <button
          onClick={() => document.dispatchEvent(new CustomEvent("open-palette"))}
          aria-label="Command palette"
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-1)",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--fg-3)",
            padding: "3px 7px",
            marginLeft: isMobile ? 0 : 12,
            transition: "border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--fg-3)";
          }}
        >
          {isMobile ? "⌘K" : "⌘+K"}
        </button>
      </div>
    </motion.nav>
  );
}
