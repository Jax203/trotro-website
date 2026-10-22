"use client";

import { useCallback, useEffect, useRef } from "react";

type MotionOptions = {
  enabled: boolean;
  x?: number;
  y?: number;
  duration?: number;
  exit?: boolean;
  onFinish?: () => void;
};

/** Small, interruptible transitions; never gates content, focus or validation. */
export function useMotion() {
  const running = useRef(new Map<HTMLElement, Animation>());

  useEffect(() => {
    const animations = running.current;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => {
      if (preference.matches)
        for (const animation of animations.values()) animation.finish();
    };
    preference.addEventListener("change", finish);
    return () => {
      preference.removeEventListener("change", finish);
      for (const animation of animations.values()) {
        animation.onfinish = null;
        animation.cancel();
      }
      animations.clear();
    };
  }, []);

  return useCallback((element: HTMLElement | null, options: MotionOptions) => {
    if (!element) return;
    const {
      enabled,
      x = 0,
      y = 6,
      duration = 200,
      exit = false,
      onFinish,
    } = options;
    const previous = running.current.get(element);
    // Capture the current visual position before cancelling a rapid reversal.
    const current = previous
      ? {
          opacity: getComputedStyle(element).opacity,
          transform: getComputedStyle(element).transform,
        }
      : null;
    if (previous) {
      previous.onfinish = null;
      previous.cancel();
      running.current.delete(element);
    }
    if (
      !enabled ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !element.animate
    ) {
      onFinish?.();
      return;
    }
    const rest = { opacity: 1, transform: "translate3d(0, 0, 0)" };
    const offset = { opacity: 0, transform: `translate3d(${x}px, ${y}px, 0)` };
    const animation = element.animate(
      [current ?? (exit ? rest : offset), exit ? offset : rest],
      { duration, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "both" },
    );
    running.current.set(element, animation);
    animation.onfinish = () => {
      running.current.delete(element);
      onFinish?.();
      animation.cancel();
    };
  }, []);
}
