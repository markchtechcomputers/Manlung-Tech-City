export const WHATSAPP_BUSINESS_NUMBER = "254724356178";

export type WhatsAppRequestDetails = {
  serviceCategory: string;
  task: string;
  name: string;
  phone: string;
  email?: string;
  details?: string;
};

export function buildWhatsAppRequestUrl(request: WhatsAppRequestDetails) {
  const message = [
    "Hello Manlung Tech City, I’d like to request assistance.",
    `Service area: ${request.serviceCategory.trim()}`,
    `Requested service/task: ${request.task.trim()}`,
    `Name: ${request.name.trim()}`,
    `WhatsApp number: ${request.phone.trim()}`,
    ...(request.email?.trim() ? [`Email: ${request.email.trim()}`] : []),
    ...(request.details?.trim()
      ? [`Request details: ${request.details.trim()}`]
      : []),
  ].join("\n");

  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`;
}
