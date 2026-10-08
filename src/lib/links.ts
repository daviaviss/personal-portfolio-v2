
const EMAIL = "daviaugustovissotto@gmail.com";

export type LinkId = "email" | "linkedin" | "github" | "instagram" | "whatsapp";

export type ProfileLink =
  | { kind: "copy"; id: LinkId; handle: string; value: string }
  | { kind: "link"; id: LinkId; handle: string; href: string };

export const LINKS: ProfileLink[] = [
  { kind: "copy", id: "email", handle: EMAIL, value: EMAIL },
  {
    kind: "link",
    id: "linkedin",
    handle: "/in/daviaviss",
    href: "https://linkedin.com/in/daviaviss",
  },
  {
    kind: "link",
    id: "github",
    handle: "@daviaviss",
    href: "https://github.com/daviaviss",
  },
  {
    kind: "link",
    id: "instagram",
    handle: "@daviaviss",
    href: "https://www.instagram.com/daviaviss/",
  },
  {
    kind: "link",
    id: "whatsapp",
    handle: "+55 48 98461-6370",
    href: "https://wa.me/5548984616370",
  },
];
