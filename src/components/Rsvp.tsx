import Reveal from "./Reveal";
import FloralCorner from "./FloralCorner";
import { WEDDING } from "@/lib/wedding";

const RSVP_CONTACTS = [
  { name: "Praveen - Sapna Parakh", phone: "+91 9414115928" },
];

const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=${encodeURIComponent(
  WEDDING.mapsUrl
)}`;

function Dots() {
  return (
    <div className="flex items-center justify-center gap-2 text-roseline/70" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="h-1 w-1 rounded-full bg-current" />
      ))}
    </div>
  );
}

export default function Rsvp() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rosebglight to-rosedark py-16 sm:pb-20 md:pb-28">
      <div className="mx-auto max-w-xl px-5 text-center sm:px-6">
        <p className="eyebrow text-[11px] sm:text-[12px]">Join the Celebration</p>
        <h2 className="script mt-2" style={{ fontSize: "clamp(2.1rem, 9vw, 3.8rem)" }}>
          RSVP
        </h2>
        <div className="mx-auto mt-5 hairline" />
      </div>

      <Reveal dir="scale" className="mx-auto mt-9 max-w-xl px-5 sm:mt-12 sm:px-6">
        <div className="glass relative overflow-hidden rounded-3xl p-5 pt-14 text-center sm:p-8 sm:pt-16 md:p-10 md:pt-16">
          <FloralCorner className="pointer-events-none absolute -left-4 -top-4 h-16 w-16 opacity-90 sm:-left-6 sm:-top-6 sm:h-24 sm:w-24" />
          <FloralCorner flip className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 opacity-90 sm:-right-6 sm:-top-6 sm:h-24 sm:w-24" />

          <div className="relative space-y-2">
            {RSVP_CONTACTS.map((c) => (
              <div key={c.name}>
                <p className="font-serif text-base font-medium text-ink sm:text-lg">{c.name}</p>
                <p className="font-sans text-sm tracking-[0.05em] text-ink2 sm:text-[15px]">{c.phone}</p>
              </div>
            ))}
          </div>

          <div className="my-6 flex justify-center sm:my-8">
            <Dots />
          </div>

          <h3 className="script gold-shimmer" style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}>
            Parakh Family
          </h3>
          <p className="mt-2 font-serif text-base italic text-ink2 sm:text-lg">
            Awaits Your Presence
          </p>

          <div className="my-6 flex justify-center sm:my-8">
            <Dots />
          </div>

          <p className="eyebrow text-[10px] sm:text-[11px]">Scan For Location</p>
          <div className="mx-auto mt-4 w-fit rounded-2xl border border-roseline/40 bg-white p-3 shadow-sm sm:p-4">
            <img
              src={qrCodeSrc}
              alt={`QR code linking to the wedding venue location: ${WEDDING.venue}, ${WEDDING.city}`}
              width={180}
              height={180}
              className="h-40 w-40 sm:h-44 sm:w-44"
              loading="lazy"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
