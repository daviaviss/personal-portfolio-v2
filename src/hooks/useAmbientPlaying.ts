"use client";

import { useSyncExternalStore } from "react";
import { subscribeAmbient, isAmbientPlaying } from "@/lib/ambient";

export function useAmbientPlaying() {
  return useSyncExternalStore(subscribeAmbient, isAmbientPlaying, () => false);
}
