"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface Command {
  id: string;
  label: string;
  hint: string;
  action: () => void;
}

const EMAIL = "daviaugustovissotto@gmail.com";

export function CommandPalette() {
  const t = useTranslations("palette");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const prefix = locale === "en" ? "/en" : "";

  const scrollTo = useCallback(
    (anchor: string) => {
      setOpen(false);
      const cleanPath = pathname.replace(/^\/en/, "") || "/";
      if (cleanPath === "/") {
        setTimeout(
          () =>
            document
              .getElementById(anchor)
              ?.scrollIntoView({ behavior: "smooth" }),
          80
        );
      } else {
        router.push(`${prefix}/`);
        setTimeout(
          () =>
            document
              .getElementById(anchor)
              ?.scrollIntoView({ behavior: "smooth" }),
          500
        );
      }
    },
    [pathname, prefix, router]
  );

  const navigateHome = useCallback(() => {
    router.push(`${prefix}/`);
    setOpen(false);
  }, [router, prefix]);

  const toggleTheme = () => {
    const h = document.documentElement;
    const next = h.dataset.theme === "light" ? "" : "light";
    // eslint-disable-next-line react-hooks/immutability
    h.dataset.theme = next;
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Lax`;
    try {
      if (next === "light") localStorage.setItem("theme", "light");
      else localStorage.removeItem("theme");
    } catch {}
  };

  const toggleLang = () => {
    const next = locale === "pt" ? "en" : "pt";
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;SameSite=Lax`;
    router.push(next === "en" ? "/en" : "/");
    setOpen(false);
  };

  // Order mirrors the page section order
  const commands: Command[] = [
    {
      id: "home",
      label: t("commands.home"),
      hint: t("commands.homeHint"),
      action: () => navigateHome(),
    },
    {
      id: "about",
      label: t("commands.about"),
      hint: t("commands.aboutHint"),
      action: () => scrollTo("about"),
    },
    {
      id: "stack",
      label: t("commands.stack"),
      hint: t("commands.stackHint"),
      action: () => scrollTo("stack"),
    },
    {
      id: "exp",
      label: t("commands.exp"),
      hint: t("commands.expHint"),
      action: () => scrollTo("experience"),
    },
    {
      id: "projetos",
      label: t("commands.projetos"),
      hint: t("commands.projetosHint"),
      action: () => scrollTo("projects"),
    },
    {
      id: "contato",
      label: t("commands.contato"),
      hint: t("commands.contatoHint"),
      action: () => scrollTo("contact"),
    },
    {
      id: "email",
      label: t("commands.email"),
      hint: t("commands.emailHint"),
      action: () => {
        navigator.clipboard?.writeText(EMAIL);
        setOpen(false);
      },
    },
    {
      id: "linkedin",
      label: t("commands.linkedin"),
      hint: t("commands.linkedinHint"),
      action: () => {
        window.open("https://linkedin.com/in/daviaviss", "_blank");
        setOpen(false);
      },
    },
    {
      id: "github",
      label: t("commands.github"),
      hint: t("commands.githubHint"),
      action: () => {
        window.open("https://github.com/daviaviss", "_blank");
        setOpen(false);
      },
    },
    {
      id: "instagram",
      label: t("commands.instagram"),
      hint: t("commands.instagramHint"),
      action: () => {
        window.open("https://www.instagram.com/daviaviss/", "_blank");
        setOpen(false);
      },
    },
    {
      id: "whatsapp",
      label: t("commands.whatsapp"),
      hint: t("commands.whatsappHint"),
      action: () => {
        window.open("https://wa.me/5548984616370", "_blank");
        setOpen(false);
      },
    },
    {
      id: "theme",
      label: t("commands.theme"),
      hint: t("commands.themeHint"),
      action: () => {
        toggleTheme();
        setOpen(false);
      },
    },
    {
      id: "lang",
      label: t("commands.lang"),
      hint: t("commands.langHint"),
      action: toggleLang,
    },
  ];

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.hint.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => {
      setOpen(true);
      setQuery("");
      setSelected(0);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, [open]);


  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.querySelectorAll("button")[selected];
    item?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      filtered[selected]?.action();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,8,4,0.75)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            zIndex: 100,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "18vh",
          }}
        >
          <motion.div
            key="palette"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-3)",
              width: "min(560px, 90vw)",
              overflow: "hidden",
              boxShadow: "var(--shadow-3)",
              position: "relative",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "var(--grain)",
                opacity: 0.15,
                mixBlendMode: "overlay",
                pointerEvents: "none",
              }}
            />

            {/* Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 18px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 15,
                  color: "var(--accent)",
                  flexShrink: 0,
                }}
              >
                ▸
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                onKeyDown={onKey}
                placeholder={t("placeholder")}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "var(--font-mono)",
                  fontSize: 15,
                  color: "var(--fg-1)",
                  flex: 1,
                  caretColor: "var(--accent)",
                }}
              />
              <kbd
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--fg-3)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-1)",
                  padding: "2px 6px",
                  background: "var(--bg-raised)",
                  cursor: "pointer",
                  transition:
                    "border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
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
                esc
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              style={{
                maxHeight: 340,
                overflowY: "auto",
                padding: "6px 0",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--border) transparent",
              }}
            >
              {filtered.length === 0 && (
                <div
                  style={{
                    padding: "20px 18px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--fg-3)",
                    textAlign: "center",
                  }}
                >
                  {t("notFound")}
                </div>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelected(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px 18px",
                    background:
                      i === selected ? "var(--accent-soft)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "background var(--dur-fast) var(--ease-out)",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      color: i === selected ? "var(--fg-1)" : "var(--fg-2)",
                      textAlign: "left",
                    }}
                  >
                    {cmd.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--fg-3)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 200,
                    }}
                  >
                    {cmd.hint}
                  </span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "8px 18px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                gap: 16,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--fg-3)",
                letterSpacing: "0.08em",
              }}
            >
              <span>{t("navigate")}</span>
              <span>{t("select")}</span>
              <span>{t("close")}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
