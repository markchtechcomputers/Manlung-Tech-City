import React from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Laptop,
  Landmark,
  ListChecks,
  ReceiptText,
  ShieldCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { services, type Service } from "@/data/services";
import ServiceWhatsAppRequest from "@/components/ServiceWhatsAppRequest";
import { allServiceRequestOptions } from "@/data/serviceRequestOptions";

type ServicesPageProps = {
  slug?: string;
};

const iconMap: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  "graduation-cap": GraduationCap,
  landmark: Landmark,
  "receipt-text": ReceiptText,
  wrench: Wrench,
  laptop: Laptop,
};

const brandLogoMap: Record<string, string> = {
  landmark: "/images/ecitizen-logo.jpg",
  "receipt-text": "/images/kra-logo.jpg",
};

const serviceIllustrationMap: Record<string, string> = {
  "whatsapp-bot": "/images/whatsapp-bot.svg",
};

function ServiceIcon({ name, label }: { name: string; label: string }) {
  const illustration = serviceIllustrationMap[name];
  if (illustration) {
    return (
      <span className="service-icon" aria-hidden="true">
        <img src={illustration} alt="" />
      </span>
    );
  }
  const brandLogo = brandLogoMap[name];
  if (brandLogo) {
    return (
      <span className="service-icon service-icon-brand" aria-hidden="true">
        <img src={brandLogo} alt="" />
      </span>
    );
  }
  const Icon = iconMap[name] ?? ShieldCheck;
  return (
    <Icon className="service-icon" aria-label={label} aria-hidden="true" />
  );
}

function ServicesIndex() {
  return (
    <div>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">Manlung Tech City services</p>
          <h1>Practical technology support for safer digital work.</h1>
          <p className="section-copy">
            Explore focused cybersecurity, digital support, training, and
            application guidance for people and organisations in Kenya. Our
            services are delivered online, so you can work with Manlung from
            anywhere in the country.
          </p>
        </div>
      </section>

      <section className="page-section" aria-labelledby="services-heading">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">What we can help with</p>
              <h2 id="services-heading">Choose a starting point</h2>
            </div>
            <p className="section-copy">
              Start with the service closest to your need, then contact the team
              to discuss the right next step.
            </p>
          </div>

          <div className="services-grid">
            {services.map(service => (
              <article className="service-card" key={service.slug}>
                <ServiceIcon name={service.icon} label={service.title} />
                <p className="tag">{service.kicker}</p>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a className="text-link" href={`/services/${service.slug}`}>
                  Explore service <ArrowRight aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>

          <div className="content-block">
            <h2>Need help choosing?</h2>
            <p>
              Share what you are trying to achieve and we can help you identify
              a sensible place to begin.
            </p>
            <a className="button button-primary" href="/contact">
              Contact Manlung Tech City <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <ServiceWhatsAppRequest
        id="service-request-directory"
        heading="Find the right service to request"
        serviceCategory="Manlung Tech City services"
        options={allServiceRequestOptions}
        introduction="Search all listed services, choose one, or type your own request. Add your contact details and we’ll prepare a WhatsApp message for the team."
      />
    </div>
  );
}

function ServiceDetail({ service }: { service: Service }) {
  return (
    <div>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">{service.kicker}</p>
          <h1>{service.title}</h1>
          <p className="section-copy">{service.description}</p>
          <p className="muted">
            Get support online from anywhere in Kenya. If the official service
            requires an appointment, biometrics, or in-person attendance, the
            relevant authority's rules still apply.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/services">Services</a>
            <ChevronRight aria-hidden="true" />
            <span aria-current="page">{service.title}</span>
          </nav>

          <div className="detail-layout">
            <article className="detail-body">
              <section
                className="content-block"
                aria-labelledby="benefits-heading"
              >
                <p className="eyebrow">What this helps with</p>
                <h2 id="benefits-heading">A clear, practical next step</h2>
                <ul className="check-list">
                  {service.benefits.map(benefit => (
                    <li key={benefit}>
                      <Check aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                className="content-block"
                aria-labelledby="offerings-heading"
              >
                <p className="eyebrow">Scope</p>
                <h2 id="offerings-heading">What we can cover</h2>
                <ul className="check-list">
                  {service.offerings.map(offering => (
                    <li key={offering}>
                      <ListChecks aria-hidden="true" />
                      <span>{offering}</span>
                    </li>
                  ))}
                </ul>
                {service.slug === "cybersecurity-courses" && (
                  <a className="text-link" href="/courses">
                    View the full course catalogue{" "}
                    <ExternalLink aria-hidden="true" />
                  </a>
                )}
              </section>

              <section
                className="content-block"
                aria-labelledby="approach-heading"
              >
                <p className="eyebrow">How we work</p>
                <h2 id="approach-heading">A straightforward approach</h2>
                <ol className="step-list">
                  {service.approach.map((step, index) => (
                    <li key={step}>
                      <span className="step-number" aria-hidden="true">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </article>

            <aside className="detail-aside">
              <ServiceIcon name={service.icon} label="" />
              <p className="eyebrow">Good fit for</p>
              <h2>Who this is for</h2>
              <ul className="check-list">
                {service.audience.map(audience => (
                  <li key={audience}>
                    <Users aria-hidden="true" />
                    <span>{audience}</span>
                  </li>
                ))}
              </ul>
              <p className="muted">
                Tell us what you need help with and we will keep the
                conversation focused on your situation.
              </p>
              <a
                className="button button-primary"
                href={`#service-request-${service.slug}`}
              >
                Request this service on WhatsApp{" "}
                <ArrowRight aria-hidden="true" />
              </a>
              <a className="button button-outline" href="/services">
                Browse all services
              </a>
            </aside>
          </div>
        </div>
      </section>
      <ServiceWhatsAppRequest
        id={`service-request-${service.slug}`}
        heading={`Request ${service.title} via WhatsApp`}
        serviceCategory={service.title}
        options={service.offerings}
        introduction={`Choose or search a ${service.title.toLowerCase()} task, or type the request in your own words.`}
      />
    </div>
  );
}

function ServiceNotFound() {
  return (
    <div>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">Services</p>
          <h1>That service could not be found.</h1>
          <p className="section-copy">
            The page may have moved. Browse the current service list to find a
            relevant starting point.
          </p>
          <a className="button button-primary" href="/services">
            View services <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}

export default function ServicesPage({ slug }: ServicesPageProps) {
  if (!slug) return <ServicesIndex />;

  const service = services.find(item => item.slug === slug);
  return service ? <ServiceDetail service={service} /> : <ServiceNotFound />;
}
