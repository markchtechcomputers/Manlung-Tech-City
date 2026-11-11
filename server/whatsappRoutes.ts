import express, { type Express, type Request } from "express";
import {
  processWhatsAppWebhook,
  readWhatsAppConfig,
  verifyMetaWebhookSignature,
  verifyWebhookChallenge,
  type WhatsAppConfig,
} from "./whatsappBot";

export const WHATSAPP_WEBHOOK_PATH = "/api/whatsapp/webhook";

type RequestWithRawBody = Request & { rawBody?: Buffer };

export interface WhatsAppRouteDependencies {
  getConfig?: () => WhatsAppConfig | null;
  processPayload?: (payload: unknown, config: WhatsAppConfig) => Promise<void>;
}

/** Install before the general JSON parser so the exact body is available for HMAC verification. */
export function installWhatsAppWebhookBodyParser(app: Express): void {
  app.use(
    WHATSAPP_WEBHOOK_PATH,
    express.json({
      limit: "1mb",
      verify(request, _response, body) {
        (request as RequestWithRawBody).rawBody = Buffer.from(body);
      },
    })
  );
}

function singleQueryValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function registerWhatsAppWebhookRoutes(
  app: Express,
  dependencies: WhatsAppRouteDependencies = {}
): void {
  const getConfig = dependencies.getConfig ?? readWhatsAppConfig;
  const processPayload = dependencies.processPayload ?? processWhatsAppWebhook;

  app.get(WHATSAPP_WEBHOOK_PATH, (request, response) => {
    response.set("Cache-Control", "no-store");
    const config = getConfig();
    if (!config) {
      response.status(503).json({ error: "WhatsApp bot is not configured." });
      return;
    }

    const challenge = verifyWebhookChallenge(
      singleQueryValue(request.query["hub.mode"]),
      singleQueryValue(request.query["hub.verify_token"]),
      singleQueryValue(request.query["hub.challenge"]),
      config.verifyToken
    );
    if (!challenge) {
      response.status(403).type("text/plain").send("Forbidden");
      return;
    }
    response.status(200).type("text/plain").send(challenge);
  });

  app.post(WHATSAPP_WEBHOOK_PATH, async (request, response) => {
    response.set("Cache-Control", "no-store");
    const config = getConfig();
    if (!config) {
      response.status(503).json({ error: "WhatsApp bot is not configured." });
      return;
    }

    const rawBody = (request as RequestWithRawBody).rawBody;
    const signature = request.header("x-hub-signature-256");
    if (
      !rawBody ||
      !verifyMetaWebhookSignature(rawBody, signature, config.appSecret)
    ) {
      response.status(401).json({ error: "Invalid webhook signature." });
      return;
    }

    try {
      await processPayload(request.body, config);
      response.status(200).json({ received: true });
    } catch (error) {
      const status =
        typeof (error as { status?: unknown } | null)?.status === "number"
          ? (error as { status: number }).status
          : undefined;
      console.warn(
        "[WhatsApp] Webhook processing failed; message content and recipient were not logged.",
        status ? `Cloud API status ${status}` : "temporary service failure"
      );
      response
        .status(503)
        .json({ error: "Temporary webhook processing issue." });
    }
  });
}
