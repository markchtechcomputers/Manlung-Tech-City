import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";
import { allServiceRequestOptions } from "@/data/serviceRequestOptions";
import {
  buildReviewEmailUrl,
  buildReviewWhatsAppUrl,
} from "@/data/reviewMessage";

export default function Review() {
  const formRef = useRef<HTMLFormElement>(null);
  const [service, setService] = useState("");
  const [rating, setRating] = useState(0);
  const [draftLink, setDraftLink] = useState("");
  const [channel, setChannel] = useState<"WhatsApp" | "email" | "">("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get(
      "service"
    );
    if (requestedService) setService(requestedService);
  }, []);

  function prepareReviewMessage(destination: "whatsapp" | "email") {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    const values = new FormData(form);
    const request = {
      service: String(values.get("service") || "").trim(),
      rating: Number(values.get("rating")),
      feedback: String(values.get("feedback") || "").trim(),
      name: String(values.get("name") || "").trim(),
      email: String(values.get("email") || "").trim(),
    };
    const url =
      destination === "whatsapp"
        ? buildReviewWhatsAppUrl(request)
        : buildReviewEmailUrl(request);

    setDraftLink(url);
    setChannel(destination === "whatsapp" ? "WhatsApp" : "email");
    setNotice(
      "Your private feedback draft is ready. Review it in the chosen app and press Send to share it with Manlung Tech City."
    );
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // The prepared link below remains available if the browser blocks opening a new tab.
    }
  }

  return (
    <>
      <section className="page-intro review-page-intro">
        <div className="container">
          <span className="eyebrow">YOUR EXPERIENCE MATTERS</span>
          <h1>
            How did we
            <br />
            <em>do?</em>
          </h1>
          <p>
            Once your service is complete, tell us how it went. Choose a rating
            and send private feedback to the Manlung team.
          </p>
        </div>
      </section>
      <section className="page-section review-page-section">
        <div className="container review-page-layout">
          <aside className="review-page-note">
            <Star size={30} aria-hidden="true" />
            <h2>Help us improve</h2>
            <p>
              Your honest feedback helps us understand what worked and where we
              can do better.
            </p>
            <div className="review-privacy-note">
              <ShieldCheck size={20} aria-hidden="true" />
              <p>
                This page prepares a private message to our team. Reviews are
                not stored or published publicly from this form.
              </p>
            </div>
            <p className="review-follow-up-note">
              Manlung can share this review link with you after a completed
              service. This website does not send automatic follow-up messages.
            </p>
          </aside>

          <form
            className="review-form"
            ref={formRef}
            onSubmit={event => event.preventDefault()}
            onChange={() => {
              setDraftLink("");
              setChannel("");
              setNotice("");
            }}
          >
            <h2>Share your rating</h2>
            <label>
              Service or task <span aria-hidden="true">*</span>
              <input
                type="search"
                name="service"
                list="review-service-suggestions"
                autoComplete="off"
                required
                minLength={2}
                maxLength={180}
                value={service}
                onChange={event => setService(event.target.value)}
                placeholder="Search or type the service you received"
              />
              <datalist id="review-service-suggestions">
                {allServiceRequestOptions.map(option => (
                  <option value={option} key={option} />
                ))}
              </datalist>
            </label>

            <fieldset className="review-rating-fieldset">
              <legend>
                Your rating <span aria-hidden="true">*</span>
              </legend>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map(value => (
                  <label
                    key={value}
                    className={rating >= value ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={value}
                      checked={rating === value}
                      required
                      aria-label={`${value} out of 5 stars`}
                      onChange={() => setRating(value)}
                    />
                    <span aria-hidden="true">★</span>
                  </label>
                ))}
              </div>
              <p aria-live="polite">
                {rating ? `${rating} out of 5 stars` : "Choose 1 to 5 stars"}
              </p>
            </fieldset>

            <label>
              Your feedback <span aria-hidden="true">*</span>
              <textarea
                name="feedback"
                rows={5}
                minLength={5}
                maxLength={1500}
                required
                placeholder="What went well? What could we improve?"
              />
            </label>

            <div className="review-contact-fields">
              <label>
                Name <small>(optional)</small>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Your name"
                />
              </label>
              <label>
                Email for a reply <small>(optional)</small>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={180}
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <div className="review-send-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => prepareReviewMessage("whatsapp")}
              >
                <MessageCircle size={17} aria-hidden="true" /> Send via WhatsApp
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
              <button
                className="button button-outline"
                type="button"
                onClick={() => prepareReviewMessage("email")}
              >
                <Mail size={17} aria-hidden="true" /> Send via email
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="review-send-note">
              Nothing is shared until you check the draft and press{" "}
              <strong>Send</strong> in WhatsApp or your email app. Do not
              include passwords, one-time codes, ID numbers or tax documents.
            </p>
            {notice && draftLink && (
              <div className="review-feedback-status" role="status">
                <p>{notice}</p>
                <a href={draftLink} target="_blank" rel="noopener noreferrer">
                  Open prepared {channel} draft{" "}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
