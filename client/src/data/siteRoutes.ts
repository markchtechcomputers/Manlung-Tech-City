import { services } from "./services";
import { resources } from "./resources";
import { businessContact } from "./contact";

export interface RouteMetadata {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
}

function searchSnippet(text: string, maxLength = 157) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const boundary = normalized.lastIndexOf(" ", maxLength);
  return `${normalized.slice(0, boundary).replace(/[ ,;:—-]+$/, "")}.`;
}

const serviceSearchDescriptions: Record<string, string> = {
  "cybersecurity-support":
    "Get practical cybersecurity support online across Kenya, with risk guidance, device hardening, and safer digital habits for people and teams.",
  "cybersecurity-courses":
    "Explore 30 cybersecurity courses in foundations, ethical hacking, cloud, applications and digital forensics. Ask about online learning anywhere in Kenya.",
  "government-e-services":
    "Get independent online guidance for eCitizen, passport, Good Conduct, PWD, SHA and NTSA requests from anywhere in Kenya. Official appointments still apply.",
  "kra-itax-assistance":
    "Get independent KRA and iTax guidance online across Kenya for PIN registration, returns, tax compliance certificates and related tasks.",
  "security-tool-setup":
    "Get remote setup guidance for Wireshark, Wazuh, Suricata and Nmap across Kenya, for learning or authorised work.",
  "whatsapp-bot-hosting":
    "Plan and host an official WhatsApp Business bot with webhook integration, human handoff and support across Kenya. Meta approval is required.",
  "it-digital-support":
    "Get practical online IT and digital support across Kenya for internet tasks, accounts, documents, devices and everyday business workflows.",
};

export const siteRoutes: RouteMetadata[] = [
  {
    path: "/",
    title: "Online eCitizen, KRA & Cyber Support | Manlung Tech City",
    description:
      "Online eCitizen, KRA/iTax and cybersecurity assistance across Kenya. Request passport, Good Conduct, PWD, SHA and NTSA guidance from anywhere.",
    keywords: [
      "online digital services Kenya",
      "eCitizen assistance",
      "KRA iTax assistance",
      "cybersecurity Kenya",
      "Good Conduct guidance",
      "PWD application guidance",
      "SHA registration help",
    ],
  },
  {
    path: "/services",
    title: "Online Cyber & Digital Services in Kenya | Manlung Tech City",
    description:
      "Explore cybersecurity, training, WhatsApp bot hosting, eCitizen and KRA/iTax assistance. Manlung Tech City delivers support online across Kenya.",
    keywords: [
      "online cyber services Kenya",
      "remote technology support Kenya",
      "cybersecurity services Kenya",
      "WhatsApp bot hosting Kenya",
      "government e-service guidance",
    ],
  },
  {
    path: "/courses",
    title: "Online Cybersecurity Courses in Kenya | Manlung Tech City",
    description:
      "Browse 30 cybersecurity courses in foundations, ethical hacking, cloud security and digital forensics. Ask about online learning anywhere in Kenya.",
    keywords: [
      "online cybersecurity courses Kenya",
      "cybersecurity training Kenya",
      "ethical hacking courses",
      "cloud security learning",
      "Manlung Tech City courses",
    ],
  },
  {
    path: "/about",
    title: "About Manlung Tech City | Online Services in Kenya",
    description:
      "Meet Manlung Tech City, a Nairobi cyber café delivering independent digital-service and cybersecurity support online to customers across Kenya.",
    keywords: [
      "Manlung Tech City",
      "online services across Kenya",
      "Nairobi cyber café",
      "cybersecurity support Kenya",
    ],
  },
  {
    path: "/contact",
    title: "Contact Manlung Tech City | Online Support Kenya",
    description:
      `Contact Manlung Tech City online from anywhere in Kenya. Call ${businessContact.phoneDisplay} or email ${businessContact.email}.`,
    keywords: [
      "contact Manlung Tech City",
      "online support Kenya",
      "remote cybersecurity help",
      "eCitizen and KRA assistance",
    ],
  },
  {
    path: "/review",
    title: "Leave a Service Review | Manlung Tech City",
    description:
      "Rate a completed Manlung Tech City service and send private feedback to the team through a WhatsApp or email draft.",
  },
  {
    path: "/insights",
    title: "Cybersecurity Insights & Resources | Manlung Tech City",
    description:
      "Build digital confidence with practical guides to spotting phishing, learning cybersecurity, and preparing for government e-service requests.",
  },
  {
    path: "/privacy",
    title: "Privacy Information | Manlung Tech City Kenya",
    description:
      "How Manlung Tech City handles consultation inquiry details, hosting analytics, external services, and privacy questions.",
  },
  {
    path: "/terms",
    title: "Website & Service Inquiry Terms | Manlung Tech City",
    description:
      "Information about course inquiries, independent government assistance, responsible security training, and using the Manlung Tech City website.",
  },
  ...services.map(service => ({
    path: `/services/${service.slug}`,
    title: `${service.title} | Manlung Tech City`,
    description:
      serviceSearchDescriptions[service.slug] ??
      searchSnippet(`${service.title} support delivered online across Kenya.`),
    keywords: [
      `${service.title} Kenya`,
      `online ${service.title}`,
      `${service.title} support`,
      "online services across Kenya",
      "Manlung Tech City",
    ],
  })),
  ...resources.map(resource => ({
    path: `/insights/${resource.slug}`,
    title:
      resource.slug === "get-ready-for-a-government-e-service-request"
        ? "Government E-service Checklist | Manlung Tech City"
        : `${resource.title} | Manlung Tech City`,
    description: resource.summary,
  })),
];

export function routeMetadata(path: string): RouteMetadata {
  return (
    siteRoutes.find(route => route.path === path) || {
      path: "/404",
      title: "Page Not Found | Manlung Tech City",
      description:
        "This Manlung Tech City page could not be found. Browse our services, courses, or contact the team for help.",
    }
  );
}
