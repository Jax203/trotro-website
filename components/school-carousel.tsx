"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, School } from "lucide-react";
import type { SchoolPartner } from "@/lib/school-partners";
import Image from "next/image";

export function SchoolCarousel({
  schools,
  preview = false,
}: {
  schools: SchoolPartner[];
  preview?: boolean;
}) {
  const id = useId();
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const items: SchoolPartner[] = preview
    ? Array.from({ length: 6 }, (_, i) => ({
        name: `School logo ${i + 1}`,
        logo: "",
      }))
    : schools;

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft <= 2,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [items.length]);

  function move(direction: number) {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({
      left: direction * ((card?.offsetWidth ?? el.clientWidth) + 16),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  if (!items.length) return null;

  return (
    <section
      className="school-carousel"
      aria-labelledby={`${id}-heading`}
      aria-roledescription="carousel"
    >
      <div className="school-carousel-heading">
        <div>
          <h2 id={`${id}-heading`}>Trusted by:</h2>
          {preview && <p>Layout preview · school partners to be confirmed</p>}
        </div>
        <div className="school-carousel-controls">
          <button
            type="button"
            aria-label="Previous school logos"
            aria-controls={`${id}-track`}
            disabled={edges.start}
            onClick={() => move(-1)}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next school logos"
            aria-controls={`${id}-track`}
            disabled={edges.end}
            onClick={() => move(1)}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul
        ref={track}
        id={`${id}-track`}
        className="school-carousel-track"
        tabIndex={0}
        aria-label={
          preview
            ? "School logo placeholders"
            : "Brooklyn schools that trust TroTro"
        }
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {items.map((school) => (
          <li key={school.name} className="school-carousel-card">
            {school.logo ? (
              <Image
                className={
                  school.darkBackground ? "school-logo-on-dark" : undefined
                }
                src={school.logo}
                alt=""
                width={200}
                height={100}
                loading="lazy"
                sizes="(max-width: 600px) 60vw, (max-width: 900px) 28vw, 260px"
              />
            ) : preview ? (
              <>
                <School size={32} strokeWidth={1.25} aria-hidden="true" />
                <span>{school.name}</span>
                <small>Preview placeholder</small>
              </>
            ) : (
              <span className="school-carousel-name-mark" aria-hidden="true">
                {school.name}
              </span>
            )}
            {!preview && (
              <span className="school-carousel-name">{school.name}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
