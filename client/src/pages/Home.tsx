import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Check,
  FileCheck2,
  Fingerprint,
  GraduationCap,
  Landmark,
  Laptop,
  Mail,
  MapPin,
  Pause,
  Play,
  Phone,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { businessContact } from "@/data/contact";

const awarenessMessages = [
  {
    title: "Don’t wait until you need it.",
    description:
      "Take care of essential services before emergencies and deadlines arise.",
  },
  {
    title: "Keep your digital records ready.",
    description:
      "Organize important documents and review the requirements for the service you need.",
  },
  {
    title: "Stay ahead of government deadlines.",
    description:
      "Keep track of important documents, renewals and service requirements.",
  },
  {
    title: "Your digital safety starts here.",
    description:
      "Learn about cyber threats, online security and protecting your digital identity.",
  },
  {
    title: "Kenya is going digital. Are you ready?",
    description:
      "Discover convenient ways to access digital services and get the assistance you need.",
  },
] as const;

const serviceLogos = {
  ecitizen: "/images/ecitizen-logo.jpg",
  kra: "/images/kra-logo.jpg",
  sha: "/images/sha-logo.jpg",
  cybersecurity: "/images/cybersecurity.jpg",
};

const highlights = [
  {
    icon: Landmark,
    logo: serviceLogos.ecitizen,
    image: "",
    title: "eCitizen & NTSA help",
    description:
      "Get practical, independent guidance with online applications and digital government services.",
    href: "/services/government-e-services",
    label: "GOVERNMENT E-SERVICES",
  },
  {
    icon: ReceiptText,
    logo: serviceLogos.kra,
    image: "",
    title: "KRA & iTax assistance",
    description:
      "Get a clear hand with common KRA and iTax tasks, returns and online filing guidance.",
    href: "/services/kra-itax-assistance",
    label: "TAX SERVICES",
  },
  {
    icon: ShieldCheck,
    logo: "",
    image: serviceLogos.cybersecurity,
    title: "Cybersecurity & training",
    description:
      "Build practical security knowledge with friendly support and 30 structured courses.",
    href: "/courses",
    label: "LEARN & PROTECT",
  },
];

const serviceRequestHref = (slug: string, task: string) =>
  `/services/${slug}?service=${encodeURIComponent(task)}#service-request-${slug}`;

const featuredApplications = [
  {
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519664072188572/mWAOfGzvUbbODxiB.webp",
    imageAlt:
      "A Kenyan customer getting independent help with a generic online passport application at a local cyber café",
    label: "PASSPORT GUIDANCE",
    brandLogo: serviceLogos.ecitizen,
    brandName: "eCitizen",
    title: "Passport application",
    description:
      "Get help understanding the steps for an online passport application.",
    slug: "government-e-services",
    task: "Passport application guidance",
  },
  {
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519664072188572/ChWAGKQIRWMCkajX.webp",
    imageAlt:
      "An adult Kenyan wheelchair user confidently working through a generic online application with respectful support",
    label: "ACCESSIBLE SERVICE GUIDANCE",
    brandLogo: "",
    brandName: "",
    title: "PWD application",
    description:
      "Find practical guidance for a PWD application or registration inquiry.",
    slug: "government-e-services",
    task: "Persons with Disabilities (PWD) application / registration guidance",
  },
  {
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519664072188572/HBNawgknQTiKxMvx.webp",
    imageAlt:
      "Kenyan customers using a laptop to get independent guidance with a generic digital health-service registration",
    label: "DIGITAL HEALTH SERVICE",
    brandLogo: serviceLogos.sha,
    brandName: "SHA",
    title: "SHA registration",
    description:
      "Ask for independent help getting started with SHA registration online.",
    slug: "government-e-services",
    task: "SHA (Social Health Authority) registration guidance",
  },
];

const quickServiceRequests = [
  {
    icon: FileCheck2,
    brandLogo: "",
    title: "Good Conduct / Police clearance",
    description: "Application guidance and renewal inquiries.",
    slug: "government-e-services",
    task: "Good Conduct certificate renewal inquiry",
  },
  {
    icon: ReceiptText,
    brandLogo: serviceLogos.kra,
    title: "KRA & iTax assistance",
    description: "Registration, retrieval, return and other iTax tasks.",
    slug: "kra-itax-assistance",
    task: "iTax assistance",
  },
  {
    icon: Landmark,
    brandLogo: "",
    title: "NTSA e-services",
    description: "Start a request for selected NTSA online-service guidance.",
    slug: "government-e-services",
    task: "NTSA application guidance",
  },
];

export default function Home() {
  const [activeMessage, setActiveMessage] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [carouselHovered, setCarouselHovered] = useState(false);
  useEffect(() => {
    if (
      carouselPaused ||
      carouselHovered ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveMessage(index => (index + 1) % awarenessMessages.length);
    }, 8500);
    return () => window.clearInterval(timer);
  }, [carouselPaused, carouselHovered]);

  const showMessage = (index: number) =>
    setActiveMessage(
      (index + awarenessMessages.length) % awarenessMessages.length
    );

  return (
    <>
      <section className="hero awareness-hero">
        <div className="container hero-layout">
          <div className="hero-copy">
            <h1>
              DON’T WAIT UNTIL
              <br />
              YOU NEED IT.
              <br />
              <em>STAY READY.</em>
            </h1>
            <p className="awareness-subhead">
              Your Digital Life. Your Services. Your Security.
            </p>
            <p className="awareness-description">
              Get independent guidance with eCitizen, KRA/iTax and cybersecurity
              tasks. Manlung Tech City delivers its support online across Kenya,
              so you can work with us wherever you are. Official appointments or
              in-person steps still follow the relevant authority's rules.
            </p>
            <div className="hero-actions awareness-actions">
              <a href="/services" className="button button-primary">
                Explore Services <ArrowUpRight size={18} />
              </a>
              <a href="/contact" className="button awareness-secondary">
                Get Assistance <ArrowUpRight size={18} />
              </a>
            </div>
            <div
              className="hero-contact-links"
              role="group"
              aria-label="Contact Manlung Tech City"
            >
              <a href={businessContact.phoneHref}>
                <Phone size={16} aria-hidden="true" />
                <span>
                  <small>Call us</small>
                  <strong>{businessContact.phoneDisplay}</strong>
                </span>
              </a>
              <a href={businessContact.emailHref}>
                <Mail size={16} aria-hidden="true" />
                <span>
                  <small>Email us</small>
                  <strong>{businessContact.email}</strong>
                </span>
              </a>
            </div>
            <div className="hero-service-shortcuts">
              <a href="/services/government-e-services">
                <img src={serviceLogos.ecitizen} alt="" aria-hidden="true" />
                eCitizen &amp; NTSA
              </a>
              <a href="/services/kra-itax-assistance">
                <img src={serviceLogos.kra} alt="" aria-hidden="true" />
                KRA &amp; iTax
              </a>
            </div>
            <p className="independent-disclaimer">
              Manlung provides independent guidance. It is not a Government of
              Kenya office or an official government partner.
            </p>
            <div
              className="awareness-rotator"
              onMouseEnter={() => setCarouselHovered(true)}
              onMouseLeave={() => setCarouselHovered(false)}
            >
              <div className="rotator-kicker">
                <span>
                  <BellRing size={14} /> AWARENESS & UPDATES
                </span>
                <span>{String(activeMessage + 1).padStart(2, "0")} / 05</span>
              </div>
              <div key={activeMessage} className="rotator-message">
                <h2>{awarenessMessages[activeMessage].title}</h2>
                <p>{awarenessMessages[activeMessage].description}</p>
              </div>
              <div className="rotator-controls">
                <button
                  type="button"
                  aria-label="Previous awareness message"
                  onClick={() => showMessage(activeMessage - 1)}
                >
                  <ChevronLeft size={17} />
                </button>
                <div
                  className="rotator-dots"
                  aria-label="Choose an awareness message"
                >
                  {awarenessMessages.map((message, index) => (
                    <button
                      type="button"
                      key={message.title}
                      className={index === activeMessage ? "selected" : ""}
                      aria-label={`Show awareness message ${index + 1}: ${message.title}`}
                      aria-pressed={index === activeMessage}
                      onClick={() => showMessage(index)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label={
                    carouselPaused
                      ? "Resume awareness messages"
                      : "Pause awareness messages"
                  }
                  aria-pressed={carouselPaused}
                  onClick={() => setCarouselPaused(paused => !paused)}
                >
                  {carouselPaused ? <Play size={15} /> : <Pause size={15} />}
                </button>
                <button
                  type="button"
                  aria-label="Next awareness message"
                  onClick={() => showMessage(activeMessage + 1)}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
          <div className="hero-visual awareness-visual">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519664072188572/kznLbGrcFwzslSUM.webp"
              alt="A welcoming Kenyan cyber café attendant assisting a customer with online services"
              width="1536"
              height="1024"
              fetchPriority="high"
            />
            <div className="awareness-visual-caption">
              <Fingerprint size={20} />
              <span>
                Independent support for Kenyans
                <small>LOCAL HELP · DIGITAL CONFIDENCE</small>
              </span>
            </div>
          </div>
        </div>
        <div className="container awareness-feature-strip">
          <a href="/courses">
            <ShieldCheck size={22} />
            <span>
              <strong>Cybersecurity & Digital Safety</strong>
              <small>Learn how to protect your digital identity</small>
            </span>
            <ArrowRight size={17} />
          </a>
          <a href="/services/government-e-services">
            <Landmark size={22} />
            <span>
              <strong>Government Services Assistance</strong>
              <small>Independent help with eCitizen and NTSA services</small>
            </span>
            <ArrowRight size={17} />
          </a>
          <a href="/insights">
            <BellRing size={21} />
            <span>
              <strong>Important Updates & Reminders</strong>
              <small>Awareness guides for staying prepared</small>
            </span>
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
      <section
        className="popular-requests-section"
        aria-labelledby="popular-requests-heading"
      >
        <div className="container">
          <div className="popular-requests-heading">
            <div>
              <span className="eyebrow">POPULAR ONLINE REQUESTS</span>
              <h2 id="popular-requests-heading">
                Choose a service.
                <br />
                <span>We’ll help you get started.</span>
              </h2>
            </div>
            <p>
              Select a service to open its request form with the task already
              filled in. Add your details, review the WhatsApp draft and send it
              when you are ready.
            </p>
          </div>
          <div className="featured-applications-grid">
            {featuredApplications.map(application => (
              <a
                key={application.title}
                className="featured-application-card"
                href={serviceRequestHref(application.slug, application.task)}
              >
                <div className="featured-application-image">
                  <img
                    src={application.image}
                    alt={application.imageAlt}
                    width="900"
                    height="675"
                    loading="lazy"
                  />
                  {application.brandLogo && (
                    <span className="featured-application-brand">
                      <img
                        src={application.brandLogo}
                        alt=""
                        aria-hidden="true"
                      />
                      <b>{application.brandName}</b>
                    </span>
                  )}
                  <span className="featured-guidance-label">
                    Independent guidance
                  </span>
                </div>
                <div className="featured-application-copy">
                  <span className="eyebrow">{application.label}</span>
                  <h3>{application.title}</h3>
                  <p>{application.description}</p>
                  <span className="featured-application-link">
                    Open request form{" "}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </span>
                </div>
              </a>
            ))}
          </div>
          <div className="quick-service-requests">
            {quickServiceRequests.map(request => (
              <a
                key={request.title}
                className="quick-service-request"
                href={serviceRequestHref(request.slug, request.task)}
              >
                <span
                  className={`quick-service-request-icon ${request.brandLogo ? "with-brand-logo" : ""}`}
                >
                  {request.brandLogo ? (
                    <img src={request.brandLogo} alt="" aria-hidden="true" />
                  ) : (
                    <request.icon size={21} aria-hidden="true" />
                  )}
                </span>
                <span className="quick-service-request-copy">
                  <strong>{request.title}</strong>
                  <small>{request.description}</small>
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="popular-service-disclaimer">
            Manlung provides independent assistance, not a government service.
            You remain in control of your account and final submission.
          </p>
        </div>
      </section>
      <section
        className="page-section home-services cafe-services"
        id="services"
      >
        <div className="container">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">YOUR LOCAL CYBER CAFÉ</span>
              <h2>
                Online services,
                <br />
                <span className="muted-heading">without the guesswork.</span>
              </h2>
            </div>
            <div className="section-heading-side">
              <p>
                Not sure which form, portal or next step you need? Start with
                the service that brought you here. We will help make it clearer.
              </p>
              <a className="text-link" href="/services">
                Browse all services <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="highlights-grid cafe-highlights-grid">
            {highlights.map((item, index) => (
              <a
                className={`highlight-card${item.image ? " highlight-card-with-image" : ""}`}
                key={item.href}
                href={item.href}
              >
                {item.image && (
                  <span className="highlight-card-image" aria-hidden="true">
                    <img src={item.image} alt="" />
                  </span>
                )}
                <div className="card-top">
                  <span className="service-icon">
                    {item.logo ? (
                      <img src={item.logo} alt="" aria-hidden="true" />
                    ) : (
                      <item.icon size={27} strokeWidth={1.5} />
                    )}
                  </span>
                  <span className="card-index">0{index + 1}</span>
                </div>
                <span className="eyebrow card-eyebrow">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="card-link">
                  Explore this service <ArrowUpRight size={20} />
                </span>
              </a>
            ))}
          </div>
          <div className="cafe-disclaimer">
            <FileCheck2 size={17} />
            <p>
              Independent assistance, not an official eCitizen or KRA office.
              You remain in control of your accounts and final submissions.
            </p>
          </div>
        </div>
      </section>
      <section className="learning-section">
        <div className="container learning-layout">
          <div className="learning-illustration" aria-hidden="true">
            <div className="code-window">
              <div className="window-heading">
                <span />
                <span />
                <span />
                <b>your-next-chapter.sh</b>
                <Fingerprint size={15} />
              </div>
              <div className="code-body">
                <span className="code-comment">
                  // build a future in cybersecurity
                </span>
                <p>
                  <span className="code-green">const</span> yourPotential ={" "}
                  <span className="code-green">"limitless"</span>;
                </p>
                <p>
                  <span className="code-muted">01</span>{" "}
                  learn.theFundamentals();
                </p>
                <p>
                  <span className="code-muted">02</span> practice.withPurpose();
                </p>
                <p>
                  <span className="code-muted">03</span> grow.yourSkills();
                </p>
                <div className="code-result">
                  <Check size={16} /> Your next chapter is ready
                  <span className="cursor-blink">_</span>
                </div>
              </div>
            </div>
            <div className="course-count">
              <GraduationCap size={25} />
              <strong>30</strong>
              <span>
                courses.
                <br />
                One place to grow.
              </span>
            </div>
          </div>
          <div className="learning-copy">
            <span className="eyebrow">YOUR NEIGHBOURHOOD LEARNING HUB</span>
            <h2>
              Curiosity is your
              <br />
              best security tool.
            </h2>
            <p>
              Start with the basics. Explore ethical hacking, cloud security,
              digital forensics and more. Friendly guidance helps you find a
              course that fits the skills you want to build.
            </p>
            <div className="learning-tags">
              <span>Beginner friendly</span>
              <span>Specialist topics</span>
              <span>Prices in KES</span>
            </div>
            <a className="button button-black" href="/courses">
              Find your course <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <section className="page-section local-section">
        <div className="container local-layout">
          <div>
            <span className="eyebrow">LOCAL PEOPLE. PRACTICAL HELP.</span>
            <h2>
              Pop in with a question.
              <br />
              Leave with a next step.
            </h2>
            <p>
              Manlung Tech City brings in-person cyber café assistance and
              practical digital learning together in Nairobi, Kenya.
            </p>
            <a className="text-link" href="/about">
              Meet Manlung Tech City <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="client-types">
            <div>
              <span>01</span>
              <h3>Individuals & families</h3>
              <p>Friendly help with everyday online tasks.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Students & professionals</h3>
              <p>Build knowledge for your next opportunity.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Businesses & organizations</h3>
              <p>Work more confidently in a connected world.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <span className="eyebrow">HAVE AN ONLINE TASK TO DO?</span>
            <h2>
              Come in or reach out.
              <br />
              We can help you get started.
            </h2>
          </div>
          <div>
            <a className="button button-black" href="/contact">
              Contact the cyber café <ArrowUpRight size={20} />
            </a>
            <p>
              <MapPin size={14} /> Nairobi-based. Kenya-focused.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
