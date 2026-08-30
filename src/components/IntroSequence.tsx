"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { WEDDING } from "@/lib/wedding";

/**
 * Mobile-first cinematic opener built from real, separate envelope flap images
 * (cut from envelope-bg.png, seal & text removed):
 *
 *   flap-top.png    — top flap   (carries the roses)   — highest flap layer
 *   flap-bottom.png — bottom flap (carries the roses)  — below the top flap
 *   flap-left/right — small side flaps                 — below both
 *   seal.png        — wax seal                         — on top of everything
 *
 * On tap the seal is removed cleanly (no crack), then each flap SLIDES straight
 * outward and travels fully off-screen — small side flaps first & fast, the
 * large top/bottom flaps later & slower. No fading, no folding. Once every flap
 * has exited, the invitation card is revealed and dissolves into the live hero.
 */
export default function IntroSequence({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  const finish = () => {
    onComplete();
    const lenis = (window as unknown as { __lenis?: { start: () => void } })
      .__lenis;
    lenis?.start();
  };

  const skip = () => {
    finish();
    gsap.to(stageRef.current, {
      autoAlpha: 0,
      duration: 0.7,
      onComplete: () => {
        if (stageRef.current) stageRef.current.style.display = "none";
      },
    });
  };

  const open = () => {
    if (opened) return;
    setOpened(true);

    const exit = "power2.in"; // accelerate as the paper leaves the frame
    const tl = gsap.timeline();

    // 1) Remove the wax seal cleanly (a small lift — no crack/break).
    tl.to(sealRef.current, {
      y: -22,
      scale: 1.06,
      autoAlpha: 0,
      duration: 0.45,
      ease: "power2.out",
    }).to(hintRef.current, { autoAlpha: 0, y: 10, duration: 0.35 }, "<");

    // 2) Side flaps slide out FIRST and FAST (smallest pieces).
    tl.to(leftRef.current, { xPercent: -112, duration: 0.7, ease: exit }, "+=0.05")
      .to(
        rightRef.current,
        { xPercent: 112, duration: 0.7, ease: exit },
        "<+0.09" // never perfectly synced with the left flap
      );

    // 3) Top & bottom flaps follow — start later, move SLOWER (largest pieces).
    tl.to(topRef.current, { yPercent: -112, duration: 1.15, ease: exit }, "-=0.34")
      .to(bottomRef.current, { yPercent: 112, duration: 1.2, ease: exit }, "<+0.13");

    // 4) Envelope removed — card lifts toward the viewer, then we CROSS-DISSOLVE
    //    into the live hero: the moment the envelope starts fading, the hero is
    //    told to play its bloom entrance underneath, so the two motions blend
    //    into one continuous reveal (no blank seam, no static pop-in).
    tl.to(
      cardInnerRef.current,
      { scale: 1.1, duration: 1.4, ease: "power2.inOut" },
      "-=0.55"
    )
      .add(() => finish(), "-=0.6") // hand off to the hero entrance NOW
      .to(
        stageRef.current,
        { autoAlpha: 0, duration: 1.1, ease: "power2.inOut" },
        "<"
      )
      .set(stageRef.current, { display: "none" });
  };

  useEffect(() => {
    // gentle entrance for the sealed, fully-closed envelope
    gsap.fromTo(
      sceneRef.current,
      { autoAlpha: 0, scale: 1.05 },
      { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power3.out" }
    );
  }, []);

  // each flap = a full-screen layer showing its flap PNG (cover/centre, so all
  // four align perfectly and reconstruct the closed envelope)
  const flap = (
    img: string,
    z: number,
    shadow?: string
  ): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    zIndex: z,
    backgroundImage: `url(/images/${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: shadow,
    willChange: "transform",
  });

  return (
    <div
      ref={stageRef}
      onClick={open}
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer select-none"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 40%, #f7dcd6 0%, #e7b3ac 70%, #d49a92 100%)",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
        className="absolute right-4 top-4 z-[80] rounded-full border border-wine/40 bg-white/30 px-4 py-1.5 text-[13px] font-medium tracking-[0.2em] text-wine/80 backdrop-blur-sm transition hover:bg-white/50 cursor-pointer"
      >
        SKIP
      </button>

      <div ref={sceneRef} className="absolute inset-0">
        {/* invitation card underneath — matching Hero artwork & styling for seamless hand-off */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <div
            ref={cardInnerRef}
            className="intro-card-bg absolute inset-0 bg-cover"
          >
            {/* Desktop & Tablet (md, lg, xl): Centered text overlay matching Hero */}
            <div className="absolute inset-0 z-10 hidden flex-col items-center justify-between py-6 md:flex md:py-8 pointer-events-none">
              <div />
              <div className="my-auto text-center px-8 py-4 flex flex-col items-center justify-center">
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
              <div />
            </div>
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: "inset 0 0 140px rgba(159,122,117,0.32)" }}
          />
        </div>

        {/* RIGHT side flap — lowest layer */}
        <div
          ref={rightRef}
          style={flap(
            "flap-right.png",
            19,
            "drop-shadow(-3px 0 9px rgba(94,60,56,0.12))"
          )}
        />
        {/* LEFT side flap */}
        <div
          ref={leftRef}
          style={flap(
            "flap-left.png",
            20,
            "drop-shadow(3px 0 9px rgba(94,60,56,0.12))"
          )}
        />
        {/* BOTTOM flap — below the top flap. No edge shadow, so it reads as one
            continuous surface (removes the faint second seam under the main fold). */}
        <div ref={bottomRef} style={flap("flap-bottom.png", 30)} />
        {/* TOP flap — highest flap layer; the single, clean centre fold. */}
        <div
          ref={topRef}
          style={flap(
            "flap-top.png",
            40,
            "drop-shadow(0 5px 13px rgba(94,60,56,0.2))"
          )}
        />
      </div>

      {/* real wax seal — highest layer, on top of the closed flaps */}
      <div
        className="absolute left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2"
        style={{ animation: "introFloat 4.5s ease-in-out infinite" }}
      >
        <button
          ref={sealRef}
          onClick={open}
          aria-label="Open the invitation"
          className="seal-btn relative block"
          style={{
            width: "clamp(118px, 33vw, 188px)",
            aspectRatio: "1 / 1",
            cursor: "pointer",
          }}
        >
          <span
            className="block h-full w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/images/seal.png)" }}
          />
        </button>
      </div>

      {/* hint */}
      <div
        ref={hintRef}
        className="pointer-events-none absolute inset-x-0 bottom-[10vh] z-[60] text-center"
      >
        <div className="mx-auto mb-3 hairline" />
        <p className="text-[13px] font-medium tracking-[0.3em] text-wine/90">
          TAP ANYWHERE TO OPEN
        </p>
        <div className="mx-auto mt-3 hairline" />
      </div>

      <style jsx>{`
        .intro-card-bg {
          background-image: url(/images/card-bg.png);
          background-position: center center;
        }
        @media (min-width: 768px) {
          .intro-card-bg {
            background-image: url(/images/hero-scene.png);
            background-position: center 70%;
          }
        }
        .seal-btn {
          filter: drop-shadow(0 14px 26px rgba(77, 15, 26, 0.55));
          animation: sealGlow 3.2s ease-in-out infinite;
        }
        @keyframes sealGlow {
          0%,
          100% {
            filter: drop-shadow(0 14px 26px rgba(77, 15, 26, 0.55))
              drop-shadow(0 0 0 rgba(231, 205, 134, 0));
          }
          50% {
            filter: drop-shadow(0 14px 26px rgba(77, 15, 26, 0.55))
              drop-shadow(0 0 24px rgba(231, 205, 134, 0.75));
          }
        }
        @keyframes introFloat {
          0%,
          100% {
            transform: translate(-50%, -50%);
          }
          50% {
            transform: translate(-50%, calc(-50% - 11px));
          }
        }
      `}</style>
    </div>
  );
}
