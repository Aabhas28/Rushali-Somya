"use client";

import { useEffect, useRef, useCallback } from "react";

interface LenisInstance {
  scrollTo: (target: number, opts?: { immediate?: boolean; force?: boolean }) => void;
  start: () => void;
  animatedScroll: number;
  limit: number;
  isStopped: boolean;
}

function getLenis(): LenisInstance | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { __lenis?: LenisInstance }).__lenis;
}

const SPEED = 120; // px per second (fast)

export default function AutoScroll({ introDone }: { introDone: boolean }) {
  const rafRef      = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimeRef.current = null;
  }, []);

  const tick = useCallback(
    (now: number) => {
      const lenis = getLenis();
      if (!lenis) { stopLoop(); return; }

      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const dt   = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const next  = lenis.animatedScroll + SPEED * dt;
      const limit = lenis.limit;

      if (next >= limit) {
        lenis.scrollTo(limit, { immediate: true, force: true });
        stopLoop();
        return;
      }

      lenis.scrollTo(next, { immediate: true, force: true });
      rafRef.current = requestAnimationFrame(tick);
    },
    [stopLoop]
  );

  useEffect(() => {
    if (!introDone) return;

    // Small delay so the hero reveal animation settles first
    const startTimer = setTimeout(() => {
      const lenis = getLenis();
      if (lenis?.isStopped) lenis.start();
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    }, 1200);

    return () => {
      clearTimeout(startTimer);
      stopLoop();
    };
  }, [introDone, tick, stopLoop]);

  // Pause on user gesture, resume after 5 s of silence
  useEffect(() => {
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;

    const pause = () => {
      stopLoop();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        lastTimeRef.current = null;
        rafRef.current = requestAnimationFrame(tick);
      }, 5000);
    };

    window.addEventListener("wheel",     pause, { passive: true });
    window.addEventListener("touchmove", pause, { passive: true });
    window.addEventListener("keydown",   pause);

    return () => {
      window.removeEventListener("wheel",     pause);
      window.removeEventListener("touchmove", pause);
      window.removeEventListener("keydown",   pause);
      if (resumeTimer) clearTimeout(resumeTimer);
      stopLoop();
    };
  }, [tick, stopLoop]);

  return null; // no UI
}
