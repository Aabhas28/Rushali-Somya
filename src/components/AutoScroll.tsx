"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── Minimal Lenis surface ─────────────────────────────────────────────────────
interface LenisInstance {
  scrollTo: (
    target: number | string,
    opts?: { immediate?: boolean; force?: boolean; lock?: boolean }
  ) => void;
  start: () => void;
  stop:  () => void;
  /** The smooth animated scroll position (what's actually rendered). */
  animatedScroll: number;
  /** The raw DOM scroll position. */
  actualScroll:   number;
  /** Max scrollable distance. */
  limit: number;
  isStopped: boolean;
}

interface AutoScrollProps {
  introDone: boolean;
  defaultSpeed?: number; // px / second
}

const SPEEDS = [
  { label: "Slow",   value: 30  },
  { label: "Normal", value: 60  },
  { label: "Fast",   value: 120 },
];

function getLenis(): LenisInstance | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { __lenis?: LenisInstance }).__lenis;
}

export default function AutoScroll({
  introDone,
  defaultSpeed = 60,
}: AutoScrollProps) {
  const [playing,  setPlaying]  = useState(false);
  const [speed,    setSpeed]    = useState(defaultSpeed);
  const [finished, setFinished] = useState(false);
  const [visible,  setVisible]  = useState(false);

  // Mutable refs so the RAF closure always sees the freshest values
  const rafRef          = useRef<number | null>(null);
  const lastTimeRef     = useRef<number | null>(null);
  const speedRef        = useRef(speed);
  const playingRef      = useRef(false);
  const interactedRef   = useRef(false);
  const resumeTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { speedRef.current  = speed;   }, [speed]);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  // ── Show pill once intro is done ─────────────────────────────────────────
  useEffect(() => {
    if (!introDone) return;
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, [introDone]);

  // ── Core RAF loop ─────────────────────────────────────────────────────────
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

      // Initialise time on first frame
      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const current = lenis.animatedScroll;
      const limit   = lenis.limit;
      const next    = current + speedRef.current * dt;

      if (next >= limit) {
        // Reached the bottom
        lenis.scrollTo(limit, { immediate: true, force: true });
        stopLoop();
        setPlaying(false);
        setFinished(true);
        return;
      }

      // force:true bypasses the isStopped / isLocked guard inside Lenis
      lenis.scrollTo(next, { immediate: true, force: true });
      rafRef.current = requestAnimationFrame(tick);
    },
    [stopLoop]
  );

  // Start / stop the loop when playing state changes
  useEffect(() => {
    if (playing) {
      // Make sure Lenis is running (it starts in stop() state)
      const lenis = getLenis();
      if (lenis?.isStopped) lenis.start();
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      stopLoop();
    }
    return stopLoop;
  }, [playing, tick, stopLoop]);

  // ── Pause on user gesture ─────────────────────────────────────────────────
  const pauseForUser = useCallback(() => {
    if (!playingRef.current) return;

    interactedRef.current = true;
    setPlaying(false);
    stopLoop();

    // Auto-resume after 4 s of silence
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      if (interactedRef.current) {
        interactedRef.current = false;
        setPlaying(true);
      }
    }, 4000);
  }, [stopLoop]);

  useEffect(() => {
    window.addEventListener("wheel",     pauseForUser, { passive: true });
    window.addEventListener("touchmove", pauseForUser, { passive: true });
    window.addEventListener("keydown",   pauseForUser);
    return () => {
      window.removeEventListener("wheel",     pauseForUser);
      window.removeEventListener("touchmove", pauseForUser);
      window.removeEventListener("keydown",   pauseForUser);
    };
  }, [pauseForUser]);

  // ── Toggle button ─────────────────────────────────────────────────────────
  const togglePlay = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    interactedRef.current = false;

    if (finished) {
      // Scroll back to top, then restart
      const lenis = getLenis();
      lenis?.scrollTo(0, { immediate: false, force: true });
      setTimeout(() => {
        setFinished(false);
        setPlaying(true);
      }, 800);
      return;
    }

    setPlaying((p) => !p);
  };

  if (!visible) return null;

  // ── Pill UI ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: "fixed",
        // Safe-area aware — sits just above home indicator on iPhone
        bottom: "calc(max(env(safe-area-inset-bottom, 0px), 0.5rem) + 0.75rem)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "0.45rem",
        padding: "0.55rem 0.85rem",
        borderRadius: "9999px",
        background: "rgba(18, 7, 4, 0.85)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow:
          "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,190,160,0.14)",
        fontFamily: "'Inter', system-ui, sans-serif",
        userSelect: "none",
        whiteSpace: "nowrap",
        // Crucial on mobile: taps on the pill itself must NOT fire touchmove
        touchAction: "manipulation",
      }}
    >
      {/* "AUTO SCROLL" label */}
      <span
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,205,185,0.55)",
        }}
      >
        Auto Scroll
      </span>

      {/* vertical rule */}
      <span
        style={{
          display: "block",
          width: 1,
          height: "0.9rem",
          background: "rgba(255,255,255,0.14)",
          flexShrink: 0,
        }}
      />

      {/* ▶ / ⏸ / ↺ button */}
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause auto-scroll" : finished ? "Restart from top" : "Start auto-scroll"}
        style={{
          background: playing ? "rgba(255,150,90,0.25)" : "rgba(255,255,255,0.1)",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: playing ? "#ffbf96" : "#fff",
          transition: "background 0.2s, color 0.2s",
          flexShrink: 0,
          padding: 0,
        }}
      >
        {finished ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
        ) : playing ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>

      {/* Speed chips */}
      {SPEEDS.map((s) => (
        <button
          key={s.label}
          onClick={() => setSpeed(s.value)}
          style={{
            background:
              speed === s.value ? "rgba(255,150,90,0.22)" : "transparent",
            border: `1px solid ${
              speed === s.value ? "rgba(255,150,90,0.5)" : "rgba(255,255,255,0.12)"
            }`,
            borderRadius: "9999px",
            color:
              speed === s.value ? "#ffbf96" : "rgba(255,255,255,0.45)",
            cursor: "pointer",
            fontSize: "0.58rem",
            fontWeight: 500,
            letterSpacing: "0.04em",
            padding: "0.2rem 0.48rem",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
