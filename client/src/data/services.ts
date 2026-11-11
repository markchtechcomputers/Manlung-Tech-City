import { courses } from "@/data/courses";

export interface Service {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  icon: string;
  benefits: string[];
  approach: string[];
  audience: string[];
  offerings: string[];
}

const courseOfferings = courses.map(({ name }) => name);

export const services: Service[] = [
  {
    slug: "cybersecurity-support",
    title: "Cybersecurity support",
    kicker: "Assess • strengthen • learn",
    description:
      "Practical cybersecurity guidance for people and teams that want a clearer view of their risks, stronger everyday controls, and safer working habits.",
    icon: "shield-check",
    benefits: [
      "A practical view of security priorities and exposure",
      "Clear hardening actions for devices, accounts, and networks",
      "Security awareness that connects controls to daily work",
    ],
    approach: [
      "Understand your environment, goals, and the concern you want to address.",
      "Review relevant security practices and identify sensible improvements.",
      "Explain the priority actions in plain language and share a practical next-step plan.",
    ],
    audience: [
      "Small businesses",
      "Teams and organisations",
      "Individuals building safer digital habits",
    ],
    offerings: [
      "Cybersecurity assessments",
      "Device, account, and network hardening guidance",
      "Security awareness sessions",
      "Password and access-practice reviews",
    ],
  },
  {
    slug: "cybersecurity-courses",
    title: "Cybersecurity courses",
    kicker: "Build skills with direction",
    description:
      "Structured learning pathways covering cybersecurity foundations, offensive and defensive practice, cloud, applications, and emerging technology topics.",
    icon: "graduation-cap",
    benefits: [
      "A broad starting point for learners at different stages",
      "Topic-led study that connects concepts to responsible practice",
      "A clear route to explore the full course catalogue",
    ],
    approach: [
      "Choose a topic based on your current knowledge and learning goal.",
      "Work through the relevant concepts, terminology, and practical context.",
      "Use the course catalogue to continue into related or more advanced topics.",
    ],
    audience: [
      "Beginners",
      "Students and career changers",
      "Practitioners refreshing core concepts",
    ],
    offerings: courseOfferings,
  },
  {
    slug: "government-e-services",
    title: "Government e-services",
    kicker: "Application guidance",
    description:
      "Independent, practical guidance for navigating selected government applications online. Manlung Tech City is an independent assistance provider and is not affiliated with or a representative of any government agency.",
    icon: "landmark",
    benefits: [
      "A calmer way to understand an online application process",
      "Help organising the information and documents you need to provide",
      "Guidance that keeps official portals and applicant decisions in view",
    ],
    approach: [
      "Clarify the service you are trying to access and the official channel involved.",
      "Walk through the application steps and explain where information is entered.",
      "Leave you with the next action to complete through the relevant official service.",
    ],
    audience: [
      "Individuals",
      "Families handling applications",
      "Small businesses completing online requests",
    ],
    offerings: [
      "eCitizen application guidance",
      "Passport application guidance",
      "Police clearance / Good Conduct application guidance",
      "Good Conduct certificate renewal inquiry",
      "Persons with Disabilities (PWD) application / registration guidance",
      "SHA (Social Health Authority) registration guidance",
      "NTSA application guidance",
    ],
  },
  {
    slug: "kra-itax-assistance",
    title: "KRA & iTax assistance",
    kicker: "Understand your next tax task",
    description:
      "Independent assistance for common KRA and iTax tasks, with guidance on preparing information and using the relevant official channel. We are not affiliated with KRA and do not set official fees, decisions, or deadlines.",
    icon: "receipt-text",
    benefits: [
      "A clearer starting point for a KRA or iTax request",
      "Help preparing the details needed for an online task",
      "Plain-language guidance while you remain responsible for your submission",
    ],
    approach: [
      "Identify the KRA or iTax service and the information you already have.",
      "Explain the relevant form, account step, or document preparation task.",
      "Review the next steps with you and direct you back to the official channel for submission.",
    ],
    audience: [
      "Individuals",
      "Employers and small businesses",
      "People returning to an unfinished iTax task",
    ],
    offerings: [
      "KRA PIN registration",
      "PIN retrieval",
      "Tax return filing guidance",
      "Tax Compliance Certificate guidance",
      "VAT registration guidance",
      "PAYE assistance",
      "Withholding tax assistance",
      "Business tax registration guidance",
      "Rental income tax guidance",
      "Turnover tax guidance",
      "Objection and appeals guidance",
      "iTax assistance",
    ],
  },
  {
    slug: "security-tool-setup",
    title: "Security tool setup",
    kicker: "Configure legitimate tools responsibly",
    description:
      "Installation, configuration, and guided learning for widely used security and network tools. The software itself is open-source or separately licensed; this service is for setup and training, not tool resale.",
    icon: "wrench",
    benefits: [
      "A more deliberate setup for a lab, workstation, or learning environment",
      "Configuration explained instead of treated as a black box",
      "Responsible, authorised use kept at the centre of the work",
    ],
    approach: [
      "Confirm the authorised environment, purpose, and operating system.",
      "Install or configure the selected tool using its supported documentation and settings.",
      "Walk through safe, legitimate use and leave you with a maintainable setup.",
    ],
    audience: [
      "Learners and home labs",
      "Small IT teams",
      "Practitioners building authorised test environments",
    ],
    offerings: [
      "Wireshark installation, capture setup, and guided use",
      "Wazuh installation, configuration, and introductory use",
      "Suricata installation, rule setup, and introductory use",
      "Nmap installation, authorised scan setup, and guided use",
    ],
  },
  {
    slug: "whatsapp-bot-hosting",
    title: "WhatsApp bot hosting & deployment",
    kicker: "Plan • integrate • host",
    description:
      "Plan and deploy customer-service bots using Meta's official WhatsApp Business Platform. Scope can include conversational design, secure webhook integration, hosting and human handoff. Production activation depends on the customer's Meta Business onboarding, eligible phone number, required approvals and credentials; platform fees and hosting arrangements are agreed separately.",
    icon: "whatsapp-bot",
    benefits: [
      "A structured way to handle common customer questions and service requests",
      "Secure webhook setup and an intentional path to a human team member",
      "Clear deployment, hosting and support scope before a bot goes live",
    ],
    approach: [
      "Map your service menu, languages, common questions and human-handoff needs.",
      "Design and test the bot flow around the official WhatsApp Business Platform and your approved Meta account.",
      "Agree the hosting, launch and ongoing support scope; go-live follows Meta onboarding, permissions and credential setup.",
    ],
    audience: [
      "Small businesses handling repeat customer enquiries",
      "Service teams that need clearer WhatsApp request routing",
      "Organisations planning an official WhatsApp automation project",
    ],
    offerings: [
      "WhatsApp bot requirements and conversation-flow planning",
      "Official WhatsApp Business Platform / Cloud API integration",
      "Verified webhook development and secure configuration",
      "Service menus, customer request routing and human handoff",
      "Bot hosting and production deployment planning",
      "Post-launch monitoring and maintenance by agreed scope",
    ],
  },
  {
    slug: "it-digital-support",
    title: "IT & digital support",
    kicker: "Make technology easier to use",
    description:
      "Straightforward digital help for businesses and individuals who need support with everyday technology, online tasks, and building confidence with digital tools.",
    icon: "laptop",
    benefits: [
      "Practical help matched to your current level of confidence",
      "Clear explanations for everyday computer and online tasks",
      "A more organised starting point for improving digital workflows",
    ],
    approach: [
      "Start with the task, device, or digital workflow that is getting in the way.",
      "Work through the steps at a pace that makes the process understandable.",
      "Summarise the repeatable habits and next actions that will help you continue independently.",
    ],
    audience: [
      "Individuals and families",
      "Small businesses",
      "Teams improving everyday digital literacy",
    ],
    offerings: [
      "Digital literacy guidance",
      "Computer and internet basics",
      "Online account and document support",
      "Everyday software and device guidance",
      "Business technology workflow guidance",
    ],
  },
];
