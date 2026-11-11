import { describe, expect, it } from "vitest";
import {
  buildReviewEmailUrl,
  buildReviewMessage,
  buildReviewWhatsAppUrl,
} from "../client/src/data/reviewMessage";

describe("customer review message drafts", () => {
  const review = {
    service: "Government e-services — Good Conduct certificate renewal inquiry",
    rating: 5,
    feedback: "Friendly and clear help.",
    name: "Amina Example",
    email: "amina@example.com",
  };

  it("formats the service, rating and optional customer details in a WhatsApp draft", () => {
    const url = new URL(buildReviewWhatsAppUrl(review));
    const message = url.searchParams.get("text") || "";

    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/254724356178");
    expect(message).toContain("Service/task: Government e-services");
    expect(message).toContain("Rating: 5/5 stars");
    expect(message).toContain("Name: Amina Example");
    expect(message).toContain("Reply email: amina@example.com");
    expect(message).toContain("Feedback: Friendly and clear help.");
  });

  it("creates an email draft addressed to Manlung without transmitting it", () => {
    const href = buildReviewEmailUrl(review);
    const url = new URL(href);

    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("marklinochiengh@gmail.com");
    expect(url.searchParams.get("subject")).toContain("5/5 stars");
    expect(url.searchParams.get("body")).toContain("Friendly and clear help.");
  });

  it("omits optional identity details when the reviewer leaves them blank", () => {
    const message = buildReviewMessage({
      service: "KRA & iTax assistance",
      rating: 3,
      feedback: "Could be faster.",
    });

    expect(message).not.toContain("Name:");
    expect(message).not.toContain("Reply email:");
  });
});
