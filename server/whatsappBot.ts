import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { whatsappWebhookEvents } from "../drizzle/schema";
import { getDb } from "./db";

export interface WhatsAppConfig {
  accessToken: string;
  appSecret: string;
  phoneNumberId: string;
  verifyToken: string;
  publicSiteUrl: string;
  graphApiVersion: string;
}

export interface IncomingWhatsAppMessage {
  id: string;
  from: string;
  type: string;
  text?: string;
  interactiveId?: string;
}

export interface WhatsAppOutgoingMessage {
  messaging_product: "whatsapp";
  recipient_type: "individual";
  to: string;
  type: "text" | "interactive";
  text?: { body: string; preview_url?: boolean };
  interactive?: {
    type: "list";
    body: { text: string };
    footer: { text: string };
    action: {
      button: string;
      sections: Array<{
        title: string;
        rows: Array<{ id: string; title: string; description: string }>;
      }>;
    };
  };
}

const DEFAULT_GRAPH_API_VERSION = "v27.0";
const WEBHOOK_EVENT_RETENTION_DAYS = 30;

function readString(
  env: Record<string, string | undefined>,
  key: string
): string {
  return env[key]?.trim() ?? "";
}

export function readWhatsAppConfig(
  env: Record<string, string | undefined> = process.env
): WhatsAppConfig | null {
  const accessToken = readString(env, "WHATSAPP_ACCESS_TOKEN");
  const appSecret = readString(env, "WHATSAPP_APP_SECRET");
  const phoneNumberId = readString(env, "WHATSAPP_PHONE_NUMBER_ID");
  const verifyToken = readString(env, "WHATSAPP_VERIFY_TOKEN");
  const publicSiteUrl = readString(env, "WHATSAPP_PUBLIC_SITE_URL");
  const graphApiVersion =
    readString(env, "WHATSAPP_GRAPH_API_VERSION") || DEFAULT_GRAPH_API_VERSION;

  if (
    !accessToken ||
    !appSecret ||
    !/^\d{5,40}$/.test(phoneNumberId) ||
    !verifyToken ||
    !/^v\d+\.\d+$/.test(graphApiVersion)
  ) {
    return null;
  }

  let parsedSiteUrl: URL;
  try {
    parsedSiteUrl = new URL(publicSiteUrl);
  } catch {
    return null;
  }

  if (
    parsedSiteUrl.protocol !== "https:" ||
    parsedSiteUrl.username ||
    parsedSiteUrl.password ||
    parsedSiteUrl.search ||
    parsedSiteUrl.hash ||
    parsedSiteUrl.pathname !== "/"
  ) {
    return null;
  }

  return {
    accessToken,
    appSecret,
    phoneNumberId,
    verifyToken,
    publicSiteUrl: parsedSiteUrl.origin,
    graphApiVersion,
  };
}

function constantTimeStringEqual(expected: string, provided: string): boolean {
  const expectedBytes = Buffer.from(expected, "utf8");
  const providedBytes = Buffer.from(provided, "utf8");
  if (!expectedBytes.length || expectedBytes.length !== providedBytes.length)
    return false;
  return timingSafeEqual(expectedBytes, providedBytes);
}

export function verifyWebhookChallenge(
  mode: unknown,
  verifyToken: unknown,
  challenge: unknown,
  expectedToken: string
): string | null {
  if (
    mode !== "subscribe" ||
    typeof verifyToken !== "string" ||
    typeof challenge !== "string" ||
    challenge.length === 0 ||
    challenge.length > 256 ||
    !constantTimeStringEqual(expectedToken, verifyToken)
  ) {
    return null;
  }
  return challenge;
}

export function verifyMetaWebhookSignature(
  rawBody: Uint8Array,
  signatureHeader: string | undefined,
  appSecret: string
): boolean {
  const match = /^sha256=([a-f\d]{64})$/i.exec(signatureHeader ?? "");
  if (!match || !appSecret) return false;

  const supplied = Buffer.from(match[1], "hex");
  const expected = createHmac("sha256", appSecret).update(rawBody).digest();
  return (
    supplied.length === expected.length && timingSafeEqual(supplied, expected)
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function nestedRecord(
  value: Record<string, unknown> | null,
  key: string
): Record<string, unknown> | null {
  return asRecord(value?.[key]);
}

export function extractIncomingWhatsAppMessages(
  payload: unknown
): IncomingWhatsAppMessage[] {
  const root = asRecord(payload);
  if (root?.object !== "whatsapp_business_account") return [];

  const output: IncomingWhatsAppMessage[] = [];
  const entries = Array.isArray(root.entry) ? root.entry : [];
  for (const entryValue of entries) {
    const entry = asRecord(entryValue);
    const changes = Array.isArray(entry?.changes) ? entry.changes : [];
    for (const changeValue of changes) {
      const change = asRecord(changeValue);
      if (change?.field !== "messages") continue;
      const value = nestedRecord(change, "value");
      const messages = Array.isArray(value?.messages) ? value.messages : [];
      for (const messageValue of messages) {
        const message = asRecord(messageValue);
        const id = typeof message?.id === "string" ? message.id : "";
        const from = typeof message?.from === "string" ? message.from : "";
        if (!id || id.length > 512 || !/^\d{7,20}$/.test(from)) continue;

        const type =
          typeof message?.type === "string" ? message.type : "unknown";
        const textContainer = nestedRecord(message, "text");
        const text =
          type === "text" && typeof textContainer?.body === "string"
            ? textContainer.body.slice(0, 2000)
            : undefined;
        const interactive = nestedRecord(message, "interactive");
        const listReply = nestedRecord(interactive, "list_reply");
        const buttonReply = nestedRecord(interactive, "button_reply");
        const replyId = listReply?.id ?? buttonReply?.id;
        const interactiveId =
          typeof replyId === "string" && replyId.length <= 200
            ? replyId
            : undefined;

        output.push({ id, from, type, text, interactiveId });
      }
    }
  }
  return output;
}

function pageLink(base: string, path: string): string {
  return new URL(path, base).toString();
}

function serviceRequestLink(
  base: string,
  slug: string,
  service?: string
): string {
  const url = new URL(`/services/${slug}`, base);
  if (service) url.searchParams.set("service", service);
  url.hash = `service-request-${slug}`;
  return url.toString();
}

function textMessage(to: string, body: string): WhatsAppOutgoingMessage {
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { body, preview_url: true },
  };
}

export function buildWhatsAppMenuMessage(
  recipient: string
): WhatsAppOutgoingMessage {
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipient,
    type: "interactive",
    interactive: {
      type: "list",
      body: {
        text: "Welcome to Manlung Tech City. Choose a service below. Karibu—chagua huduma hapa chini.",
      },
      footer: {
        text: "Independent assistance • Nairobi, Kenya",
      },
      action: {
        button: "Browse services",
        sections: [
          {
            title: "Services / Huduma",
            rows: [
              {
                id: "menu:government",
                title: "Government / Serikali",
                description: "eCitizen, Passport, Good Conduct, PWD, SHA, NTSA",
              },
              {
                id: "menu:kra",
                title: "KRA & iTax",
                description: "Tax and iTax assistance / Msaada wa kodi",
              },
              {
                id: "menu:cyber",
                title: "Cyber & IT support",
                description:
                  "Digital support and security help / Msaada wa kidijitali",
              },
              {
                id: "menu:courses",
                title: "Courses / Mafunzo",
                description: "Search cybersecurity courses / Tafuta mafunzo",
              },
              {
                id: "menu:review",
                title: "Review / Maoni",
                description: "Rate a completed service / Kadiria huduma",
              },
              {
                id: "menu:human",
                title: "Human help / Msaada",
                description:
                  "Continue with the Manlung team / Zungumza na timu",
              },
              {
                id: "menu:privacy",
                title: "Privacy / Faragha",
                description:
                  "Keep passwords and codes private / Linda siri zako",
              },
            ],
          },
        ],
      },
    },
  };
}

function governmentServicesMessage(to: string, base: string) {
  const tasks = [
    ["Passport", "Passport application guidance"],
    ["Good Conduct", "Police clearance / Good Conduct application guidance"],
    ["Good Conduct renewal", "Good Conduct certificate renewal inquiry"],
    [
      "PWD",
      "Persons with Disabilities (PWD) application / registration guidance",
    ],
    ["SHA", "SHA (Social Health Authority) registration guidance"],
    ["NTSA", "NTSA application guidance"],
  ] as const;
  const lines = tasks.map(
    ([label, task]) =>
      `${label}: ${serviceRequestLink(base, "government-e-services", task)}`
  );
  return textMessage(
    to,
    `Choose a government-service request / Chagua ombi la huduma za serikali:\n\n${lines.join("\n")}\n\nManlung provides independent guidance; you control your account and final official submission. Msaada ni wa kujitegemea; wewe ndiye unayekamilisha ombi rasmi.`
  );
}

function categoryMessage(
  to: string,
  base: string,
  selected: string
): WhatsAppOutgoingMessage {
  if (selected === "menu:government")
    return governmentServicesMessage(to, base);
  if (selected === "menu:kra")
    return textMessage(
      to,
      `Search or type your KRA/iTax task in the form / Tafuta au andika huduma ya KRA/iTax:\n${serviceRequestLink(base, "kra-itax-assistance")}\n\nNever share your KRA PIN or password in chat. Usitume PIN ya KRA wala nenosiri.`
    );
  if (selected === "menu:cyber")
    return textMessage(
      to,
      `Choose practical cybersecurity, tool setup, or digital support / Chagua usalama wa mtandao, usanidi wa zana, au msaada wa kidijitali:\n${pageLink(base, "/services/cybersecurity-support")}\n${pageLink(base, "/services/security-tool-setup")}\n${pageLink(base, "/services/it-digital-support")}`
    );
  if (selected === "menu:courses")
    return textMessage(
      to,
      `Browse all 30 courses and request one / Tazama kozi 30 na uchague moja:\n${pageLink(base, "/courses#course-request")}`
    );
  if (selected === "menu:review")
    return textMessage(
      to,
      `Share a private rating after your service / Toa maoni ya faragha baada ya huduma:\n${pageLink(base, "/review")}`
    );
  if (selected === "menu:human")
    return textMessage(
      to,
      `Reply with your question and the Manlung team can continue in this chat. If a person is not available, call +254 724 356 178 or use ${pageLink(base, "/contact")}.\n\nJibu kwa swali lako ili timu ya Manlung iendelee hapa. Ikiwa hakuna mtu, piga +254 724 356 178.`
    );
  if (selected === "menu:privacy") return textMessage(to, privacyReply());
  return textMessage(to, helpReply(base));
}

function privacyReply(): string {
  return "For your safety, never share passwords, one-time codes, full national ID numbers, bank details, or your KRA PIN here. Manlung will not request them in chat. Kwa usalama wako, usitume nenosiri, msimbo wa muda, nambari kamili ya kitambulisho, taarifa za benki, wala PIN ya KRA. Manlung haitakuomba taarifa hizo.";
}

function helpReply(base: string): string {
  return `Use .menu to browse services, .services for request links, .review to rate a completed service, .human for the team, or .privacy for safety guidance. Tumia .menu kuchagua huduma, .review kutoa maoni, .human kuzungumza na timu, au .privacy kwa usalama.\n${pageLink(base, "/services")}`;
}

function normalizeCommand(text: string | undefined): string {
  return (text ?? "")
    .trim()
    .toLowerCase()
    .replace(/^[.!/]+/, "")
    .split(/\s+/, 1)[0];
}

export function buildWhatsAppReply(
  message: IncomingWhatsAppMessage,
  publicSiteUrl: string
): WhatsAppOutgoingMessage {
  const selected = message.interactiveId?.toLowerCase();
  if (selected?.startsWith("menu:"))
    return categoryMessage(message.from, publicSiteUrl, selected);

  const command = normalizeCommand(message.text);
  if (
    !command ||
    ["hi", "hello", "hey", "habari", "mambo", "menu", "help"].includes(command)
  ) {
    return buildWhatsAppMenuMessage(message.from);
  }

  if (command === "services" || command === "service")
    return textMessage(
      message.from,
      `Browse all services and search the request form / Tazama huduma na utafute ombi lako:\n${pageLink(publicSiteUrl, "/services")}`
    );
  if (["gov", "government", "ecitizen"].includes(command))
    return governmentServicesMessage(message.from, publicSiteUrl);
  const directGovernmentTasks: Record<string, [string, string]> = {
    passport: ["Passport", "Passport application guidance"],
    goodconduct: [
      "Good Conduct renewal",
      "Good Conduct certificate renewal inquiry",
    ],
    good: ["Good Conduct renewal", "Good Conduct certificate renewal inquiry"],
    conduct: [
      "Good Conduct renewal",
      "Good Conduct certificate renewal inquiry",
    ],
    renewal: [
      "Good Conduct renewal",
      "Good Conduct certificate renewal inquiry",
    ],
    pwd: [
      "PWD application",
      "Persons with Disabilities (PWD) application / registration guidance",
    ],
    sha: [
      "SHA registration",
      "SHA (Social Health Authority) registration guidance",
    ],
    ntsa: ["NTSA services", "NTSA application guidance"],
  };
  if (directGovernmentTasks[command]) {
    const [label, task] = directGovernmentTasks[command];
    return textMessage(
      message.from,
      `Request ${label} guidance / Omba msaada wa ${label}:\n${serviceRequestLink(publicSiteUrl, "government-e-services", task)}\n\nManlung provides independent guidance; you control your final submission. Msaada ni wa kujitegemea; wewe unakamilisha ombi rasmi.`
    );
  }
  if (["kra", "itax", "tax"].includes(command))
    return categoryMessage(message.from, publicSiteUrl, "menu:kra");
  if (["cyber", "security", "it"].includes(command))
    return categoryMessage(message.from, publicSiteUrl, "menu:cyber");
  if (["courses", "course", "training"].includes(command))
    return categoryMessage(message.from, publicSiteUrl, "menu:courses");
  if (["review", "rating", "feedback"].includes(command))
    return categoryMessage(message.from, publicSiteUrl, "menu:review");
  if (["human", "agent", "person", "contact"].includes(command))
    return categoryMessage(message.from, publicSiteUrl, "menu:human");
  if (["privacy", "securitytips"].includes(command))
    return textMessage(message.from, privacyReply());
  if (["sw", "kiswahili"].includes(command))
    return textMessage(
      message.from,
      `Karibu Manlung Tech City. Tuma .menu kuona huduma, .services kutafuta huduma, .review kutoa maoni baada ya huduma, .human kuzungumza na timu, au .privacy kwa usalama.\n${pageLink(publicSiteUrl, "/services")}`
    );
  if (["en", "english"].includes(command))
    return textMessage(
      message.from,
      `Welcome to Manlung Tech City. Send .menu to browse, .services to find a task, .review to rate a completed service, .human to reach the team, or .privacy for safety guidance.\n${pageLink(publicSiteUrl, "/services")}`
    );

  return textMessage(
    message.from,
    `I can help with service links and request forms. Send .menu to choose a category or .human to reach the team. Ninaweza kusaidia kwa viungo na fomu za huduma. Tuma .menu kuchagua huduma au .human kuwasiliana na timu.\n${pageLink(publicSiteUrl, "/services")}`
  );
}

export function verifyWebhookMessageSignature(
  messageId: string,
  rawBody: Uint8Array,
  signature: string | undefined,
  appSecret: string
): boolean {
  void messageId;
  return verifyMetaWebhookSignature(rawBody, signature, appSecret);
}

export interface WhatsAppProcessingDependencies {
  pruneExpired: () => Promise<void>;
  claimMessage: (messageId: string) => Promise<boolean>;
  releaseMessage: (messageId: string) => Promise<void>;
  sendMessage: (
    config: WhatsAppConfig,
    message: WhatsAppOutgoingMessage
  ) => Promise<void>;
}

function duplicateKeyError(error: unknown): boolean {
  const value = error as {
    code?: unknown;
    cause?: { code?: unknown };
  } | null;
  return (
    value?.code === "ER_DUP_ENTRY" || value?.cause?.code === "ER_DUP_ENTRY"
  );
}

function hashMessageId(messageId: string): string {
  return createHash("sha256").update(messageId).digest("hex");
}

async function getDedupeDb() {
  const db = await getDb();
  if (!db) throw new Error("WhatsApp event store unavailable");
  return db;
}

export const productionWhatsAppProcessingDependencies: WhatsAppProcessingDependencies =
  {
    async pruneExpired() {
      const db = await getDedupeDb();
      const cutoff = new Date(
        Date.now() - WEBHOOK_EVENT_RETENTION_DAYS * 24 * 60 * 60 * 1000
      );
      await db
        .delete(whatsappWebhookEvents)
        .where(lt(whatsappWebhookEvents.processedAt, cutoff));
    },
    async claimMessage(messageId) {
      const db = await getDedupeDb();
      try {
        await db
          .insert(whatsappWebhookEvents)
          .values({ messageKey: hashMessageId(messageId) });
        return true;
      } catch (error) {
        if (duplicateKeyError(error)) return false;
        throw error;
      }
    },
    async releaseMessage(messageId) {
      const db = await getDedupeDb();
      await db
        .delete(whatsappWebhookEvents)
        .where(eq(whatsappWebhookEvents.messageKey, hashMessageId(messageId)));
    },
    async sendMessage(config, message) {
      await sendWhatsAppCloudMessage(config, message);
    },
  };

export async function processWhatsAppWebhook(
  payload: unknown,
  config: WhatsAppConfig,
  dependencies: WhatsAppProcessingDependencies = productionWhatsAppProcessingDependencies
): Promise<void> {
  const messages = extractIncomingWhatsAppMessages(payload);
  if (!messages.length) return;

  await dependencies.pruneExpired();
  for (const message of messages) {
    const claimed = await dependencies.claimMessage(message.id);
    if (!claimed) continue;
    const reply = buildWhatsAppReply(message, config.publicSiteUrl);
    try {
      await dependencies.sendMessage(config, reply);
    } catch (error) {
      await dependencies.releaseMessage(message.id);
      throw error;
    }
  }
}

export class WhatsAppApiError extends Error {
  constructor(public readonly status: number) {
    super(`WhatsApp Cloud API request failed with status ${status}`);
    this.name = "WhatsAppApiError";
  }
}

export async function sendWhatsAppCloudMessage(
  config: WhatsAppConfig,
  message: WhatsAppOutgoingMessage,
  fetcher: typeof fetch = fetch
): Promise<void> {
  const url = `https://graph.facebook.com/${config.graphApiVersion}/${encodeURIComponent(config.phoneNumberId)}/messages`;
  const response = await fetcher(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new WhatsAppApiError(response.status);
}
