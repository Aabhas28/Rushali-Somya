"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";

const PHOTOS = [
  { src: "/images/story-1.png", pos: "50% 22%", cap: "Close to the Heart" },
  { src: "/images/story-2.png", pos: "50% 30%", cap: "Golden Hour Whispers" },
  { src: "/images/story-3.png", pos: "50% 35%", cap: "Twirling Into Forever" },
];

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative bg-gradient-to-b from-rosepale to-rosebglight py-24 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="eyebrow text-[12px]">Moments in Bloom</p>
        <h2 className="script mt-2" style={{ fontSize: "clamp(2.4rem, 9vw, 3.8rem)" }}>
          Our Story in Frames
        </h2>
        <div className="mx-auto mt-5 hairline" />
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 px-6 sm:grid-cols-3 sm:gap-4">
        {PHOTOS.map((p, i) => (
          <Reveal key={i} dir="scale" delay={i * 0.1}>
            <button
              onClick={() => setActive(i)}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl"
            >
              <div
                className="absolute inset-0 scale-105 bg-cover transition-transform duration-700 ease-out group-hover:scale-125"
                style={{ backgroundImage: `url(${p.src})`, backgroundPosition: p.pos }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-50 transition-opacity group-hover:opacity-80" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="font-serif text-base font-medium italic text-rosepale">
                  {p.cap}
                </span>
              </div>
              <span className="pointer-events-none absolute inset-3 rounded-xl border border-rosepale/0 transition-colors duration-500 group-hover:border-rosepale/60" />
            </button>
          </Reveal>
        ))}
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="relative max-h-[85vh] w-full max-w-md overflow-hidden rounded-2xl"
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="aspect-[3/4] w-full bg-cover"
                style={{
                  backgroundImage: `url(${PHOTOS[active].src})`,
                  backgroundPosition: PHOTOS[active].pos,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5 text-center">
                <span className="font-serif text-xl font-medium italic text-rosepale">
                  {PHOTOS[active].cap}
                </span>
              </div>
            </motion.div>
            <button
              className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full border border-rosepale/60 text-2xl text-rosepale"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
