import { once } from "node:events";
import { createHmac } from "node:crypto";
import express from "express";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  installWhatsAppWebhookBodyParser,
  registerWhatsAppWebhookRoutes,
  WHATSAPP_WEBHOOK_PATH,
} from "./whatsappRoutes";
import type { WhatsAppConfig } from "./whatsappBot";

const config: WhatsAppConfig = {
  accessToken: "dummy-access-token",
  appSecret: "dummy-app-secret",
  phoneNumberId: "1234567890",
  verifyToken: "dummy-verify-token",
  publicSiteUrl: "https://manlung.example",
  graphApiVersion: "v27.0",
};

let activeServer: ReturnType<ReturnType<typeof express>["listen"]> | undefined;

afterEach(async () => {
  if (activeServer) {
    activeServer.close();
    await once(activeServer, "close");
    activeServer = undefined;
  }
});

async function startServer(
  dependencies: Parameters<typeof registerWhatsAppWebhookRoutes>[1]
) {
  const app = express();
  installWhatsAppWebhookBodyParser(app);
  app.use(express.json({ limit: "20kb" }));
  registerWhatsAppWebhookRoutes(app, dependencies);
  activeServer = app.listen(0, "127.0.0.1");
  await once(activeServer, "listening");
  const address = activeServer.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}${WHATSAPP_WEBHOOK_PATH}`;
}

function sign(body: string) {
  return `sha256=${createHmac("sha256", config.appSecret).update(body).digest("hex")}`;
}

describe("WhatsApp webhook routes", () => {
  it("returns the challenge only when mode and verify token match", async () => {
    const url = await startServer({ getConfig: () => config });
    const correct = await fetch(
      `${url}?hub.mode=subscribe&hub.verify_token=dummy-verify-token&hub.challenge=challenge-123`
    );
    expect(correct.status).toBe(200);
    expect(await correct.text()).toBe("challenge-123");

    const wrong = await fetch(
      `${url}?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=challenge-123`
    );
    expect(wrong.status).toBe(403);
  });

  it("remains disabled when configuration is missing", async () => {
    const url = await startServer({ getConfig: () => null });
    const response = await fetch(url);
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({
      error: "WhatsApp bot is not configured.",
    });
  });

  it("rejects invalid HMAC signatures before processing a webhook body", async () => {
    const processPayload = vi.fn(async () => {});
    const url = await startServer({ getConfig: () => config, processPayload });
    const body = JSON.stringify({
      object: "whatsapp_business_account",
      entry: [],
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hub-Signature-256": "sha256=bad",
      },
      body,
    });
    expect(response.status).toBe(401);
    expect(processPayload).not.toHaveBeenCalled();
  });

  it("accepts a valid signed callback and passes the parsed payload to the handler", async () => {
    const processPayload = vi.fn(async () => {});
    const url = await startServer({ getConfig: () => config, processPayload });
    const payload = { object: "whatsapp_business_account", entry: [] };
    const body = JSON.stringify(payload);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hub-Signature-256": sign(body),
      },
      body,
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
    expect(processPayload).toHaveBeenCalledWith(payload, config);
  });
});
