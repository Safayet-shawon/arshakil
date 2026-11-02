"use client";
import { useSyncExternalStore } from "react";

/**
 * Shared page-entry stage:
 *   0  intro is playing
 *   1  intro left: the hero shows "ARCHITECT SHAKHAOUTH HOSSAIN SHAKIL" (ARCHITECT in mustard)
 *   2  hero morphs ARCHITECT -> "AR."; portrait, text, socials and the header come in
 */
let stage = 0;
const listeners = new Set<() => void>();

export const advanceIntro = (to: 1 | 2) => {
  if (stage >= to) return;
  stage = to;
  listeners.forEach((l) => l());
};

/** Called by the intro as it fades out. */
export const markIntroDone = () => advanceIntro(1);

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
const useStage = () => useSyncExternalStore(subscribe, () => stage, () => 0);

export const useIntroDone = () => useStage() >= 1;
export const useHeroReady = () => useStage() >= 2;
