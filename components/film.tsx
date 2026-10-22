"use client";
import { useEffect, useRef, useState } from "react";
import { Photo } from "./ui";

export function HeroFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const motionOverride = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let inView = true;
    function sync() {
      if (!el) return;
      if (
        document.hidden ||
        !inView ||
        pausedByUser.current ||
        (motion.matches && !motionOverride.current)
      ) {
        el.pause();
      } else {
        void el.play().catch(() => setPlaying(false));
      }
    }
    function changedMotion() {
      motionOverride.current = false;
      sync();
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    motion.addEventListener("change", changedMotion);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", changedMotion);
      document.removeEventListener("visibilitychange", sync);
      el.pause();
    };
  }, []);

  function pause() {
    pausedByUser.current = true;
    video.current?.pause();
  }

  return (
    <div className="hero-visual">
      <Photo
        name="hero"
        alt="Illustrative scene of a mother saying goodbye to her daughter beside a parked minivan, with a driver ready to greet them."
        priority
      />
      <video
        ref={video}
        className={`hero-video${ready ? " is-ready" : ""}`}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onLoadedData={() => setReady(true)}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setReady(false);
          setPlaying(false);
        }}
      >
        <source
          src="/films/morning-mobile.mp4"
          type="video/mp4"
          media="(max-width: 700px)"
        />
        <source src="/films/morning.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        className="hero-video-surface"
        aria-label={playing ? "Pause hero video" : "Play hero video"}
        aria-describedby="hero-film-description"
        onClick={() => {
          if (playing) pause();
          else {
            pausedByUser.current = false;
            motionOverride.current = true;
            void video.current?.play().catch(() => setPlaying(false));
          }
        }}
      />
      <p id="hero-film-description" className="sr-only">
        A silent, illustrative film: a family prepares for school, greets a
        driver and says goodbye as the child boards. A parent checks ride alerts
        in the TroTro app, the child arrives at school, and the parent continues
        their morning. Activate the video to pause or resume it.
      </p>
    </div>
  );
}
