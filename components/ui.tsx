import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Route,
  Heart,
  Check,
  MapPin,
} from "lucide-react";
import type { ReactNode } from "react";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="TroTro home"
      className={`brand ${light ? "brand-light" : ""}`}
    >
      <img
        className="brand-mark"
        src="/images/trotro-logo.png"
        width={512}
        height={512}
        alt=""
      />
      <span>TroTro</span>
    </Link>
  );
}
export function Button({
  href,
  children,
  secondary = false,
  light = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      className={`button ${secondary ? "button-secondary" : ""} ${light ? "button-light" : ""} ${className}`}
      href={href}
    >
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  );
}
export function TextLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <Link className={`text-link ${light ? "text-link-light" : ""}`} href={href}>
      {children}
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}
export function Photo({
  name,
  alt,
  className = "",
  priority = false,
}: {
  name: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <picture className={`photo ${className}`}>
      <source
        media="(max-width: 700px)"
        srcSet={`/images/${name}-small.webp`}
      />
      <img
        src={`/images/${name}.webp`}
        alt={alt}
        width={name === "hero" ? 1800 : 1200}
        height={name === "hero" ? 1000 : 900}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
export function IllustrationNote() {
  return (
    <p className="image-note">
      Illustrative scenes created with AI. Not photographs of TroTro families or
      operations.
    </p>
  );
}
export function TrustStrip() {
  return (
    <div className="trust-strip container">
      <span>
        <Heart aria-hidden="true" size={20} strokeWidth={1.5} /> Care at every
        step
      </span>
      <span>
        <ShieldCheck aria-hidden="true" size={20} strokeWidth={1.5} /> A
        documented verification process
      </span>
      <span>
        <Route aria-hidden="true" size={20} strokeWidth={1.5} /> Real rides.
        Thoughtfully coordinated.
      </span>
    </div>
  );
}
export const checks = [
  [
    "Identity & license",
    "Identity documents and license verification are recorded before a driver is cleared for routes.",
  ],
  [
    "Driving record & background",
    "Driving-record and background-check checkpoints form part of each driver’s verification record.",
  ],
  [
    "Vehicle inspection",
    "Vehicle inspection is tracked as a required checkpoint in the driver’s standing.",
  ],
  [
    "Training & current status",
    "Training completion is documented and checkpoint expirations are monitored over time.",
  ],
];
export function CheckList({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`check-list ${compact ? "compact" : ""}`}>
      {checks.map(([title, body]) => (
        <div key={title}>
          <span className="check-icon">
            <Check aria-hidden="true" size={17} />
          </span>
          <div>
            <h3>{title}</h3>
            {!compact && <p>{body}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
export function Closing() {
  return (
    <section className="closing">
      <div className="container closing-inner">
        <div className="closing-heading">
          <span className="sun" aria-hidden="true">
            ☀
          </span>
          <h2>
            A better school morning
            <br />
            starts here.
          </h2>
          <p>
            A familiar route. A thoughtful plan. A little more room to enjoy the
            morning.
          </p>
        </div>
        <div className="closing-paths">
          <div>
            <span>For your family</span>
            <h3>Let’s find your way to school.</h3>
            <Button href="/contact">Check ride availability</Button>
            <p>Service depends on your school and area.</p>
          </div>
          <div>
            <span>For your school</span>
            <h3>Make the journey part of the care.</h3>
            <Button secondary href="/contact?intent=school">
              Talk with TroTro
            </Button>
            <p>Start a conversation about your community.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
export function PageHero({
  label,
  title,
  body,
  image,
  alt,
  children,
}: {
  label: string;
  title: string;
  body: string;
  image?: string;
  alt?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className={`page-hero container ${image ? "page-hero-split" : ""}`}
    >
      <div>
        <p className="section-kicker">{label}</p>
        <h1>{title}</h1>
        <p className="lead">{body}</p>
        {children && <div className="hero-actions">{children}</div>}
      </div>
      {image && (
        <div className="page-hero-photo">
          <Photo name={image} alt={alt || ""} priority />
          <span className="photo-caption">
            A school morning, imagined with care.
          </span>
        </div>
      )}
    </section>
  );
}
export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="faq-list">
      {items.map(({ q, a }) => (
        <details key={q}>
          <summary>
            {q}
            <span aria-hidden="true">+</span>
          </summary>
          <div className="faq-answer">{a}</div>
        </details>
      ))}
    </div>
  );
}
export function PlaceNote() {
  return (
    <span className="place-note">
      <MapPin size={14} aria-hidden="true" /> Built around school communities
    </span>
  );
}
