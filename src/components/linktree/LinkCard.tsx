"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LinkIcon } from "@/components/ui/LinkIcon";
import { copyText } from "@/lib/clipboard";
import type { ProfileLink } from "@/lib/links";

const EASE = [0.2, 0.8, 0.2, 1] as [number, number, number, number];

const stagger = (i: number) => 0.6 + i * 0.07;

type CopyState = "idle" | "done" | "fail";

const GLYPH: Record<CopyState, string> = {
  idle: "⧉",
  done: "✓",
  fail: "!",
};

export function LinkCard({ link, index }: { link: ProfileLink; index: number }) {
  const t = useTranslations("links");

  const entry = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: stagger(index), ease: EASE },
  };

  const name = t(link.id);

  if (link.kind === "link") {
    return (
      <motion.a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="link-card link-card--link"
        aria-label={`${name}, ${link.handle}, ${t("open")}`}
        {...entry}
      >
        <span aria-hidden className="link-card__grain" />
        <span className="link-card__icon">
          <LinkIcon id={link.id} />
        </span>
        <span aria-hidden className="link-card__name">
          {name}
        </span>
        <span aria-hidden className="link-card__handle">
          {link.handle}
        </span>
        <span aria-hidden className="link-card__afford">
          ↗
        </span>
      </motion.a>
    );
  }

  return <CopyCard link={link} name={name} entry={entry} />;
}

function CopyCard({
  link,
  name,
  entry,
}: {
  link: Extract<ProfileLink, { kind: "copy" }>;
  name: string;
  entry: Record<string, unknown>;
}) {
  const t = useTranslations("links");
  const [state, setState] = useState<CopyState>("idle");
  const [nonce, setNonce] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const copy = async () => {
    const ok = await copyText(link.value);
    setState(ok ? "done" : "fail");
    setNonce((n) => n + 1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1600);
  };

  const message =
    state === "done" ? t("copied") : state === "fail" ? t("failed") : "";

  return (
    <motion.button
      type="button"
      onClick={copy}
      className={`link-card link-card--email${
        state === "done" ? " link-card--copied" : ""
      }${state === "fail" ? " link-card--failed" : ""}`}
      aria-label={`${name}, ${link.handle}, ${t("copy")}`}
      {...entry}
    >
      <span aria-hidden className="link-card__grain" />
      <span className="link-card__icon">
        <LinkIcon id={link.id} />
      </span>
      <span aria-hidden className="link-card__name">
        {name}
      </span>
      <span aria-hidden className="link-card__handle">
        {link.handle}
      </span>
      <span aria-hidden className="link-card__afford">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state}
            initial={{ opacity: 0, scale: 0.8, y: 2 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -2 }}
            transition={
              state === "idle"
                ? { duration: 0.12, ease: EASE }
                : { duration: 0.18, ease: [0.5, 1.8, 0.4, 1] }
            }
            style={{ display: "block" }}
          >
            {GLYPH[state]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span role="status" className="sr-only">
        {message ? message + "​".repeat(nonce % 2) : ""}
      </span>
    </motion.button>
  );
}
