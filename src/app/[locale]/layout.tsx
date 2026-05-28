import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "daviaviss",
  description: "construo interfaces no frontend — next, react, react native.",
  openGraph: {
    title: "daviaviss",
    description: "construo interfaces no frontend — next, react, react native.",
    type: "website",
    url: "https://daviaviss.me",
  },
  twitter: {
    card: "summary_large_image",
    title: "daviaviss",
    description: "construo interfaces no frontend — next, react, react native.",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "pt" | "en")) {
    notFound();
  }

  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "light" ? "light" : "";

  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full" data-theme={theme}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
