"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { MESSAGES, type Locale } from "@/i18n/config";
import { persistLocale } from "@/lib/locale";

interface LocaleContext {
  locale: Locale;
  setLocale: (next: Locale) => void;
}

const Ctx = createContext<LocaleContext | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    if (next === locale) return;
    persistLocale(next);
    setLocaleState(next);
  }, [locale]);

  return (
    <Ctx.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider
        locale={locale}
        messages={MESSAGES[locale]}
        timeZone="America/Sao_Paulo"
      >
        {children}
      </NextIntlClientProvider>
    </Ctx.Provider>
  );
}

export function useLocaleSwitch() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLocaleSwitch must be used inside LocaleProvider");
  return ctx;
}
