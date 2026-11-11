import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import WhatsAppMark from "@/components/WhatsAppMark";
import { buildWhatsAppRequestUrl } from "@/data/whatsappRequest";

type ServiceWhatsAppRequestProps = {
  id: string;
  heading: string;
  serviceCategory: string;
  options: readonly string[];
  initialValue?: string;
  introduction?: string;
};

export default function ServiceWhatsAppRequest({
  id,
  heading,
  serviceCategory,
  options,
  initialValue = "",
  introduction = "Choose a suggested task, search by typing, or enter the service you need. Add your contact details and we’ll prepare a WhatsApp message for you.",
}: ServiceWhatsAppRequestProps) {
  const [requestedTask, setRequestedTask] = useState(initialValue);
  const [draftLink, setDraftLink] = useState("");
  const [notice, setNotice] = useState("");
  const suggestionsId = `${id}-suggestions`;

  useEffect(() => {
    if (initialValue) setRequestedTask(initialValue);
    else {
      const taskFromLink = new URLSearchParams(window.location.search).get(
        "service"
      );
      if (taskFromLink) setRequestedTask(taskFromLink);
    }
  }, [initialValue]);

  function prepareWhatsAppMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const name = String(values.get("name") || "").trim();
    const phone = String(values.get("phone") || "").trim();
    const email = String(values.get("email") || "").trim();
    const details = String(values.get("details") || "").trim();
    const task = String(values.get("service") || "").trim();
    const url = buildWhatsAppRequestUrl({
      serviceCategory,
      task,
      name,
      phone,
      email,
      details,
    });

    setDraftLink(url);
    setNotice(
      "Your message draft is ready. Review it in WhatsApp and tap Send. If WhatsApp did not open, use the link below."
    );
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section
      className="service-whatsapp-section"
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container service-whatsapp-card">
        <div className="service-whatsapp-intro">
          <span className="eyebrow">PERSONAL SERVICE REQUEST</span>
          <h2 id={`${id}-heading`}>{heading}</h2>
          <p>{introduction}</p>
          <div className="service-whatsapp-safety">
            <ShieldCheck size={20} aria-hidden="true" />
            <p>
              For your safety, do not enter passwords, one-time codes, national
              ID numbers, KRA PINs, API keys, access tokens, app secrets or
              sensitive document details here.
            </p>
          </div>
        </div>

        <form
          className="service-whatsapp-form"
          onSubmit={prepareWhatsAppMessage}
          onChange={() => {
            setDraftLink("");
            setNotice("");
          }}
        >
          <div className="service-whatsapp-fields">
            <label>
              Full name <span aria-hidden="true">*</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Your name"
              />
            </label>
            <label>
              WhatsApp phone number <span aria-hidden="true">*</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                minLength={7}
                maxLength={30}
                placeholder="+254 ..."
              />
            </label>
            <label>
              Email address <small>(optional)</small>
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={180}
                placeholder="you@example.com"
              />
            </label>
            <label className="service-whatsapp-task">
              Service or task <span aria-hidden="true">*</span>
              <input
                name="service"
                type="search"
                list={suggestionsId}
                autoComplete="off"
                required
                minLength={2}
                maxLength={180}
                value={requestedTask}
                onChange={event => setRequestedTask(event.target.value)}
                placeholder="Search or type, e.g. Good Conduct renewal"
                aria-describedby={`${id}-task-hint`}
              />
              <datalist id={suggestionsId}>
                {options.map(option => (
                  <option value={option} key={option} />
                ))}
              </datalist>
              <small id={`${id}-task-hint`}>
                Start typing to filter suggestions, or enter a different
                request.
              </small>
            </label>
            <label className="service-whatsapp-details">
              Request details <small>(optional)</small>
              <textarea
                name="details"
                rows={4}
                maxLength={1200}
                placeholder="Briefly describe the help you need. Do not include private IDs, passwords or one-time codes."
              />
            </label>
          </div>
          <button className="button service-whatsapp-submit" type="submit">
            <WhatsAppMark className="whatsapp-mark" />
            Prepare WhatsApp request
            <ArrowUpRight size={17} aria-hidden="true" />
          </button>
          <p className="service-whatsapp-note">
            This opens a pre-filled message; nothing is sent automatically from
            the website. Check it in WhatsApp and tap <strong>Send</strong> to
            share your request.
          </p>
          {notice && draftLink && (
            <div className="service-whatsapp-feedback" role="status">
              <p>{notice}</p>
              <a href={draftLink} target="_blank" rel="noopener noreferrer">
                Open prepared WhatsApp message{" "}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          )}
          <p className="service-whatsapp-review-link">
            After your service is complete, you can share a rating{" "}
            <a
              href={`/review?service=${encodeURIComponent(requestedTask || serviceCategory)}`}
            >
              on the review page
            </a>
            .
          </p>
        </form>
      </div>
    </section>
  );
}
