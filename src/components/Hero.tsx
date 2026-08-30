"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FountainCanvas from "./FountainCanvas";
import Doves from "./Doves";
import { WEDDING } from "@/lib/wedding";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Hero({ introDone = true }: { introDone?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  // Keep the hero hidden until the envelope finishes opening, so it can make a
  // proper cinematic entrance instead of just popping in fully-formed.
  useEffect(() => {
    if (introDone || !sectionRef.current) return;
    gsap.set(sectionRef.current, { autoAlpha: 0 });
  }, [introDone]);

  // Cinematic reveal the moment the intro completes (or immediately if skipped).
  useEffect(() => {
    if (!introDone || played.current || !sectionRef.current) return;
    played.current = true;

    const tl = gsap.timeline();
    // gentle fade + zoom-settle of the whole hero (the bg keeps its own scroll
    // parallax on a separate element, so there's no conflict here)
    tl.fromTo(
      sectionRef.current,
      { autoAlpha: 0, scale: 1.07 },
      { autoAlpha: 1, scale: 1, duration: 1.8, ease: "power2.out" }
    )
      // a soft rose veil that blooms away to reveal the art
      .fromTo(
        revealRef.current,
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 1.5, ease: "power2.out" },
        0
      )
      // overlay text rises in, staggered
      .fromTo(
        contentRef.current ? Array.from(contentRef.current.children) : [],
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.2 },
        0.55
      );
  }, [introDone]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // background parallax dolly
      gsap.to(bgRef.current, {
        yPercent: 18,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      // content fades as you scroll away
      gsap.to(contentRef.current, {
        opacity: 0,
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "30% top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-rosebg"
    >
      {/*
        Mobile (< sm): card-bg.png (with painted artwork text)
        Larger screens (sm, md, lg, xl): hero-scene.png with centered DOM text overlay from screenshot
      */}
      <div
        ref={bgRef}
        className="hero-bg-art absolute inset-0 bg-cover bg-center"
      />
      {/* gentle light wash so the overlay text reads without darkening the art */}
      <div className="absolute inset-0 bg-gradient-to-b from-rosepale/10 via-transparent to-rosebg/55" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 65% at 50% 38%, transparent 55%, rgba(159,122,117,0.18) 100%)",
        }}
      />

      {/* god-rays */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-[-30%] h-[160%] w-[14%] origin-top"
            style={{
              left: `${12 + i * 18}%`,
              transform: `rotate(${-8 + i * 4}deg)`,
              background:
                "linear-gradient(to bottom, rgba(255,240,200,0.22), rgba(255,240,200,0))",
              filter: "blur(8px)",
              animation: `rayPulse ${6 + i}s ease-in-out ${i * 0.6}s infinite`,
            }}
          />
        ))}
      </div>

      {/* three.js water + mist + pollen */}
      <FountainCanvas />

      {/* doves */}
      <Doves />

      {/* soft rose veil that blooms away on reveal */}
      <div
        ref={revealRef}
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, rgba(242,225,221,0.65) 0%, rgba(220,181,176,0.85) 60%, #dcb5b0 100%)",
        }}
      />

      {/* foreground content */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-between py-6 md:py-8"
      >
        {/* Mobile & Small Screens (< md): Untouched top label, letting card-bg.png display painted art */}
        <div className="text-center md:hidden">
          <p className="eyebrow text-[12px] font-semibold tracking-[0.4em] text-[#0e0e0e] drop-shadow-[0_1px_4px_rgba(255,255,255,0.95)]">
            TOGETHER WITH THEIR FAMILIES
          </p>
        </div>

        {/* Medium & Larger Screens (md, lg, xl): Centered invitation card with user-specified color palette */}
        <div className="my-auto hidden text-center px-8 py-4 md:flex md:flex-col md:items-center md:justify-center">
          <p className="eyebrow text-[12px] md:text-[14px] font-semibold tracking-[0.42em] text-[#0e0e0e] drop-shadow-[0_1px_4px_rgba(255,255,255,0.95)]">
            TOGETHER WITH THEIR FAMILIES
          </p>

          <p className="font-script mt-3 text-3xl md:text-4xl text-[#7A1835] leading-none drop-shadow-sm">
            Wedding Day
          </p>

          <div className="my-2 flex items-center justify-center gap-3 opacity-80">
            <span className="h-px w-12 md:w-16 bg-[#7A1835]/40" />
            <span className="text-[9px] text-[#7A1835]">◆</span>
            <span className="h-px w-12 md:w-16 bg-[#7A1835]/40" />
          </div>

          <p className="font-serif text-xl md:text-2xl font-light tracking-[0.2em] text-[#7A1835]">
            30/11/26
          </p>

          {/* Main Couple Names in Dark Antique Gold (#8A6418) Calligraphy */}
          <div className="mt-2 flex flex-col items-center leading-none">
            <h1 className="font-script py-0.5 text-6xl md:text-7xl lg:text-8xl text-[#8A6418] drop-shadow-[0_2px_10px_rgba(255,255,255,0.85)]">
              Somya
            </h1>

            <div className="my-1 flex items-center justify-center gap-3 opacity-85">
              <span className="h-px w-10 md:w-14 bg-[#1F2937]/40" />
              <span className="font-script text-2xl md:text-3xl italic text-[#1F2937]">
                &amp;
              </span>
              <span className="h-px w-10 md:w-14 bg-[#1F2937]/40" />
            </div>

            <h1 className="font-script py-0.5 text-6xl md:text-7xl lg:text-8xl text-[#8A6418] drop-shadow-[0_2px_10px_rgba(255,255,255,0.85)]">
              Rushali
            </h1>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mb-2 flex flex-col items-center gap-2 md:mb-4 md:gap-3">
          <div className="hairline" />
          <p className="font-serif text-lg font-medium italic tracking-wide text-ink md:text-[#1F2937]">
            {WEDDING.hashtag}
          </p>
          {/* scroll cue */}
          <div className="mt-2 flex flex-col items-center gap-2">
            <span className="text-[11px] tracking-[0.25em] text-ink2/80 md:text-[#1F2937]">
              SCROLL
            </span>
            <span className="relative block h-8 w-[1px] overflow-hidden bg-roseline/30 md:bg-[#1F2937]/30">
              <span className="absolute left-0 top-0 h-3 w-full animate-[scrollDot_1.8s_ease-in-out_infinite] bg-roseaccent md:bg-[#1F2937]" />
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-bg-art {
          background-image: url(/images/card-bg.png);
          background-position: center center;
          background-size: cover;
        }
        @media (min-width: 768px) {
          .hero-bg-art {
            background-image: url(/images/hero-scene.png);
            background-position: center 70%;
          }
        }
        @keyframes rayPulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.85;
          }
        }
        @keyframes scrollDot {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(300%);
          }
        }
      `}</style>
    </section>
  );
}
