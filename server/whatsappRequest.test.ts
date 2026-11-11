import { describe, expect, it } from "vitest";
import {
  buildWhatsAppRequestUrl,
  WHATSAPP_BUSINESS_NUMBER,
} from "../client/src/data/whatsappRequest";

describe("buildWhatsAppRequestUrl", () => {
  it("encodes selected service and contact details for the configured business", () => {
    const url = new URL(
      buildWhatsAppRequestUrl({
        serviceCategory: "Government e-services",
        task: "Police clearance / Good Conduct renewal",
        name: "Amina Example",
        phone: "+254 712 345 678",
        email: "amina@example.com",
        details:
          "Need help understanding the next step.\nAvailable in the afternoon.",
      })
    );

    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe(`/${WHATSAPP_BUSINESS_NUMBER}`);
    expect(url.searchParams.get("text")).toContain(
      "Requested service/task: Police clearance / Good Conduct renewal"
    );
    expect(url.searchParams.get("text")).toContain("Name: Amina Example");
    expect(url.searchParams.get("text")).toContain(
      "WhatsApp number: +254 712 345 678"
    );
    expect(url.searchParams.get("text")).toContain("Email: amina@example.com");
    expect(url.searchParams.get("text")).toContain(
      "Available in the afternoon."
    );
  });

  it("omits an optional email when none is given", () => {
    const url = new URL(
      buildWhatsAppRequestUrl({
        serviceCategory: "KRA & iTax assistance",
        task: "PIN retrieval",
        name: "Example Person",
        phone: "+254700000000",
      })
    );

    expect(url.searchParams.get("text")).not.toContain("Email:");
  });
});
