export interface ResourceSection {
  heading: string;
  body: string;
}

export interface Resource {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  sections: ResourceSection[];
}

export const resources: Resource[] = [
  {
    slug: "spot-phishing-before-you-click",
    title: "Spot phishing before you click",
    category: "Cybersecurity basics",
    readTime: "4 min read",
    summary:
      "A quick, repeatable way to slow down suspicious messages before a link, attachment, or urgent request catches you off guard.",
    sections: [
      {
        heading: "Pause when the message creates pressure",
        body: "Phishing messages often push for an immediate payment, sign-in, download, or reply. Treat urgency, secrecy, and threats of account closure as reasons to pause and verify—not reasons to act faster.",
      },
      {
        heading: "Check the sender and destination",
        body: "Read the full sender address, not only the display name. On a computer, hover over a link to preview its destination; on a phone, press and hold only if your device shows a safe preview. Look for misspellings, unexpected domains, and links that do not match the organisation mentioned.",
      },
      {
        heading: "Verify through a separate route",
        body: "If a message asks for a password, one-time code, payment, or sensitive document, contact the organisation using a phone number, app, or website you already trust. Do not use the contact details supplied in the suspicious message.",
      },
      {
        heading: "If you already clicked",
        body: "Stop entering information, close the page, and tell the relevant account owner or IT contact. Change a password from a trusted device if you entered it, and report the message through the service that received it. Keep the message available for investigation rather than forwarding it to more people.",
      },
    ],
  },
  {
    slug: "your-first-steps-into-cybersecurity",
    title: "Your first steps into cybersecurity",
    category: "Learning guide",
    readTime: "5 min read",
    summary:
      "A beginner-friendly starting point for learning the language, habits, and safe practice behind cybersecurity.",
    sections: [
      {
        heading: "Start with the essentials",
        body: "Learn how devices, networks, accounts, applications, and data connect. The CIA triad—confidentiality, integrity, and availability—is a useful lens for understanding what security is trying to protect.",
      },
      {
        heading: "Practise good digital hygiene",
        body: "Use unique passwords with a password manager where appropriate, turn on multi-factor authentication, install updates from trusted sources, and keep backups of important information. These habits build a foundation before you explore specialised topics.",
      },
      {
        heading: "Choose one learning path",
        body: "Try a foundation topic such as networking, operating-system security, or security awareness before jumping between advanced subjects. Keep notes, define unfamiliar terms, and revisit concepts until you can explain them in your own words.",
      },
      {
        heading: "Keep practice authorised",
        body: "Use a lab, training platform, or system you own or have explicit permission to test. Learn to document what you did, what you observed, and how you would reduce risk. Responsible boundaries are part of the skill—not an extra step.",
      },
    ],
  },
  {
    slug: "get-ready-for-a-government-e-service-request",
    title: "Get ready for a government e-service request",
    category: "Digital confidence",
    readTime: "4 min read",
    summary:
      "Simple preparation steps for approaching an online government request with the right information and a safer process.",
    sections: [
      {
        heading: "Name the service first",
        body: "Write down the exact service you need—such as a passport request, police clearance, eCitizen task, or NTSA application. Starting with one clear outcome helps you avoid entering the wrong form or sharing information with an unofficial site.",
      },
      {
        heading: "Use the official channel",
        body: "Find the service through the relevant official government website or application. Check the address carefully, avoid links from unexpected messages, and never assume that a search result or social post is an official instruction.",
      },
      {
        heading: "Prepare before you begin",
        body: "Gather the identity details, supporting documents, and contact information the official instructions request. Use your own account and a device you trust. Do not send passwords or one-time codes to someone offering to complete the request for you.",
      },
      {
        heading: "Keep your reference details",
        body: "After submitting, save the confirmation or reference information shown by the official channel. Note any next action you are asked to take, but do not rely on an unofficial promise about approval, timing, or fees. If you need help, ask for guidance while keeping final control of your account and submission.",
      },
    ],
  },
];
