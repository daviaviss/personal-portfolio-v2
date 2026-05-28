"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({
  variant = "primary",
  children,
  style,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--fs-caption)",
    letterSpacing: "var(--tracking-wide)",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    borderRadius: "var(--r-2)",
    transition: "all var(--dur-fast) var(--ease-out)",
    position: "relative",
    overflow: "hidden",
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--accent)",
      color: "var(--espresso-950)",
    },
    secondary: {
      background: "transparent",
      color: "var(--fg-2)",
      border: "1px solid var(--border)",
    },
    ghost: {
      background: "transparent",
      color: "var(--fg-3)",
    },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ ...base, ...variants[variant], ...style }}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
