"use client";

import { useState, useEffect, useId, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { copyText } from "@/lib/clipboard";
import { toggleTheme } from "@/lib/theme";
import { LINKS } from "@/lib/links";
import { OPEN_PALETTE } from "@/lib/events";
import { useLocaleSwitch } from "@/components/providers/LocaleProvider";
import { LOCALES } from "@/i18n/config";

interface Command {
  id: string;
  label: string;
  hint: string;
  glyph: string;
  action: () => void;
}

const FOCUSABLE = 'input, button:not([disabled]):not([tabindex="-1"])';

export function CommandPalette() {
  const t = useTranslations("palette");
  const ta = useTranslations("actions");
  const tLocales = useTranslations("locales");
  const { locale, setLocale } = useLocaleSwitch();
  const titleId = useId();
  const listId = useId();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const commands: Command[] = [
    ...LINKS.map((link) => ({
      id: link.id,
      label: t(`commands.${link.id}`),
      hint: t(`commands.${link.id}Hint`),
      glyph: link.kind === "copy" ? "⧉" : "↗",
      action: () => {
        if (link.kind === "link") {
          window.open(link.href, "_blank", "noopener,noreferrer");
        } else {
          void copyText(link.value);
        }
        setOpen(false);
      },
    })),
    {
      id: "theme",
      label: t("commands.theme"),
      hint: t("commands.themeHint"),
      glyph: "◑",
      action: () => {
        toggleTheme();
        setOpen(false);
      },
    },
    ...LOCALES.filter((loc) => loc !== locale)
      .map((loc) => ({
        id: `locale-${loc}`,
        label: tLocales(loc),
        hint: ta("switchTo", { lang: tLocales(loc) }),
        glyph: "◎",
        action: () => {
          setLocale(loc);
          setOpen(false);
        },
      })),
  ];

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.hint.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const activeId = filtered[selected]
    ? `${listId}-${filtered[selected].id}`
    : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) openerRef.current = document.activeElement as HTMLElement;
          return !v;
        });
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => {
      openerRef.current = document.activeElement as HTMLElement;
      setOpen(true);
      setQuery("");
      setSelected(0);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener(OPEN_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener(OPEN_PALETTE, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const siblings = Array.from(document.body.children).filter(
      (el) => el !== overlayRef.current && !el.contains(overlayRef.current)
    ) as HTMLElement[];
    const wasInert = siblings.map((el) => el.inert);
    siblings.forEach((el) => {
      el.inert = true;
    });

    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const opener = openerRef.current;
    return () => {
      siblings.forEach((el, i) => {
        el.inert = wasInert[i];
      });
      document.body.style.overflow = bodyOverflow;
      opener?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    const item = listRef.current?.querySelectorAll("[role='option']")[selected];
    item?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }

    if (!filtered.length) return;

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
          ref={overlayRef}
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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onKeyDown={onKeyDown}
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
            <h2 id={titleId} className="sr-only">
              {t("title")}
            </h2>

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
                aria-hidden
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
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(0);
                }}
                placeholder={t("placeholder")}
                aria-label={t("inputLabel")}
                role="combobox"
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "var(--font-mono)",
                  fontSize: 15,
                  color: "var(--fg-1)",
                  flex: 1,
                  minWidth: 0,
                  caretColor: "var(--accent)",
                }}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--fg-3)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-1)",
                  minWidth: 32,
                  minHeight: 26,
                  padding: "4px 8px",
                  background: "var(--bg-raised)",
                  cursor: "pointer",
                  flexShrink: 0,
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
              </button>
            </div>

            <div
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={t("resultsLabel")}
              style={{
                maxHeight: 340,
                overflowY: "auto",
                padding: "6px 0",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--border) transparent",
              }}
            >
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  type="button"
                  id={`${listId}-${cmd.id}`}
                  role="option"
                  aria-selected={i === selected}
                  tabIndex={-1}
                  className="palette-option"
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelected(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px 16px",
                    background: "transparent",
                    cursor: "pointer",
                    transition: "background var(--dur-fast) var(--ease-out)",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      color: i === selected ? "var(--fg-1)" : "var(--fg-2)",
                      textAlign: "left",
                    }}
                  >
                    <span aria-hidden style={{ color: "var(--fg-3)" }}>
                      {cmd.glyph}
                    </span>
                    <span>{cmd.label}</span>
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--fg-meta)",
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

              {filtered.length === 0 && (
                <div
                  style={{
                    padding: "20px 18px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--fg-2)",
                    textAlign: "center",
                  }}
                >
                  {t("notFound")}
                </div>
              )}
            </div>

            <span role="status" className="sr-only">
              {t("results", { n: filtered.length })}
            </span>

            <div
              aria-hidden
              style={{
                padding: "8px 18px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                gap: 16,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--fg-2)",
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
