"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const PETAL_COLORS = ["#f3c0bb", "#e9a8a2", "#f7d3ce", "#dd9aa0", "#f6c9cf"];

function Petal({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 50" className="h-full w-full">
      <defs>
        <linearGradient id={`p${color}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path
        d="M20 1 C 33 10, 38 30, 20 49 C 2 30, 7 10, 20 1 Z"
        fill={`url(#p${color})`}
      />
      <path
        d="M20 6 C 26 18, 24 34, 20 46"
        stroke={color}
        strokeOpacity="0.5"
        fill="none"
      />
    </svg>
  );
}

/** Rose petals falling, swaying and tumbling with the wind — infinite. */
export default function Petals({ count = 24 }: { count?: number }) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>(".petal");
    els.forEach((el, i) => {
      const reset = () => {
        gsap.set(el, {
          left: `${Math.random() * 100}vw`,
          top: "-8vh",
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.8,
          opacity: 0.7 + Math.random() * 0.3,
        });
        const dur = 9 + Math.random() * 10;
        const drift = (Math.random() - 0.5) * 30;
        gsap.to(el, {
          top: "110vh",
          left: `+=${drift}vw`,
          duration: dur,
          ease: "none",
          delay: Math.random() * 8 + i * 0.2,
          onComplete: reset,
        });
        gsap.to(el, {
          rotationZ: "+=" + (180 + Math.random() * 360),
          rotationY: "+=" + (180 + Math.random() * 540),
          duration: dur,
          ease: "none",
        });
        gsap.to(el, {
          x: "+=40",
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      };
      reset();
    });
  }, []);

  return (
    <div
      ref={layer}
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="petal absolute"
          style={{ width: "clamp(12px, 1.6vw, 24px)" }}
        >
          <Petal color={PETAL_COLORS[i % PETAL_COLORS.length]} />
        </div>
      ))}
    </div>
  );
}
