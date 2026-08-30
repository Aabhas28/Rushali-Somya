"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import IntroSequence from "@/components/IntroSequence";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Timeline from "@/components/Timeline";
import Gallery from "@/components/Gallery";
import Rsvp from "@/components/Rsvp";
import Petals from "@/components/Petals";
import { WEDDING } from "@/lib/wedding";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <SmoothScroll>
      <main className="relative bg-rosebg">
        <Hero introDone={introDone} />
        <Countdown />
        <Timeline />
        <Gallery />
        <Rsvp />

        <footer className="relative bg-rosedark pb-16 text-center">
          <div className="mx-auto mb-6 hairline" />
          <p className="script text-ink" style={{ fontSize: "clamp(2.2rem, 8vw, 3.2rem)" }}>
            {WEDDING.coupleDisplay[0]} &amp; {WEDDING.coupleDisplay[1]}
          </p>
          <p className="mt-3 text-[12px] font-normal uppercase tracking-[0.25em] text-ink2">
            {WEDDING.dateShort} · {WEDDING.city}
          </p>
          <p className="mt-6 font-serif text-sm italic text-ink2/70">
            Made with love · {WEDDING.hashtag}
          </p>
        </footer>
      </main>

      {/* global falling rose petals */}
      <Petals />

      {/* opening cinematic — stays mounted so it can fade OVER the hero's bloom
          (it self-hides via display:none at the end of its own timeline) */}
      <IntroSequence onComplete={() => setIntroDone(true)} />
    </SmoothScroll>
  );
}
