import pt from "@/messages/pt.json";
import en from "@/messages/en.json";

export const LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";

export const MESSAGES = { pt, en } as const;

export const HTML_LANG: Record<Locale, string> = { pt: "pt-BR", en: "en" };

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function matchLocale(acceptLanguage: string | null): Locale | null {
  if (!acceptLanguage) return null;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.slice(2)) : 1 };
    })
    .filter((e) => e.tag !== "" && !Number.isNaN(e.q) && e.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag === "*") return DEFAULT_LOCALE;
    const base = tag.split("-")[0];
    const hit = LOCALES.find((l) => l === base);
    if (hit) return hit;
  }

  return null;
}
