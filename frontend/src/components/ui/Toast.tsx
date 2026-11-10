"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * A small floating message, bottom centre (the bottom corners hold the commission pill and the chat robot).
 * Rendered straight into <body>: inside an animated section a `fixed` box would be positioned against that
 * section instead of the screen. Disappears by itself, or when closed.
 */
export default function Toast({ show, onClose, children, seconds = 6 }: { show: boolean; onClose: () => void; children: ReactNode; seconds?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(onClose, seconds * 1000);
    return () => clearTimeout(id);
  }, [show, seconds, onClose]);
  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex justify-center px-4 sm:bottom-8">
      <AnimatePresence>
        {show && (
          <motion.div role="status" aria-live="polite"
            initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto relative flex max-w-[min(92vw,440px)] items-center gap-3 overflow-hidden rounded-full bg-ink py-3 pl-4 pr-3 text-sm text-paper shadow-[0_18px_50px_rgba(77,79,83,0.45)] ring-1 ring-paper/25">
            {children}
            <button onClick={onClose} aria-label="Close message" data-link className="ml-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-g300 transition-colors hover:bg-paper/15 hover:text-paper">×</button>
            {/* time left, as a thin mustard line */}
            <motion.span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent"
              initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: seconds, ease: "linear" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
