"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EVENTS } from "@/lib/wedding";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Timeline() {
  const root = useRef<HTMLDivElement>(null);
  const rose = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = root.current!;
      const flower = rose.current!;

      // The rose slides from the very top of the timeline down to the bottom,
      // scrubbed to scroll. The filled line follows just behind it.
      const travel = () => track.offsetHeight - flower.offsetHeight;

      gsap.set(flower, { y: 0 });
      gsap.to(flower, {
        y: travel,
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top 60%",
          end: "bottom 65%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      gsap.set(progress.current, { scaleY: 0, transformOrigin: "top" });
      gsap.to(progress.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top 60%",
          end: "bottom 65%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".tl-row").forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 26,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 85%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-rosebg via-rosebglight to-rosepale pb-2 md:pb-12">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="eyebrow text-[12px]">The Celebrations</p>
        <h2 className="script mt-2" style={{ fontSize: "clamp(2.6rem, 10vw, 4.2rem)" }}>
          Schedule of Events
        </h2>
        <div className="mx-auto mt-5 hairline" />
      </div>

      <div
        ref={root}
        className="relative mx-auto mt-14 max-w-xl px-6 pb-4"
      >
        {/* center line — faint full track + filled progress behind the rose */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-roseline/25" />
        <div
          ref={progress}
          className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-roseline/70"
        />

        {/* sliding rose — a real bloom that travels down the centre line */}
        <div
          ref={rose}
          className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2"
          style={{ filter: "drop-shadow(0 7px 14px rgba(94,60,56,0.28))" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/rose-bloom.png"
            alt=""
            className="h-12 w-12 select-none md:h-16 md:w-16"
            draggable={false}
          />
        </div>

        <div className="flex flex-col">
          {EVENTS.map((e) => (
            <div
              key={e.title}
              className="tl-row relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-8 sm:gap-8"
            >
              {/* time (left) */}
              <div className="pr-4 text-right sm:pr-8">
                <p className="font-serif text-xl font-medium leading-tight text-ink sm:text-2xl">
                  {e.time}
                </p>
              </div>

              {/* diamond marker on the line */}
              <span className="z-10 h-2.5 w-2.5 rotate-45 rounded-[2px] border border-roseline bg-rosepale" />

              {/* title + desc (right) */}
              <div className="pl-4 text-left sm:pl-8">
                <p className="font-serif text-lg font-medium leading-tight text-ink sm:text-xl">
                  {e.title}
                </p>
                <p className="mt-1 font-serif text-sm leading-snug text-ink2/85">
                  {e.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
