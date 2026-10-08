"use client";

import { Fragment } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Backdrop } from "@/components/linktree/Backdrop";
import { LinkCard } from "@/components/linktree/LinkCard";
import { LINKS } from "@/lib/links";
import { OPEN_PALETTE } from "@/lib/events";

const EASE = [0.2, 0.8, 0.2, 1] as [number, number, number, number];

const anim = (delay: number, y = 20, duration = 0.7) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: EASE },
});

export function Linktree() {
  const t = useTranslations("profile");
  const tl = useTranslations("links");
  const ta = useTranslations("actions");

  const bio = t.raw("bio") as string[];

  return (
    <main className="lt-main">
      <Backdrop />

      <div className="lt-col">
        <header className="lt-header">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            style={{ flexShrink: 0, lineHeight: 0 }}
          >
            <Image
              src="/icon-davi.jpg"
              alt={t("photoAlt")}
              width={144}
              height={144}
              priority
              className="lt-avatar"
            />
          </motion.div>

          <div className="lt-id">
            <motion.h1 className="lt-name" {...anim(0.28)}>
              {t("name")}
              <span aria-hidden>/</span>
            </motion.h1>
            <motion.p className="lt-bio" {...anim(0.4)}>
              {bio.map((part, i) => (
                <Fragment key={i}>
                  {i > 0 && <span className="lt-dot"> · </span>}
                  {part}
                </Fragment>
              ))}
            </motion.p>
          </div>
        </header>

        <motion.h2 className="lt-label" {...anim(0.52, 12, 0.5)}>
          <span aria-hidden style={{ color: "var(--accent)" }}>
            ▸
          </span>
          {tl("label")}
          <span aria-hidden className="lt-rule" />
        </motion.h2>

        <ul className="lt-links">
          {LINKS.map((link, i) => (
            <li key={link.id}>
              <LinkCard link={link} index={i} />
            </li>
          ))}
        </ul>

        <motion.button
          type="button"
          className="lt-hint"
          onClick={() => document.dispatchEvent(new CustomEvent(OPEN_PALETTE))}
          aria-haspopup="dialog"
          aria-keyshortcuts="Meta+K Control+K"
          aria-label={ta("palette")}
          {...anim(1.02, 12, 0.5)}
        >
          <kbd aria-hidden>⌘+K</kbd>
          <span aria-hidden>{ta("palette")}</span>
        </motion.button>
      </div>
    </main>
  );
}
