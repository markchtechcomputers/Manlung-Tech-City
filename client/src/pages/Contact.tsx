import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import ServiceWhatsAppRequest from "@/components/ServiceWhatsAppRequest";
import { businessContact } from "@/data/contact";
import { allServiceRequestOptions } from "@/data/serviceRequestOptions";

export default function Contact() {
  const [service, setService] = useState("");
  const [pending, setPending] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    setService(
      new URLSearchParams(window.location.search).get("service") || ""
    );
  }, []);
  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(values.get("name") || "").trim(),
          email: String(values.get("email") || "").trim(),
          phone: String(values.get("phone") || "").trim(),
          service: service.trim(),
          message: String(values.get("message") || "").trim(),
          consent: values.get("consent") === "on",
          website: String(values.get("website") || ""),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.reference)
        throw new Error(
          result.error || "Your inquiry could not be saved. Please try again."
        );
      setReference(result.reference);
      form.reset();
      setService("");
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "We couldn't connect. Please try again or contact us on WhatsApp."
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <span className="eyebrow">GOOD THINGS START WITH A CONVERSATION</span>
          <h1>
            What's your
            <br />
            <em>next step?</em>
          </h1>
          <p>
            Need a service, a course, or a little direction?
            <br />
            Tell us what you're working on. We'll help you find a way forward.
          </p>
        </div>
      </section>
      <section className="page-section">
        <div className="container contact-layout">
          <div className="contact-info">
            <span className="eyebrow">CONTACT MANLUNG TECH CITY</span>
            <h2>
              Real questions.
              <br />
              Practical support.
            </h2>
            <p>
              Speak with us about cybersecurity learning, technology support,
              KRA assistance, or government e-services. Our support is delivered
              online, so you can contact us from anywhere in Kenya. Any required
              official appointment or in-person step still follows the relevant
              authority's rules.
            </p>
            <a className="contact-method" href={businessContact.phoneHref}>
              <Phone />
              <span>
                Call us<strong>{businessContact.phoneDisplay}</strong>
              </span>
              <ArrowUpRight size={18} />
            </a>
            <a className="contact-method" href={businessContact.emailHref}>
              <Mail />
              <span>
                Email us<strong>{businessContact.email}</strong>
              </span>
              <ArrowUpRight size={18} />
            </a>
            <div className="contact-method">
              <MapPin />
              <span>
                Our base<strong>Nairobi, Kenya</strong>
              </span>
            </div>
            <a
              className="text-link telegram-link"
              href={businessContact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Prefer WhatsApp? Chat with us <ArrowUpRight size={17} />
            </a>
            <div className="privacy-note">
              <ShieldCheck size={21} />
              <p>
                Please don't share passwords, one-time codes, national ID
                numbers, or tax documents in your initial inquiry.
              </p>
            </div>
          </div>
          <div className="contact-form-panel">
            <h2>Tell us how we can help</h2>
            <p className="muted">
              Send an inquiry directly to Manlung Tech City.
            </p>
            {reference ? (
              <div className="form-success" role="status">
                <Check size={22} />
                <div>
                  <strong>Your inquiry has been received.</strong>
                  <p>
                    Thank you for reaching out. Your request is securely stored
                    for the team to follow up using the contact details you
                    provided.
                  </p>
                  <p>
                    Reference: <code>{reference}</code>
                  </p>
                  <button
                    className="text-link"
                    onClick={() => setReference("")}
                  >
                    Send another inquiry <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitInquiry} aria-busy={pending}>
                <div className="form-row">
                  <label>
                    Full name <span>*</span>
                    <input
                      name="name"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                      minLength={2}
                      maxLength={100}
                      pattern=".*\S.*"
                      disabled={pending}
                    />
                  </label>
                  <label>
                    Email address <span>*</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      maxLength={180}
                      disabled={pending}
                    />
                  </label>
                </div>
                <label>
                  Phone number <small>(optional)</small>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+254 ..."
                    maxLength={30}
                    disabled={pending}
                  />
                </label>
                <label>
                  What do you need help with? <span>*</span>
                  <input
                    name="service"
                    value={service}
                    onChange={e => setService(e.target.value)}
                    list="service-options"
                    placeholder="Choose or type a service"
                    required
                    minLength={2}
                    maxLength={160}
                    pattern=".*\S.*"
                    disabled={pending}
                  />
                  <datalist id="service-options">
                    <option value="Cybersecurity support" />
                    <option value="Cybersecurity courses" />
                    <option value="Government e-services / NTSA" />
                    <option value="KRA & iTax assistance" />
                    <option value="Security tool setup" />
                    <option value="IT & digital support" />
                  </datalist>
                </label>
                <label>
                  Your message <span>*</span>
                  <textarea
                    name="message"
                    placeholder="A little context helps us guide you better..."
                    rows={5}
                    required
                    minLength={10}
                    maxLength={2500}
                    disabled={pending}
                  />
                </label>
                <div className="honeypot" aria-hidden="true">
                  <label>
                    Leave this field empty
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <label className="consent-label">
                  <input
                    name="consent"
                    type="checkbox"
                    required
                    disabled={pending}
                  />
                  <span>
                    I agree to Manlung Tech City storing this inquiry and
                    contacting me about my request.{" "}
                    <a href="/privacy">Privacy information</a>
                  </span>
                </label>
                <button
                  className="button button-black"
                  type="submit"
                  disabled={pending}
                >
                  {pending ? (
                    <>
                      Sending inquiry{" "}
                      <Loader2 size={18} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Send my inquiry <ArrowUpRight size={18} />
                    </>
                  )}
                </button>
                <p className="small-note">
                  Your inquiry is saved only after a successful submission. No
                  payment or account login is required.
                </p>
                {error && (
                  <div className="form-error" role="alert">
                    {error}
                    <br />
                    <a
                      href={businessContact.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link"
                    >
                      Contact us on WhatsApp instead <ArrowUpRight size={15} />
                    </a>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
      <ServiceWhatsAppRequest
        id="contact-whatsapp-request"
        heading="Send a service request via WhatsApp"
        serviceCategory="Manlung Tech City services"
        options={allServiceRequestOptions}
        initialValue={service}
        introduction="Search all listed services, choose a specific task, or type your request. Add your contact details and continue to WhatsApp with the message prepared."
      />
    </>
  );
}
