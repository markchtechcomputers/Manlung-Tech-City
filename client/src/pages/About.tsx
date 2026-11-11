import {
  ArrowUpRight,
  Check,
  HeartHandshake,
  Lightbulb,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { businessContact } from "@/data/contact";

export default function About() {
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">YOUR NEIGHBOURHOOD CYBER CAFÉ</span>
          <h1>
            A cyber café.
            <br />
            <em>Here to help.</em>
          </h1>
          <p>
            Friendly eCitizen, KRA, iTax and cybersecurity guidance,
            <br />
            delivered online to customers anywhere in Kenya.
          </p>
        </div>
      </section>
      <section className="page-section">
        <div className="container about-layout">
          <div>
            <span className="eyebrow">LOCAL HELP. PRACTICAL NEXT STEPS.</span>
            <h2>
              Your local stop for
              <br />
              online services.
            </h2>
            <p className="section-copy">
              Manlung Tech City is a Nairobi cyber café delivering digital
              services and practical support online to customers across Kenya.
              Request help with eCitizen, NTSA, KRA and iTax services, as well
              as cybersecurity courses and everyday technology.
            </p>
            <p className="section-copy">
              We bring learning and digital guidance into one place—from
              understanding the basics of network security to navigating a
              government portal. Our focus is clear communication, useful
              skills, and a thoughtful approach to your personal information.
            </p>
            <span className="location-pill">
              <MapPin size={16} /> Nairobi base · Online support across Kenya
            </span>
          </div>
          <div className="values-panel">
            {[
              {
                icon: Lightbulb,
                title: "Make knowledge practical",
                text: "Explain the next step clearly, whether you're a beginner or building specialist skills.",
              },
              {
                icon: HeartHandshake,
                title: "Start with your needs",
                text: "Help you choose a suitable service without making technology feel complicated.",
              },
              {
                icon: ShieldCheck,
                title: "Respect your information",
                text: "Ask only for the details needed for the task. Never request passwords or one-time codes in an inquiry.",
              },
            ].map(v => (
              <div key={v.title}>
                <v.icon size={25} />
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="page-section about-audience">
        <div className="container">
          <span className="eyebrow">A PLACE FOR YOUR NEXT STEP</span>
          <h2>Built around people.</h2>
          <div className="highlights-grid">
            {[
              {
                title: "Individuals & families",
                text: "Support with eCitizen, NTSA, KRA, and online applications.",
              },
              {
                title: "Learners & professionals",
                text: "Cybersecurity courses covering foundations, defensive skills, and advanced topics.",
              },
              {
                title: "Businesses & organizations",
                text: "Practical security guidance, tool configuration, digital support, and staff awareness.",
              },
            ].map(v => (
              <div className="highlight-card" key={v.title}>
                <Check size={25} />
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
          <p className="small-note">
            Manlung Tech City is an independent assistance provider, not
            affiliated with or endorsed by eCitizen, KRA, NTSA, or another
            government agency. Government approval and processing times remain
            with the relevant authority.
          </p>
        </div>
      </section>
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>
            Let's find your
            <br />
            way forward.
          </h2>
          <a className="button button-black" href="/contact">
            Start a conversation <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
    </>
  );
}

export function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const privacy = type === "privacy";
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">MANLUNG TECH CITY</span>
          <h1>{privacy ? "Privacy information" : "Website terms"}</h1>
          <p>Clear information about using this website.</p>
        </div>
      </section>
      <section className="page-section">
        <div className="container resource-body">
          <div className="content-block">
            <h2>
              {privacy
                ? "Your inquiry and contact information"
                : "Information and inquiries"}
            </h2>
            <p>
              {privacy
                ? "When you submit the website inquiry form, the name, email, optional phone number, selected service, and message are saved in the managed database so Manlung Tech City can follow up. Your consent is required. An alert may be sent to the project owner through the hosting platform. Service-request and review forms prepare WhatsApp or email drafts; the website does not save those details. Opening WhatsApp uses its service, and your review is shared with Manlung only if you press Send in WhatsApp or email. Reviews from that page are private feedback and are not automatically published. The official WhatsApp bot is not active in this release; its webhook scaffold is disabled until Meta credentials are configured. If enabled later, it retains only hashed provider message IDs for up to 30 days to suppress duplicate replies, not chat text or phone numbers."
                : "This website presents Manlung Tech City's technology services and course catalog. An inquiry is not an enrollment, contract, or payment. Ask the team to confirm fees, course schedules, delivery formats, availability, and the scope of any service before proceeding."}
            </p>
          </div>
          <div className="content-block">
            <h2>
              {privacy
                ? "Keep sensitive details private"
                : "Independent digital assistance"}
            </h2>
            <p>
              {privacy
                ? "Do not include passwords, one-time codes, national ID numbers, bank details, or tax documents in the inquiry form. Ask the team to explain an appropriate secure process before sharing any sensitive material."
                : "Government-service and KRA assistance is independent guidance. Manlung Tech City is not a government agency and cannot guarantee application outcomes or government processing times. Official government fees are separate from assistance fees and must be confirmed through the relevant authority."}
            </p>
          </div>
          <div className="content-block">
            <h2>
              {privacy
                ? "Website services and external links"
                : "Responsible cybersecurity use"}
            </h2>
            <p>
              {privacy
                ? "The hosting platform may collect technical logs and usage analytics. WhatsApp, Telegram, email providers, and external services have their own privacy policies. Inquiry details are used to respond to your request. Ask us to correct or delete a submitted inquiry using the contact details below. No advertising signup or account login is required."
                : "Security training and tools are intended for learning, defensive work, and testing systems with explicit authorization. Do not use them to access another person's systems or data without permission."}
            </p>
          </div>
          <div className="content-block">
            <h2>Contact</h2>
            <p>
              For questions about a service or personal information you've
              shared with the business, email{" "}
              <a href={businessContact.emailHref}>{businessContact.email}</a> or call{" "}
              <a href={businessContact.phoneHref}>{businessContact.phoneDisplay}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
