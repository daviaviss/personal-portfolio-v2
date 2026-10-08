import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALE_COOKIE,
  isLocale,
  matchLocale,
  type Locale,
} from "@/i18n/config";

const SITE = "https://daviaviss.me";

const NAME = "daviaviss";

const COPY = {
  pt: {
    shareTitle: "daviaviss — dev & entusiasta",
    description:
      "todos os meus links em um lugar. frontend com next, expo e react — florianópolis, br.",
  },
  en: {
    shareTitle: "daviaviss — dev & enthusiast",
    description:
      "all my links in one place. frontend with next, expo and react — florianópolis, br.",
  },
} as const;

async function readLocale(): Promise<Locale> {
  const chosen = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;

  const accept = (await headers()).get("accept-language");
  return matchLocale(accept) ?? DEFAULT_LOCALE;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await readLocale();
  const copy = COPY[locale];

  return {
    metadataBase: new URL(SITE),
    title: NAME,
    description: copy.description,
    alternates: { canonical: "/" },
    openGraph: {
      title: copy.shareTitle,
      description: copy.description,
      type: "website",
      url: SITE,
      locale: locale === "en" ? "en_US" : "pt_BR",
      siteName: "daviaviss",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.shareTitle,
      description: copy.description,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "light" ? "light" : "";
  const locale = await readLocale();

  return (
    <html lang={HTML_LANG[locale]} className="h-full" data-theme={theme}>
      <head>
        <noscript>
          <style>{'[style*="opacity:0"]{opacity:1 !important;transform:none !important}'}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <LocaleProvider initialLocale={locale}>
          <MotionProvider>{children}</MotionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
