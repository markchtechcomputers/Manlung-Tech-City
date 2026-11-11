# Manlung Tech City

A Kenya-focused technology, cyber café and digital-services website built with React, TypeScript, Express and MySQL. Public pages are prerendered at build time and hydrated in the browser. The website includes secure, server-validated lead capture plus independent service-request forms that prepare customer-approved WhatsApp messages.

## Public website

The site contains seven service groups, all 30 supplied cybersecurity courses, three resource articles, company/contact/privacy/terms pages, and a private feedback page. The `/services` directory and each service-detail page offer a searchable service/task request form. Course cards preselect the chosen course, and the contact page offers the all-services form. Customer-supplied eCitizen, KRA and SHA logos and Cyber Security artwork are stored locally in `client/public/images/`; their URLs and placement are recorded in `notes/service-logo-sources.md`. The original standard WhatsApp mark remains on the floating contact and request buttons; `client/public/images/whatsapp-bot.svg` is reserved for the separate bot-hosting service identity.

A service form assembles the chosen service, task, name, WhatsApp number, optional email and optional details into a message draft for +254 724 356 178. It opens WhatsApp, but nothing is sent until the customer reviews the draft and taps Send. These drafts are not stored by the website. `/review` lets a customer rate a completed service and send private feedback using a WhatsApp or email draft; reviews are not saved, publicly displayed or followed up automatically. The business can share the review link manually after completion.

Government and tax assistance are independent guidance, not government services or official affiliation. The visitor keeps control of all government accounts and final submissions. The site does not request passwords, one-time codes, national ID numbers, KRA PINs or sensitive documents in the service and review forms.

## WhatsApp bot scaffold

`server/whatsappBot.ts` and `server/whatsappRoutes.ts` implement a server-side scaffold for Meta's official WhatsApp Business Cloud API. It provides a verified GET challenge, HMAC-SHA256 verification of the exact raw POST body, a bilingual interactive service menu, task-specific links, privacy guidance, review links and a human-contact path. Webhook IDs are hashed for duplicate suppression and retained for at most 30 days; message text and sender phone numbers are not stored by the bot logic. Automated post-service contact is not implemented: a real follow-up needs a service-completion signal, recipient opt-in, and Meta-compliant messaging templates outside the customer-service window.

The site offers WhatsApp bot hosting and deployment as a separate service engagement. Production activation depends on the customer's own Meta Business onboarding, eligible phone number, approved access and credentials; platform fees and the hosting/support plan are scoped separately. The public request form warns customers not to enter API keys, tokens or app secrets.

**The site's bot is not active or deployed.** No Meta API credentials have been supplied. `GET` and `POST /api/whatsapp/webhook` return a disabled response until all required server-side settings are present. `.env.example` lists names only; live values belong in protected runtime secrets. The additive migration `drizzle/0002_whatsapp_webhook_events.sql` was generated for future duplicate suppression but has not been applied. Enablement requires the customer's Meta onboarding and an explicit deployment decision. Do not use personal-account automation, and do not add status scraping, message deletion/undelete, view-once capture, covert presence, bulk spam or unauthorized group administration.

See `notes/whatsapp-cloud-api-research.md` for current official Meta source links and policy constraints.

## Lead capture and data

`POST /api/inquiries` validates name, email, optional phone, service, message, consent and a honeypot before inserting an inquiry in the managed database. Per-email throttling reduces repeated submissions; no public list/read API exposes inquiries. The project owner receives a best-effort platform alert. The site sends no customer email automatically.

Database changes live in `drizzle/`. `pnpm db:migrate` applies outstanding migrations—do not run it for tests because development and production share the database. The WhatsApp bot tests use injected in-memory deduplication and mocked delivery; they do not call Meta or write to the managed database.

## Development and production

`pnpm dev` starts the full-stack development server on the configured `PORT` (default 3000). `pnpm check` runs TypeScript diagnostics, `pnpm test` runs unit/endpoint tests, `pnpm build` builds assets and prerenders 19 public pages plus a 404 page, and `pnpm start` serves production output. The toolchain is pinned to pnpm 10.18.0 with a lockfile.

The Dockerfile installs dependencies and executes the production build. The server listens on `0.0.0.0`, honors `PORT`, and exposes `/api/health` for unauthenticated readiness. `GET /manus-routes.json` enumerates public page routes; API endpoints and assets are excluded. The platform owns `/manus-storage/` URLs, which are not proxied from the application server. Set absolute website-origin metadata only after the actual published origin is known.

## Source structure

`client/src/pages` contains public pages, `client/src/components` shared layout and request UI, and `client/src/data` service, course, route, WhatsApp-message and review-message data. `client/public` holds favicon variants, local service artwork/logos, the bot-service mark and route manifest. `server/leadRoutes.ts` implements inquiry capture, `server/whatsappBot.ts` contains pure Cloud API/menu logic, and `server/whatsappRoutes.ts` owns signature-verified callbacks. `server/_core` owns Express startup and static serving. `scripts/prerender.tsx` generates crawlable HTML. `app.config.ts` supplies durable project-logo metadata.
