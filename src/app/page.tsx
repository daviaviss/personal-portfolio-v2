import { cookies } from "next/headers";
import { Chrome } from "@/components/ui/Chrome";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Linktree } from "@/components/linktree/Linktree";
import { StatusLine } from "@/components/ui/StatusLine";

export default async function Home() {
  const isLight = (await cookies()).get("theme")?.value === "light";

  return (
    <>
      <CommandPalette />
      <Linktree />
      <Chrome initialLight={isLight} />
      <StatusLine />
    </>
  );
}
