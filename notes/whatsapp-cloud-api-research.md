# WhatsApp Cloud API implementation notes

Research checked against Meta's official documentation on 2026-11-09. Use the official Business Platform Cloud API, not a linked personal-account automation library.

- A production webhook must use public HTTPS/TLS and accept GET verification and POST events. Meta's GET verification supplies `hub.mode`, `hub.verify_token`, and `hub.challenge`; compare a server-held token and return the challenge only on a match. POST requests carry `X-Hub-Signature-256`, an HMAC-SHA256 digest of the exact raw body keyed with the Meta app secret. Invalid signatures must be rejected. Meta retries failed webhook delivery, so event processing must be idempotent.
- Inbound messages and delivery/read statuses arrive as webhooks. A system-user access token is needed for the deployed API; temporary quickstart tokens are not production credentials. Keep all secrets server-side.
- A customer's inbound WhatsApp message opens a 24-hour customer-service window for non-template replies. Outside that window, only approved templates may be sent, and the business must have recipient opt-in. Do not auto-message customers after service completion unless an approved, opt-in-compliant workflow and completion event exist.
- Interactive list messages can drive a categorized support menu. Meta documents up to 10 total rows across sections; a selected row returns a webhook event. Use concise service links/forms rather than storing chats or automating unrelated personal-account actions.
- Meta's Groups API exists, but eligibility requires an Official Business Account. Groups are invite-only and limited to eight participants; group API does not support view-once messages, disappearing messages, interactive messages, or hiding participant lists. Group moderation is not needed for the customer-service bot's initial scope.
- Do not implement status viewing, undelete/anti-delete, view-once capture, covert presence, or unrelated media scraping. Keep customer service opt-in, privacy-first, and narrowly scoped to the website's services.

## Official sources

- [1] https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started "WhatsApp Cloud API Get Started"
- [2] https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview "WhatsApp webhooks"
- [3] https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/create-webhook-endpoint "Create a webhook endpoint"
- [4] https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages "Service messages and the customer-service window"
- [5] https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in "Get opt-in for WhatsApp"
- [6] https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/interactive-list-messages "Interactive list messages"
- [7] https://developers.facebook.com/documentation/business-messaging/whatsapp/groups "Groups API"
- [8] https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview "Template fundamentals"
