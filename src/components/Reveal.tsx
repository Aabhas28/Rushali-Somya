"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Dir = "up" | "left" | "right" | "scale";

/** Scroll-triggered reveal wrapper — nothing on this site is static. */
export default function Reveal({
  children,
  dir = "up",
  delay = 0,
  className = "",
  y = 60,
}: {
  children: React.ReactNode;
  dir?: Dir;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const from: gsap.TweenVars = { opacity: 0 };
    if (dir === "up") from.y = y;
    if (dir === "left") from.x = -y;
    if (dir === "right") from.x = y;
    if (dir === "scale") from.scale = 0.85;

    const tween = gsap.fromTo(el, from, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [dir, delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
