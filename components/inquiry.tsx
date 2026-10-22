"use client";
import { useLayoutEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  Mail,
  Check,
  ExternalLink,
} from "lucide-react";
import { useMotion } from "./use-motion";
type Intent = "parent" | "school" | "general";
const EMAIL = "trotrotransit@gmail.com";
export function Inquiry({
  initialIntent = "parent",
}: {
  initialIntent?: Intent;
}) {
  const [intent, setIntent] = useState<Intent>(initialIntent);
  const [review, setReview] = useState<{
    subject: string;
    body: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const reviewTitle = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const reviewSection = useRef<HTMLElement>(null);
  const pointerMotion = useRef(false);
  const animate = useMotion();
  useLayoutEffect(() => {
    animate(review ? reviewSection.current : form.current, {
      enabled: pointerMotion.current,
      y: review ? 6 : -4,
      duration: review ? 200 : 120,
    });
    pointerMotion.current = false;
  }, [review, animate]);
  const errorSummary = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedValues, setSavedValues] = useState<Record<string, string>>({});
  function prepare(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const invalid: Record<string, string> = {};
    for (const control of Array.from(e.currentTarget.elements)) {
      if (
        (control instanceof HTMLInputElement ||
          control instanceof HTMLTextAreaElement) &&
        !control.validity.valid
      )
        invalid[control.name] = control.validationMessage;
      if (
        control instanceof HTMLInputElement ||
        control instanceof HTMLTextAreaElement
      ) {
        if (
          control.required &&
          control.type !== "checkbox" &&
          !control.value.trim()
        ) {
          invalid[control.name] = "Please complete this field.";
        } else if (
          control.minLength > 0 &&
          control.value.trim().length < control.minLength
        ) {
          invalid[control.name] =
            `Please write at least ${control.minLength} characters.`;
        }
      }
    }
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }
    const data = new FormData(e.currentTarget);
    const labels: Record<string, string> = {
      name: "Name",
      email: "Email",
      phone: "Phone",
      school: "School or organization",
      neighborhood: "Neighborhood",
      children: "Children needing transportation",
      trip: "Trip type",
      timing: "Ride timing",
      role: "Role",
      families: "Estimated families",
      start: "Desired timing",
      message: "Message",
    };
    const body = Object.entries(labels)
      .filter(([key]) => data.get(key))
      .map(([key, label]) => `${label}: ${String(data.get(key)).trim()}`)
      .join("\n");
    setReview({
      subject:
        intent === "parent"
          ? "Transportation availability inquiry"
          : intent === "school"
            ? "School partnership inquiry"
            : "A question for TroTro",
      body: body + "\n\nI agree to be contacted about this inquiry.",
    });
    setCopied(false);
    setCopyError(false);
    requestAnimationFrame(() => {
      reviewTitle.current?.focus();
      reviewTitle.current?.scrollIntoView({
        block: "center",
        behavior: "instant",
      });
    });
  }
  function change(value: Intent) {
    if (value === intent) return;
    pointerMotion.current = false;
    if (form.current) {
      const data = new FormData(form.current);
      setSavedValues((previous) => ({
        ...previous,
        ...Object.fromEntries(
          Array.from(data.entries())
            .filter(([name]) => name !== "consent")
            .map(([name, value]) => [name, String(value)]),
        ),
      }));
    }
    setIntent(value);
    setReview(null);
    setErrors({});
  }
  return (
    <div className="inquiry">
      <div className="intent-tabs" role="group" aria-label="Inquiry type">
        {(["parent", "school", "general"] as Intent[]).map((x) => (
          <button key={x} aria-pressed={intent === x} onClick={() => change(x)}>
            {x === "parent"
              ? "For my family"
              : x === "school"
                ? "For my school"
                : "A question"}
          </button>
        ))}
      </div>
      {review && (
        <section className="inquiry-review" ref={reviewSection}>
          <span className="review-icon">
            <Mail aria-hidden="true" />
          </span>
          <h2 ref={reviewTitle} tabIndex={-1}>
            Your next step, ready to send.
          </h2>
          <p>
            Review your details, then open the draft in your email app and send
            it to TroTro. Your request has not been sent yet.
          </p>
          <div className="email-preview">
            <strong>To: {EMAIL}</strong>
            <strong>Subject: {review.subject}</strong>
            <pre>{review.body}</pre>
          </div>
          <div className="review-actions">
            <a
              className="button"
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(review.subject)}&body=${encodeURIComponent(review.body)}`}
            >
              Open email draft <ArrowUpRight aria-hidden="true" size={17} />
            </a>
            <button
              className="button button-secondary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `To: ${EMAIL}\nSubject: ${review.subject}\n\n${review.body}`,
                  );
                  setCopied(true);
                  setCopyError(false);
                } catch {
                  setCopied(false);
                  setCopyError(true);
                }
              }}
            >
              {copied ? "Copied" : "Copy request"}
              {copied && <Check aria-hidden="true" size={16} />}
            </button>
          </div>
          <p role="status" className="fine-print">
            {copied
              ? "Request copied. Paste it into your email app and send when ready."
              : copyError
                ? "Copy is unavailable in this browser. Select the request text above to copy it."
                : "No email app? Copy the request into your preferred email service."}
          </p>
          <button
            className="back-link"
            onClick={(event) => {
              pointerMotion.current = event.detail > 0;
              setReview(null);
              requestAnimationFrame(() =>
                form.current
                  ?.querySelector<HTMLInputElement>('[name="name"]')
                  ?.focus(),
              );
            }}
          >
            <ArrowLeft aria-hidden="true" size={16} /> Edit my details
          </button>
        </section>
      )}
      <form
        ref={form}
        hidden={!!review}
        onSubmit={prepare}
        onKeyDownCapture={() => {
          pointerMotion.current = false;
        }}
        key={intent}
        noValidate
        onInput={(event) => {
          const target = event.target;
          if (
            (target instanceof HTMLInputElement ||
              target instanceof HTMLTextAreaElement) &&
            target.validity.valid
          ) {
            setErrors((previous) => {
              if (!previous[target.name]) return previous;
              const next = { ...previous };
              delete next[target.name];
              return next;
            });
          }
        }}
      >
        <h2>
          {intent === "parent"
            ? "Tell us about your school run."
            : intent === "school"
              ? "Let’s get to know your community."
              : "What’s on your mind?"}
        </h2>
        <p>
          {intent === "parent"
            ? "Share a few details to start a conversation about availability. Plans start at $85/week; your exact plan is confirmed after a call."
            : intent === "school"
              ? "A few details will help the team understand your campus and transportation needs."
              : "We’ll help you find the right next step."}
        </p>
        <p className="field-hint">
          Fields are required unless marked optional.
        </p>
        {Object.keys(errors).length > 0 && (
          <div
            className="form-errors"
            ref={errorSummary}
            tabIndex={-1}
            role="alert"
          >
            <h3>Please check your details.</h3>
            <ul>
              {Object.entries(errors).map(([name, message]) => (
                <li key={name}>
                  <a
                    href={`#inquiry-${name}`}
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(`inquiry-${name}`)?.focus();
                    }}
                  >
                    {
                      (
                        {
                          name: "Your name",
                          email: "Email",
                          school: "School",
                          neighborhood: "Neighborhood or service area",
                          children: "Children needing transportation",
                          role: "Your role",
                          families: "Estimated families needing rides",
                          message: "Your message",
                          consent: "Contact consent",
                        } as Record<string, string>
                      )[name]
                    }
                    : {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="form-grid">
          <Field
            name="name"
            label="Your name"
            autoComplete="name"
            required
            defaultValue={savedValues.name}
            error={errors.name}
          />
          <Field
            name="email"
            label={intent === "school" ? "Work email" : "Email"}
            type="email"
            autoComplete="email"
            required
            defaultValue={savedValues.email}
            error={errors.email}
          />
          <Field
            name="phone"
            label="Phone (optional)"
            type="tel"
            autoComplete="tel"
            defaultValue={savedValues.phone}
          />
          {intent !== "general" && (
            <Field
              name="school"
              label={intent === "parent" ? "School" : "School or organization"}
              required
              defaultValue={savedValues.school}
              error={errors.school}
              autoComplete={intent === "school" ? "organization" : undefined}
            />
          )}
          {intent === "parent" && (
            <>
              <Field
                name="neighborhood"
                label="Neighborhood or service area"
                required
                hint="Neighborhood only. No home address needed."
                defaultValue={savedValues.neighborhood}
                error={errors.neighborhood}
              />
              <Field
                name="children"
                label="Children needing transportation"
                type="number"
                min={1}
                max={10}
                defaultValue={savedValues.children || "1"}
                required
                error={errors.children}
              />
              <label>
                Trip type
                <select
                  name="trip"
                  defaultValue={savedValues.trip || "Round trip"}
                >
                  <option>Round trip</option>
                  <option>One way</option>
                </select>
              </label>
              <label>
                When is the ride needed?
                <select
                  name="timing"
                  defaultValue={savedValues.timing || "Morning and afternoon"}
                >
                  <option>Morning and afternoon</option>
                  <option>Morning only</option>
                  <option>Afternoon only</option>
                </select>
              </label>
            </>
          )}
          {intent === "school" && (
            <>
              <Field
                name="role"
                label="Your role"
                autoComplete="organization-title"
                required
                defaultValue={savedValues.role}
                error={errors.role}
              />
              <Field
                name="families"
                label="Estimated families needing rides"
                type="number"
                min={1}
                required
                defaultValue={savedValues.families}
                error={errors.families}
              />
              <label className="full-field">
                Desired timing
                <select name="start" defaultValue={savedValues.start}>
                  <option>This school year</option>
                  <option>Next school year</option>
                  <option>Just exploring</option>
                </select>
              </label>
            </>
          )}
          <label className="full-field">
            {intent === "school"
              ? "What transportation challenge are you trying to solve?"
              : intent === "general"
                ? "Your question"
                : "Anything else? (optional)"}
            <textarea
              id="inquiry-message"
              name="message"
              rows={4}
              maxLength={2000}
              required={intent !== "parent"}
              minLength={intent !== "parent" ? 10 : undefined}
              defaultValue={savedValues.message}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={`inquiry-privacy${intent !== "parent" ? " message-hint" : ""}${errors.message ? " message-error" : ""}`}
            />
          </label>
          {intent !== "parent" && (
            <p className="field-hint full-field" id="message-hint">
              Write at least 10 characters.
            </p>
          )}
          {errors.message && (
            <p className="field-error full-field" id="message-error">
              {errors.message}
            </p>
          )}
        </div>
        <p className="privacy-note" id="inquiry-privacy">
          Please don’t include children’s names, dates of birth, home addresses,
          or student records.
        </p>
        <label className="consent">
          <input
            id="inquiry-consent"
            name="consent"
            type="checkbox"
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />{" "}
          <span>
            I agree to be contacted about this inquiry.{" "}
            <a href="/privacy">Privacy policy</a>
          </span>
        </label>
        {errors.consent && (
          <p className="field-error" id="consent-error">
            Please agree to be contacted before preparing your request.
          </p>
        )}
        <button
          type="submit"
          className="button"
          onClick={(event) => {
            pointerMotion.current = event.detail > 0;
          }}
        >
          Review my request <ArrowUpRight aria-hidden="true" size={17} />
        </button>
        <p className="fine-print">
          You’ll review your request before opening it in your email app.
        </p>
      </form>
      <div className="online-alternative">
        <p>Prefer to use the online form?</p>
        <a
          href={
            intent === "school"
              ? "https://www.jointrotro.com/schools#request-demo"
              : `https://www.jointrotro.com/contact?intent=${intent}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Continue to TroTro’s online{" "}
          {intent === "school" ? "school" : "contact"} form{" "}
          <ExternalLink aria-hidden="true" size={15} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
function Field({
  label,
  hint,
  error,
  ...props
}: {
  label: string;
  hint?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="form-field">
      <label htmlFor={`inquiry-${props.name}`}>{label}</label>
      <input
        {...props}
        id={`inquiry-${props.name}`}
        maxLength={props.type === "number" ? undefined : 160}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? `${props.name}-hint` : "", error ? `${props.name}-error` : ""]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
      {hint && (
        <span id={`${props.name}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${props.name}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
