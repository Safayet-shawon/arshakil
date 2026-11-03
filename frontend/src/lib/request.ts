"use client";
import { useSyncExternalStore } from "react";

/** Which "Hire me as ..." card was clicked, so the contact form can pre-select it. */
let wanted = "";
const listeners = new Set<() => void>();

export const requestService = (service: string) => {
  wanted = service;
  listeners.forEach((l) => l());
};

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
export const useRequestedService = () => useSyncExternalStore(subscribe, () => wanted, () => "");
