import type { Express } from "express";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { getDb } from "./db";
import { inquiries } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(30).optional().default(""),
  service: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(2500),
  consent: z.literal(true),
  website: z.string().max(200).optional().default(""),
});

const attempts = new Map<string, { count: number; until: number }>();
function canSubmit(email: string): boolean {
  const now = Date.now();
  if (attempts.size > 1000)
    for (const [key, value] of attempts)
      if (value.until <= now) attempts.delete(key);
  const key = createHash("sha256").update(email.toLowerCase()).digest("hex");
  const existing = attempts.get(key);
  if (!existing || existing.until <= now) {
    attempts.set(key, { count: 1, until: now + 15 * 60 * 1000 });
    return true;
  }
  if (existing.count >= 5) return false;
  existing.count += 1;
  return true;
}

export function registerLeadRoutes(app: Express) {
  app.post("/api/inquiries", async (req, res) => {
    res.set("Cache-Control", "no-store");
    const input = inquirySchema.safeParse(req.body);
    if (!input.success) {
      res
        .status(400)
        .json({
          error:
            "Please enter a valid name, email, service, and message, and accept the privacy notice.",
        });
      return;
    }
    if (input.data.website) {
      res.status(400).json({ error: "Unable to submit this inquiry." });
      return;
    }
    if (!canSubmit(input.data.email)) {
      res
        .status(429)
        .set("Retry-After", "900")
        .json({
          error:
            "Too many inquiries. Please try again later, or contact us directly on WhatsApp.",
        });
      return;
    }
    const reference = randomUUID();
    try {
      const db = await getDb();
      if (!db) throw new Error("Inquiry database unavailable");
      await db
        .insert(inquiries)
        .values({
          reference,
          name: input.data.name,
          email: input.data.email,
          phone: input.data.phone,
          service: input.data.service,
          message: input.data.message,
          consent: true,
        });
      res.status(201).json({ success: true, reference });
      // The durable inquiry is already saved. An alert failure must not turn a saved lead into an error.
      void notifyOwner({
        title: `New Manlung inquiry: ${input.data.service}`,
        content: `Reference: ${reference}\nName: ${input.data.name}\nEmail: ${input.data.email}\nPhone: ${input.data.phone || "Not provided"}\nService: ${input.data.service}\n\n${input.data.message}`,
      })
        .then(ok => {
          if (!ok)
            console.warn(
              "[Inquiry] Saved lead; owner notification was not accepted."
            );
        })
        .catch(() =>
          console.warn("[Inquiry] Saved lead; owner notification unavailable.")
        );
    } catch (error) {
      console.error(
        "[Inquiry] Unable to persist inquiry:",
        error instanceof Error ? error.message : "Unknown error"
      );
      res
        .status(503)
        .json({
          error:
            "Your inquiry was not saved. Please try again or contact us directly on WhatsApp or email.",
        });
    }
  });
}
