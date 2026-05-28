"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useIsMobile } from "@/hooks/useIsMobile";

export function StatusLine() {
  const t = useTranslations("status");
  const locale = useLocale();
  const isMobile = useIsMobile();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString(locale === "pt" ? "pt-BR" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [locale]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        borderTop: "1px solid var(--border)",
        background: "var(--status-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "6px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--fs-micro)",
        letterSpacing: "var(--tracking-wider)",
        textTransform: "uppercase",
        color: "var(--fg-3)",
        userSelect: "none",
      }}
    >
      <span>
        <span style={{ color: "var(--accent)", marginRight: 8 }}>▸</span>
        daviaviss
        <span style={{ color: "var(--accent)" }}>/</span>
      </span>

      <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {!isMobile && (
          <>
            <span>{t("location")}</span>
            <span style={{ color: "var(--fg-3)" }}>|</span>
            <span>{t("available")}</span>
            <span style={{ color: "var(--fg-3)" }}>|</span>
          </>
        )}
        <span>
          {t("access")}: {time}
        </span>
      </span>
    </div>
  );
}
