"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useIsLightTheme } from "@/hooks/useIsLightTheme";
import { toggleTheme } from "@/lib/theme";
import { useLocaleSwitch } from "@/components/providers/LocaleProvider";
import { HTML_LANG, LOCALES } from "@/i18n/config";

export function Chrome({ initialLight }: { initialLight: boolean }) {
  const t = useTranslations("actions");
  const tLocales = useTranslations("locales");
  const { locale, setLocale } = useLocaleSwitch();
  const isLight = useIsLightTheme(initialLight);

  return (
    <motion.div
      className="chrome"
      role="group"
      aria-label={t("prefs")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.1 }}
    >
      {LOCALES.map((loc, i) => {
        const active = loc === locale;
        return (
          <Fragment key={loc}>
            {i > 0 && (
              <span aria-hidden className="chrome__sep">
                /
              </span>
            )}
            <button
              type="button"
              className="chrome__btn"
              lang={HTML_LANG[loc]}
              onClick={() => setLocale(loc)}
              aria-current={active ? "true" : undefined}
              aria-disabled={active ? true : undefined}
              aria-label={
                active
                  ? undefined
                  : `${loc} — ${t("switchTo", { lang: tLocales(loc) })}`
              }
            >
              {loc}
            </button>
          </Fragment>
        );
      })}

      <button
        type="button"
        className="chrome__btn chrome__theme"
        onClick={toggleTheme}
        aria-label={isLight ? t("themeToDark") : t("themeToLight")}
      >
        <span aria-hidden>&#9681;</span>
      </button>
    </motion.div>
  );
}
