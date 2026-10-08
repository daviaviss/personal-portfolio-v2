import { HTML_LANG, LOCALE_COOKIE, type Locale } from "@/i18n/config";

export function persistLocale(locale: Locale) {
  document.documentElement.lang = HTML_LANG[locale];
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}
