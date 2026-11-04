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

/** The loader's progress, shared so the assistant robot can "charge" along with the count. */
let charge = { active: false, value: 0 };
const chargeListeners = new Set<() => void>();
export const setIntroCharge = (active: boolean, value: number) => {
  if (charge.active === active && charge.value === value) return;
  charge = { active, value };
  chargeListeners.forEach((l) => l());
};
export const getIntroCharge = () => charge;
const subscribeCharge = (cb: () => void) => { chargeListeners.add(cb); return () => { chargeListeners.delete(cb); }; };
const serverCharge = { active: false, value: 0 };
export const useIntroCharge = () => useSyncExternalStore(subscribeCharge, () => charge, () => serverCharge);

/** True once the intro has played in this tab (so it is skipped when you navigate back home). */
export const isIntroDone = () => done;

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export const useIntroDone = () => useSyncExternalStore(subscribe, () => done, () => false);
