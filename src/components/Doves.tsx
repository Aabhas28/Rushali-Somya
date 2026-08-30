"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/** A single dove silhouette whose wings flap via CSS. */
function Dove({ id }: { id: number }) {
  return (
    <svg viewBox="0 0 120 70" className="dove h-full w-full drop-shadow-sm">
      <g fill="#fffaf6">
        <ellipse cx="64" cy="40" rx="26" ry="9" />
        <circle cx="92" cy="34" r="7" />
        <path d="M97 32 l9 -3 -7 6 z" fill="#e7cd86" />
        <path d="M42 41 q-22 6 -34 -4 q20 -2 34 -2z" opacity="0.95" />
        {/* flapping wings */}
        <path
          className="wing-up"
          d="M58 38 q4 -30 -20 -34 q14 18 6 34z"
          style={{ transformOrigin: "58px 38px" }}
        />
        <path
          className="wing-down"
          d="M70 42 q6 22 -16 28 q12 -16 4 -28z"
          style={{ transformOrigin: "70px 42px" }}
        />
      </g>
    </svg>
  );
}

export default function Doves() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>(".dove-wrap");
    const flights: gsap.core.Tween[] = [];

    els.forEach((el, i) => {
      const fly = () => {
        const fromLeft = Math.random() > 0.5;
        const depth = 0.5 + Math.random() * 0.9; // size / speed
        const yStart = 6 + Math.random() * 46; // vh
        const yDrift = (Math.random() - 0.5) * 18;
        const dur = (14 + Math.random() * 12) / depth;

        gsap.set(el, {
          scale: depth,
          opacity: 0.65 + depth * 0.3,
          top: `${yStart}vh`,
          left: fromLeft ? "-12vw" : "112vw",
          scaleX: fromLeft ? depth : -depth,
        });

        const tw = gsap.to(el, {
          left: fromLeft ? "112vw" : "-12vw",
          top: `${yStart + yDrift}vh`,
          duration: dur,
          ease: "none",
          delay: Math.random() * 6 + i * 1.5,
          onComplete: fly,
        });
        // gentle bobbing
        gsap.to(el, {
          y: "+=20",
          duration: 1.6 + Math.random(),
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        flights.push(tw);
      };
      fly();
    });

    return () => flights.forEach((f) => f.kill());
  }, []);

  return (
    <div ref={layer} className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="dove-wrap absolute"
          style={{ width: "clamp(46px, 7vw, 96px)" }}
        >
          <Dove id={i} />
        </div>
      ))}
      <style jsx>{`
        :global(.wing-up) {
          animation: flapUp 0.55s ease-in-out infinite;
        }
        :global(.wing-down) {
          animation: flapDown 0.55s ease-in-out infinite;
        }
        @keyframes flapUp {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-26deg);
          }
        }
        @keyframes flapDown {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(22deg);
          }
        }
      `}</style>
    </div>
  );
}
