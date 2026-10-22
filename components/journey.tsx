"use client";
import { useLayoutEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import { Photo } from "./ui";
import { useMotion } from "./use-motion";
const moments = [
  {
    label: "Before the ride",
    time: "A thoughtful start",
    title: "A plan before the first hello.",
    body: "Routes, stops and schedules are coordinated in advance. An assigned driver completes the required verification checkpoints before running a route.",
    image: "driver",
    alt: "An illustrative driver checks the passenger area of a parked vehicle.",
    note: "The people and the plan come first.",
    icon: ShieldCheck,
  },
  {
    label: "At pickup",
    time: "Ready for the day",
    title: "A familiar face. A confirmed pickup.",
    body: "See your assigned driver’s name, photo and vehicle in the app. The driver confirms pickup at the stop, and you receive an update.",
    image: "hero",
    alt: "An illustrative mother and child say goodbye beside a parked passenger vehicle.",
    note: "Pickup confirmed. You’re kept in the loop.",
    icon: Check,
  },
  {
    label: "Along the way",
    time: "Room to get on with your morning",
    title: "Their journey. A little more clarity.",
    body: "Follow the active ride on a live map, see its estimated arrival time and receive updates at the moments that matter.",
    image: "morning",
    alt: "An illustrative father helps his son prepare for school.",
    note: "Follow the ride in the parent app.",
    icon: Navigation,
  },
  {
    label: "At school",
    time: "One less thing to wonder about",
    title: "The arrival is part of the story, too.",
    body: "Drop-off is confirmed and recorded. You receive an update, and the completed ride leaves a record you can look back on.",
    image: "school",
    alt: "An illustrative group of children walks with an adult toward a brick school entrance.",
    note: "Drop-off recorded. Ready for the school day.",
    icon: MapPin,
  },
];
export function Journey() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const photo = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const motion = useRef({ enabled: false, direction: 1 });
  const animate = useMotion();
  function select(
    next: number,
    pointer: boolean,
    direction = next > active ? 1 : -1,
  ) {
    motion.current = { enabled: pointer && next !== active, direction };
    if (next === active) return;
    setActive(next);
  }
  useLayoutEffect(() => {
    const options = {
      enabled: motion.current.enabled,
      x: motion.current.direction * 8,
      y: 0,
    };
    animate(photo.current, options);
    animate(content.current, options);
    motion.current.enabled = false;
  }, [active, animate]);
  const m = moments[active];
  const Icon = m.icon;
  return (
    <section id="school-morning" className="journey-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="section-kicker">From your doorstep to theirs</p>
            <h2>Follow a school morning.</h2>
          </div>
          <p>
            A real journey, with thoughtful
            <br className="desktop-only" /> touches at every step.
          </p>
        </div>
        <div
          className="journey-tabs"
          role="tablist"
          aria-label="A school morning"
        >
          {moments.map((x, i) => (
            <button
              key={x.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`moment-tab-${i}`}
              role="tab"
              aria-selected={active === i}
              aria-controls="moment-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={(event) => select(i, event.detail > 0)}
              onKeyDown={(e) => {
                let next = i;
                if (e.key === "ArrowRight") next = (i + 1) % 4;
                else if (e.key === "ArrowLeft") next = (i + 3) % 4;
                else if (e.key === "Home") next = 0;
                else if (e.key === "End") next = 3;
                else return;
                e.preventDefault();
                select(next, false);
                tabs.current[next]?.focus();
              }}
            >
              <span className="journey-dot">{i + 1}</span>
              <span>{x.label}</span>
            </button>
          ))}
        </div>
        <div
          className="journey-panel"
          id="moment-panel"
          role="tabpanel"
          aria-labelledby={`moment-tab-${active}`}
          tabIndex={0}
        >
          <div className="journey-photo" ref={photo}>
            <Photo name={m.image} alt={m.alt} />
            <span className="journey-photo-note">
              <Icon aria-hidden="true" size={17} />
              {m.note}
            </span>
          </div>
          <div className="journey-copy">
            <div className="journey-content" ref={content}>
              <span className="moment-label">{m.time}</span>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
              {active === 2 && (
                <a className="journey-product" href="/download">
                  <img
                    src="/app-screens/driver.png"
                    alt="Actual TroTro product preview showing assigned driver and vehicle details"
                    width="796"
                    height="228"
                  />
                  <span>Actual app preview · Explore the parent app</span>
                </a>
              )}
            </div>
            <div className="journey-controls">
              <span aria-live="polite" aria-atomic="true">
                <span className="sr-only">School morning step </span>
                {String(active + 1).padStart(2, "0")} <span>/ 04</span>
                <span className="sr-only">: {m.title}</span>
              </span>
              <button
                onClick={(event) =>
                  select((active + 3) % 4, event.detail > 0, -1)
                }
                aria-label="Previous school morning step"
              >
                <ArrowLeft aria-hidden="true" size={18} />
              </button>
              <button
                onClick={(event) =>
                  select((active + 1) % 4, event.detail > 0, 1)
                }
                aria-label="Next school morning step"
              >
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </div>
          </div>
        </div>
        <p className="section-footnote">
          A typical ride sequence. Routes and schedules are confirmed for each
          family. Photographs are illustrative.
        </p>
      </div>
    </section>
  );
}
