import { Nav } from "@/components/nav/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Stack } from "@/components/sections/Stack";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Divider } from "@/components/ui/Divider";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { StatusLine } from "@/components/ui/StatusLine";

export default function Home() {
  return (
    <>
      <CommandPalette />
      <Nav />
      <main style={{ paddingBottom: 56 }}>
        <Hero />
        <Divider />
        <About />
        <Divider />
        <Stack />
        <Divider />
        <Experience />
        <Divider />
        <Projects />
        <Divider />
        <Contact />
      </main>
      <StatusLine />
    </>
  );
}
