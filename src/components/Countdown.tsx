"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { WEDDING } from "@/lib/wedding";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="font-serif font-light tabular-nums leading-none text-ink"
        style={{ fontSize: "clamp(2.6rem, 13vw, 4.6rem)" }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 text-[11px] font-normal uppercase tracking-[0.28em] text-ink2/80 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <span
      className="self-start font-serif font-light leading-none text-roseaccent/70"
      style={{ fontSize: "clamp(2rem, 9vw, 3.4rem)", lineHeight: 1.1 }}
    >
      :
    </span>
  );
}

export default function Countdown() {
  const [t, setT] = useState(ZERO); // deterministic first render → no hydration mismatch

  useEffect(() => {
    setT(diff(WEDDING.targetDate));
    const id = setInterval(() => setT(diff(WEDDING.targetDate)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rosepale via-rosebglight to-rosebg py-24 md:py-32">
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="script text-ink/90" style={{ fontSize: "clamp(2.4rem, 9vw, 4rem)" }}>
            Two Souls, One Destiny
          </p>
          <p className="mx-auto mt-5 max-w-xl font-serif text-[17px] leading-relaxed text-ink2 md:text-lg">
            Dear friends and family — join us for a celebration of love,
            laughter and unforgettable memories as we begin our forever.
          </p>
          <div className="mx-auto mt-8 hairline" />
        </Reveal>

        <Reveal delay={0.1}>
          <p
            className="script mt-12 text-ink"
            style={{ fontSize: "clamp(2rem, 8vw, 3.4rem)" }}
          >
            The Celebration Begins In
          </p>
        </Reveal>

        <Reveal dir="scale" delay={0.15}>
          <div className="mx-auto mt-8 flex max-w-md items-start justify-center gap-3 sm:gap-5">
            <Unit value={t.days} label="Days" />
            <Colon />
            <Unit value={t.hours} label="Hours" />
            <Colon />
            <Unit value={t.minutes} label="Minutes" />
            <Colon />
            <Unit value={t.seconds} label="Seconds" />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="glass relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-roseline/30 shadow-md">
              <Image
                src="/images/venue.png"
                alt={WEDDING.venue}
                fill
                sizes="(max-width: 640px) 90vw, 448px"
                className="object-cover object-center"
              />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-serif text-lg font-medium text-ink">
                {WEDDING.venue}
              </p>
              <p className="max-w-xs font-serif text-sm text-ink2/90 sm:max-w-sm">
                {WEDDING.address}
              </p>
              <a
                href={WEDDING.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-roseline underline underline-offset-4 transition hover:text-ink"
              >
                Get Directions
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
