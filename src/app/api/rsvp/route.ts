import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: { name?: string; attending?: string; guests?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 200);
  const attending = body.attending === "no" ? "no" : "yes";
  const guests = Math.min(10, Math.max(1, Number(body.guests) || 1));
  const note = (body.note ?? "").trim().slice(0, 1000);

  if (!name) {
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  }

  const webhookUrl = process.env.GOOGLE_SHEET_RSVP_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attending, guests, note }),
      });
      if (!res.ok) throw new Error(`Sheet webhook responded ${res.status}`);
    } catch (err) {
      console.error("RSVP webhook failed", err);
      return NextResponse.json(
        { ok: false, error: "Could not save your RSVP right now. Please try again shortly." },
        { status: 502 }
      );
    }
  } else {
    // Demo fallback when Google Sheet webhook is not configured yet
    console.log("RSVP Received (Demo Mode):", { name, attending, guests, note });
  }

  return NextResponse.json({ ok: true });
}
