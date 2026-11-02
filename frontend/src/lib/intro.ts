"use client";
import { useSyncExternalStore } from "react";

/**
 * Tiny shared flag: the intro (counter -> say cheese -> photographer) flips it when it leaves,
 * and the header + hero start their entry animation from it.
 */
let done = false;
const listeners = new Set<() => void>();

export const markIntroDone = () => {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
};

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export const useIntroDone = () => useSyncExternalStore(subscribe, () => done, () => false);
