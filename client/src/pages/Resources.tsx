import React from "react";
import {
  ArrowRight,
  BookOpenText,
  ChevronRight,
  Clock3,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { resources, type Resource } from "@/data/resources";

type ResourcesPageProps = {
  slug?: string;
};

const iconMap: Record<string, LucideIcon> = {
  "cybersecurity-basics": ShieldAlert,
  "learning-guide": BookOpenText,
  "digital-confidence": Smartphone,
};

function ResourceIcon({ category }: { category: string }) {
  const Icon =
    iconMap[category.toLowerCase().replaceAll(" ", "-")] ?? ShieldCheck;
  return <Icon className="article-icon" aria-hidden="true" />;
}

function ResourcesIndex() {
  return (
    <div>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">Manlung Tech City resources</p>
          <h1>Useful guidance for everyday digital decisions.</h1>
          <p className="section-copy">
            Short, practical reads to help you recognise risk, build
            cybersecurity foundations, and approach online services with
            confidence.
          </p>
        </div>
      </section>

      <section className="page-section" aria-labelledby="resources-heading">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Read and apply</p>
              <h2 id="resources-heading">Practical resources</h2>
            </div>
            <p className="section-copy">
              These evergreen notes are educational starting points, not a
              substitute for official instructions or situation-specific advice.
            </p>
          </div>

          <div className="article-grid">
            {resources.map(resource => (
              <article className="article-card" key={resource.slug}>
                <ResourceIcon category={resource.category} />
                <p className="tag">{resource.category}</p>
                <h3>{resource.title}</h3>
                <p>{resource.summary}</p>
                <div className="muted resource-meta">
                  <Clock3 aria-hidden="true" /> {resource.readTime}
                </div>
                <a className="text-link" href={`/insights/${resource.slug}`}>
                  Read resource <ArrowRight aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ResourceDetail({ resource }: { resource: Resource }) {
  return (
    <div>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">{resource.category}</p>
          <h1>{resource.title}</h1>
          <p className="section-copy">{resource.summary}</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/insights">Resources</a>
            <ChevronRight aria-hidden="true" />
            <span aria-current="page">{resource.title}</span>
          </nav>

          <div className="detail-layout">
            <article className="detail-body resource-body">
              <div className="muted resource-meta">
                <Clock3 aria-hidden="true" /> {resource.readTime}
              </div>
              {resource.sections.map(section => (
                <section className="content-block" key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
              <p className="small-note">
                General educational information from Manlung Tech City. Follow
                the latest instructions from the relevant official service or
                trusted security contact for your situation.
              </p>
            </article>

            <aside className="detail-aside">
              <ResourceIcon category={resource.category} />
              <p className="eyebrow">Keep learning</p>
              <h2>Need help applying this?</h2>
              <p className="muted">
                If you want to discuss a digital task, security concern, or
                learning goal, share the context with our team.
              </p>
              <a
                className="button button-primary"
                href={`/contact?service=${encodeURIComponent(resource.title)}`}
              >
                Contact the team <ArrowRight aria-hidden="true" />
              </a>
              <a className="button button-outline" href="/insights">
                Back to resources
              </a>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function ResourceNotFound() {
  return (
    <div>
      <section className="page-intro">
        <div className="container">
          <p className="eyebrow">Resources</p>
          <h1>That resource could not be found.</h1>
          <p className="section-copy">
            Browse the resource library for practical guidance on cybersecurity
            and digital services.
          </p>
          <a className="button button-primary" href="/insights">
            View resources <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}

export default function ResourcesPage({ slug }: ResourcesPageProps) {
  if (!slug) return <ResourcesIndex />;

  const resource = resources.find(item => item.slug === slug);
  return resource ? (
    <ResourceDetail resource={resource} />
  ) : (
    <ResourceNotFound />
  );
}
