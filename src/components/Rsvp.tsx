"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import FloralCorner from "./FloralCorner";
import { WEDDING } from "@/lib/wedding";

type Status = "idle" | "sending" | "sent" | "error";

export default function Rsvp() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", guests: "1", attending: "yes", note: "" });
  const formId = useId();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const label = "block text-left text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] sm:tracking-[0.18em] text-ink2/80";
  const field =
    "mt-1.5 w-full rounded-xl border border-roseline/40 bg-white/70 px-3.5 py-2.5 sm:px-4 sm:py-3 font-sans text-sm sm:text-[15px] text-ink placeholder:text-ink2/45 outline-none transition focus:border-roseline focus:bg-white focus:ring-2 focus:ring-roseline/20";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rosebglight to-rosedark py-16 sm:pb-20 md:pb-28">
      <div className="mx-auto max-w-xl px-5 text-center sm:px-6">
        <p className="eyebrow text-[11px] sm:text-[12px]">Join the Celebration</p>
        <h2 className="script mt-2" style={{ fontSize: "clamp(2.1rem, 9vw, 3.8rem)" }}>
          Will You Be There?
        </h2>
        <div className="mx-auto mt-5 hairline" />
      </div>

      <Reveal dir="scale" className="mx-auto mt-9 max-w-xl px-5 sm:mt-12 sm:px-6">
        <div className="glass relative overflow-hidden rounded-3xl p-5 pt-14 sm:p-8 sm:pt-16 md:p-10 md:pt-16">
          <FloralCorner className="pointer-events-none absolute -left-4 -top-4 h-16 w-16 opacity-90 sm:-left-6 sm:-top-6 sm:h-24 sm:w-24" />
          <FloralCorner flip className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 opacity-90 sm:-right-6 sm:-top-6 sm:h-24 sm:w-24" />

          <AnimatePresence mode="wait">
            {status !== "sent" ? (
              <motion.form
                key="form"
                onSubmit={submit}
                className="relative space-y-4 sm:space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <div>
                  <label className={label} htmlFor={`${formId}-name`}>
                    Full Name
                  </label>
                  <input
                    id={`${formId}-name`}
                    required
                    placeholder="Your full name"
                    className={field}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
                  <div>
                    <label className={label} htmlFor={`${formId}-attending`}>
                      Response
                    </label>
                    <div className="relative mt-1.5">
                      <select
                        id={`${formId}-attending`}
                        className={`${field} mt-0 appearance-none pr-10 cursor-pointer`}
                        value={form.attending}
                        onChange={(e) => setForm({ ...form, attending: e.target.value })}
                      >
                        <option value="yes">Joyfully accepts</option>
                        <option value="no">Regretfully declines</option>
                      </select>
                      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink2/70">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={label} htmlFor={`${formId}-guests`}>
                      Guests
                    </label>
                    <input
                      id={`${formId}-guests`}
                      type="number"
                      min={1}
                      max={10}
                      className={`${field} sm:w-24`}
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className={label} htmlFor={`${formId}-note`}>
                    Note
                  </label>
                  <textarea
                    id={`${formId}-note`}
                    rows={3}
                    placeholder="A note for the couple…"
                    className={`${field} resize-none`}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>

                {status === "error" && (
                  <p className="rounded-lg bg-red-50 px-4 py-2 text-left font-sans text-[13px] text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="glow-btn mt-2 w-full rounded-xl py-3.5 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-rosepale disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-[12px] sm:tracking-[0.25em]"
                >
                  {status === "sending" ? "Sending…" : "Send RSVP"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="done"
                className="py-6 text-center sm:py-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <motion.div
                  className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border-2 border-roseline text-roseline"
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.15, type: "spring" }}
                >
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </motion.div>
                <h3 className="script" style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}>
                  Thank You, {form.name || "Dear Guest"}!
                </h3>
                <p className="mt-3 font-serif text-base text-ink2">
                  {form.attending === "yes"
                    ? `We can't wait to celebrate with you on ${WEDDING.dateShort}.`
                    : "You'll be dearly missed — thank you for letting us know."}
                </p>
                <p className="mt-4 font-serif text-base font-medium italic text-ink">
                  {WEDDING.hashtag}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>

      <style jsx>{`
        .glow-btn {
          background: linear-gradient(100deg, #9f7a75, #be9690, #9f7a75);
          background-size: 200% auto;
          box-shadow: 0 0 0 rgba(159, 122, 117, 0);
          transition: box-shadow 0.4s, background-position 0.6s;
          animation: btnShimmer 4s linear infinite;
        }
        .glow-btn:hover {
          box-shadow: 0 10px 28px 0 rgba(159, 122, 117, 0.5);
        }
        @keyframes btnShimmer {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </section>
  );
}
