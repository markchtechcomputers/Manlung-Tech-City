import { WHATSAPP_BUSINESS_NUMBER } from "./whatsappRequest";
import { businessContact } from "./contact";

export type CustomerReview = {
  service: string;
  rating: number;
  feedback: string;
  name?: string;
  email?: string;
};

export function buildReviewMessage(review: CustomerReview) {
  return [
    "Manlung Tech City — customer feedback",
    `Service/task: ${review.service.trim()}`,
    `Rating: ${review.rating}/5 stars`,
    ...(review.name?.trim() ? [`Name: ${review.name.trim()}`] : []),
    ...(review.email?.trim() ? [`Reply email: ${review.email.trim()}`] : []),
    `Feedback: ${review.feedback.trim()}`,
  ].join("\n");
}

export function buildReviewWhatsAppUrl(review: CustomerReview) {
  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(buildReviewMessage(review))}`;
}

export function buildReviewEmailUrl(review: CustomerReview) {
  const subject = `Manlung Tech City feedback — ${review.rating}/5 stars`;
  return `${businessContact.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildReviewMessage(review))}`;
}
