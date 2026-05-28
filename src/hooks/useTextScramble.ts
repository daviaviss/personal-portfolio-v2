"use client";

import { useEffect, useRef, useState } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-+=<>[]{}|";

export function useTextScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;

    let iteration = 0;
    const totalFrames = text.length * 3;

    cancelAnimationFrame(rafRef.current);

    const update = () => {
      const resolved = Math.floor(iteration / 3);
      const scrambled = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < resolved) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplay(scrambled);
      iteration++;

      if (iteration < totalFrames + text.length) {
        rafRef.current = requestAnimationFrame(update);
      } else {
        setDisplay(text);
      }
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, text]);

  return display;
}
