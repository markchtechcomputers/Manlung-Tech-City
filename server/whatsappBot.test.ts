import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  buildWhatsAppMenuMessage,
  buildWhatsAppReply,
  extractIncomingWhatsAppMessages,
  processWhatsAppWebhook,
  readWhatsAppConfig,
  verifyMetaWebhookSignature,
  verifyWebhookChallenge,
  type IncomingWhatsAppMessage,
  type WhatsAppConfig,
  type WhatsAppOutgoingMessage,
} from "./whatsappBot";

const config: WhatsAppConfig = {
  accessToken: "dummy-access-token",
  appSecret: "dummy-app-secret",
  phoneNumberId: "1234567890",
  verifyToken: "dummy-verify-token",
  publicSiteUrl: "https://manlung.example",
  graphApiVersion: "v27.0",
};

const inbound: IncomingWhatsAppMessage = {
  id: "wamid.test-message-1",
  from: "254700123456",
  type: "text",
  text: ".passport",
};

function envelope(messages: Array<Record<string, unknown>>) {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            field: "messages",
            value: { messages },
          },
        ],
      },
    ],
  };
}

describe("WhatsApp Cloud API scaffold", () => {
  it("remains disabled unless all server settings and an HTTPS public origin are configured", () => {
    expect(readWhatsAppConfig({})).toBeNull();
    const good = {
      WHATSAPP_ACCESS_TOKEN: "dummy-token",
      WHATSAPP_APP_SECRET: "dummy-secret",
      WHATSAPP_PHONE_NUMBER_ID: "123456789",
      WHATSAPP_VERIFY_TOKEN: "dummy-verify",
      WHATSAPP_PUBLIC_SITE_URL: "https://manlung.example",
    };
    expect(readWhatsAppConfig(good)).toMatchObject({
      publicSiteUrl: "https://manlung.example",
      graphApiVersion: "v27.0",
    });
    expect(
      readWhatsAppConfig({
        ...good,
        WHATSAPP_PUBLIC_SITE_URL: "http://internal",
      })
    ).toBeNull();
  });

  it("validates the Meta challenge and compares the verify token safely", () => {
    expect(
      verifyWebhookChallenge(
        "subscribe",
        "dummy-verify-token",
        "8675309",
        config.verifyToken
      )
    ).toBe("8675309");
    expect(
      verifyWebhookChallenge(
        "subscribe",
        "wrong",
        "8675309",
        config.verifyToken
      )
    ).toBeNull();
    expect(
      verifyWebhookChallenge(
        "unsubscribe",
        config.verifyToken,
        "8675309",
        config.verifyToken
      )
    ).toBeNull();
  });

  it("verifies HMAC-SHA256 over the exact raw bytes", () => {
    const body = Buffer.from('{"sample":"exact bytes"}', "utf8");
    const signature = `sha256=${createHmac("sha256", config.appSecret).update(body).digest("hex")}`;
    expect(verifyMetaWebhookSignature(body, signature, config.appSecret)).toBe(
      true
    );
    expect(
      verifyMetaWebhookSignature(
        Buffer.from('{"sample":"changed"}'),
        signature,
        config.appSecret
      )
    ).toBe(false);
    expect(verifyMetaWebhookSignature(body, undefined, config.appSecret)).toBe(
      false
    );
  });

  it("extracts only inbound messages and ignores status-only webhook updates", () => {
    const messages = extractIncomingWhatsAppMessages(
      envelope([
        {
          id: "wamid.message-1",
          from: "254700123456",
          type: "text",
          text: { body: ".review" },
        },
        {
          id: "wamid.invalid",
          from: "bad",
          type: "text",
          text: { body: "hello" },
        },
      ])
    );
    expect(messages).toEqual([
      {
        id: "wamid.message-1",
        from: "254700123456",
        type: "text",
        text: ".review",
        interactiveId: undefined,
      },
    ]);
    expect(
      extractIncomingWhatsAppMessages({
        object: "whatsapp_business_account",
        entry: [
          {
            changes: [
              {
                field: "messages",
                value: { statuses: [{ id: "wamid.sent" }] },
              },
            ],
          },
        ],
      })
    ).toEqual([]);
  });

  it("builds an interactive bilingual service menu within Meta's list limits", () => {
    const menu = buildWhatsAppMenuMessage("254700123456");
    expect(menu.type).toBe("interactive");
    const rows =
      menu.interactive?.action.sections.flatMap(section => section.rows) ?? [];
    expect(rows.length).toBeLessThanOrEqual(10);
    expect(rows.map(row => row.id)).toContain("menu:government");
    expect(menu.interactive?.body.text).toContain("Karibu");
  });

  it("links specific public-service tasks to the matching searchable request form", () => {
    const passport = buildWhatsAppReply(inbound, config.publicSiteUrl);
    const passportUrl = passport.text?.body.match(
      /https:\/\/manlung\.example\/services\/[^\s]+/
    )?.[0];
    expect(passport.type).toBe("text");
    expect(passportUrl).toBeTruthy();
    expect(new URL(passportUrl!).searchParams.get("service")).toBe(
      "Passport application guidance"
    );
    expect(passport.text?.body).not.toContain(inbound.from);

    const renewal = buildWhatsAppReply(
      { ...inbound, text: ".goodconduct" },
      config.publicSiteUrl
    );
    const renewalUrl = renewal.text?.body.match(
      /https:\/\/manlung\.example\/services\/[^\s]+/
    )?.[0];
    expect(new URL(renewalUrl!).searchParams.get("service")).toBe(
      "Good Conduct certificate renewal inquiry"
    );
  });

  it("routes interactive selections to service pages, reviews, and a human contact option", () => {
    const selected: IncomingWhatsAppMessage = {
      ...inbound,
      text: undefined,
      type: "interactive",
      interactiveId: "menu:review",
    };
    expect(
      buildWhatsAppReply(selected, config.publicSiteUrl).text?.body
    ).toContain("https://manlung.example/review");
    expect(
      buildWhatsAppReply(
        { ...selected, interactiveId: "menu:kra" },
        config.publicSiteUrl
      ).text?.body
    ).toContain("kra-itax-assistance");
    expect(
      buildWhatsAppReply(
        { ...selected, interactiveId: "menu:human" },
        config.publicSiteUrl
      ).text?.body
    ).toContain("+254 724 356 178");
  });

  it("deduplicates the same provider message ID and releases it after a failed send", async () => {
    const seen = new Set<string>();
    const delivered: WhatsAppOutgoingMessage[] = [];
    const dependencies = {
      pruneExpired: vi.fn(async () => {}),
      claimMessage: vi.fn(async (id: string) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      }),
      releaseMessage: vi.fn(async (id: string) => {
        seen.delete(id);
      }),
      sendMessage: vi.fn(
        async (_config: WhatsAppConfig, message: WhatsAppOutgoingMessage) => {
          delivered.push(message);
        }
      ),
    };
    const payload = envelope([
      {
        id: inbound.id,
        from: inbound.from,
        type: "text",
        text: { body: ".menu" },
      },
    ]);

    await processWhatsAppWebhook(payload, config, dependencies);
    await processWhatsAppWebhook(payload, config, dependencies);
    expect(delivered).toHaveLength(1);

    dependencies.sendMessage.mockRejectedValueOnce(
      new Error("simulated failure")
    );
    const secondPayload = envelope([
      {
        id: "wamid.test-message-2",
        from: inbound.from,
        type: "text",
        text: { body: ".menu" },
      },
    ]);
    await expect(
      processWhatsAppWebhook(secondPayload, config, dependencies)
    ).rejects.toThrow("simulated failure");
    expect(dependencies.releaseMessage).toHaveBeenCalledWith(
      "wamid.test-message-2"
    );
  });
});
