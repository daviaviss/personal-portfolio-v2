"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => obs.disconnect();
};

const getSnapshot = () =>
  document.documentElement.dataset.theme === "light";

export function useIsLightTheme(serverValue: boolean) {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}
