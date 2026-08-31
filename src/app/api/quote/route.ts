import { Resend } from "resend";
import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface QuotePayload {
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  eventTime?: string;
  eventType?: string;
  guestCount?: string;
  location?: string;
  notes?: string;
  cocktails: { name: string; variant?: string; tag: "Included" | "Extra" }[];
  addOns?: string[];
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — quote emails cannot be sent.");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const payload: QuotePayload = await request.json();

    const { phone, eventDate, eventTime, eventType, guestCount, location, notes, cocktails, addOns = [] } = payload;
    const name = payload.name?.trim();
    const email = payload.email?.trim();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    // Resend rejects the whole message with a 422 if replyTo is malformed,
    // which would lose the request entirely. Catch it here instead.
    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // ── Build HTML email ────────────────────────────────────────────────────

    const cocktailRows = cocktails.length
      ? cocktails
          .map(
            (c) => `
          <tr>
            <td style="padding:8px 12px;font-size:14px;color:#111;">
              ${c.name}${c.variant ? ` <span style="color:#888;">(${c.variant})</span>` : ""}
            </td>
            <td style="padding:8px 12px;font-size:13px;text-align:right;">
              <span style="background:${c.tag === "Included" ? "#D4A017" : "#111"};color:#fff;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.05em;">
                ${c.tag}
              </span>
            </td>
          </tr>`
          )
          .join("")
      : `<tr><td colspan="2" style="padding:8px 12px;font-size:14px;color:#888;">No cocktails selected</td></tr>`;

    const detailRow = (label: string, value?: string) =>
      value
        ? `<tr>
            <td style="padding:6px 0;font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.06em;width:140px;">${label}</td>
            <td style="padding:6px 0;font-size:14px;color:#111;">${value}</td>
          </tr>`
        : "";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#111;padding:32px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:.15em;color:#D4A017;text-transform:uppercase;font-family:monospace;">New Quote Request</p>
            <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-.01em;">Solamada</h1>
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="padding:32px 40px 0;">
            <p style="margin:0;font-size:16px;color:#111;">
              <strong>${name}</strong> submitted a quote request.
              ${email ? `Reply directly to <a href="mailto:${email}" style="color:#D4A017;">${email}</a>.` : ""}
            </p>
          </td>
        </tr>

        <!-- Event Details -->
        <tr>
          <td style="padding:28px 40px 0;">
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:.12em;color:#D4A017;text-transform:uppercase;font-family:monospace;">Event Details</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee;">
              ${detailRow("Name", name)}
              ${detailRow("Email", email)}
              ${detailRow("Phone", phone)}
              ${detailRow("Event Date", eventDate)}
              ${detailRow("Event Start Time", eventTime)}
              ${detailRow("Event Type", eventType)}
              ${detailRow("Guest Count", guestCount)}
              ${detailRow("Location", location)}
            </table>
          </td>
        </tr>

        <!-- Cocktail Selection -->
        <tr>
          <td style="padding:28px 40px 0;">
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:.12em;color:#D4A017;text-transform:uppercase;font-family:monospace;">Cocktail Selection</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;">
              ${cocktailRows}
            </table>
          </td>
        </tr>

        <!-- Add-ons -->
        ${
          addOns.length
            ? `<tr>
          <td style="padding:28px 40px 0;">
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:.12em;color:#D4A017;text-transform:uppercase;font-family:monospace;">Add-ons</p>
            <ul style="margin:0;padding:16px 16px 16px 32px;background:#f9f6f1;border-radius:8px;color:#111;font-size:14px;line-height:1.7;">
              ${addOns.map((addOn) => `<li>${addOn}</li>`).join("")}
            </ul>
          </td>
        </tr>`
            : ""
        }

        <!-- Notes -->
        ${
          notes
            ? `<tr>
          <td style="padding:28px 40px 0;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:.12em;color:#D4A017;text-transform:uppercase;font-family:monospace;">Additional Notes</p>
            <p style="margin:0;font-size:14px;color:#444;line-height:1.6;background:#f9f6f1;border-radius:8px;padding:16px;">${notes.replace(/\n/g, "<br>")}</p>
          </td>
        </tr>`
            : ""
        }

        <!-- Footer -->
        <tr>
          <td style="padding:32px 40px;margin-top:32px;border-top:1px solid #eee;margin-top:28px;">
            <p style="margin:0;font-size:12px;color:#aaa;text-align:center;">
              Solamada Mobile Bar &middot; Houston, TX &middot;
              <a href="mailto:hello@solamada.com" style="color:#D4A017;text-decoration:none;">hello@solamada.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ── Plain-text fallback ─────────────────────────────────────────────────

    const text = [
      `New Quote Request — Solamada`,
      ``,
      `From: ${name} <${email}>`,
      phone ? `Phone: ${phone}` : null,
      eventDate ? `Event Date: ${eventDate}` : null,
      eventTime ? `Event Start Time: ${eventTime}` : null,
      eventType ? `Event Type: ${eventType}` : null,
      guestCount ? `Guest Count: ${guestCount}` : null,
      location ? `Location: ${location}` : null,
      ``,
      `Cocktail Selection:`,
      ...cocktails.map((c) => `  • ${c.name}${c.variant ? ` (${c.variant})` : ""} — ${c.tag}`),
      addOns.length ? `\nAdd-ons:\n${addOns.map((addOn) => `  • ${addOn}`).join("\n")}` : null,
      notes ? `\nNotes:\n${notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    // ── Send via Resend ─────────────────────────────────────────────────────

    const { error } = await resend.emails.send({
      from: "Solamada Quotes <quotes@solamada.com>",
      to: ["hello@solamada.com", "luisdelgadom93@gmail.com"],
      replyTo: email,
      subject: `Quote Request — ${eventType || "Event"} · ${name}${eventDate ? ` · ${eventDate}` : ""}`,
      html,
      text,
    });

    if (error) {
      console.error("Resend error:", JSON.stringify(error));
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
