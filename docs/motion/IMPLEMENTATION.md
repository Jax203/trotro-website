# TroTro interaction motion — implemented

October 21, 2026. Local preview: http://127.0.0.1:3001.

- Journey: a 200ms opacity and 8px directional translation on the photo and content. Tabs, live step label and arrow controls remain stationary. New selections interrupt the current animation instead of queuing it. The existing panel sizing remains in place; individual stages can have different content heights.
- Mobile menu: 200ms entrance from a 6px offset, 120ms exit. Closing links become inert and hidden from assistive technology immediately, before the visual exit finishes. Escape, keyboard activation, route changes and desktop resizing keep their immediate behavior.
- Inquiry review: 200ms entrance and 120ms return to editing. Focus moves without waiting for animation. Validation, entered values, clipboard feedback and the unsent-draft workflow are preserved.
- A shared native Web Animations helper handles interruptions, unmount cleanup, unsupported animation APIs and reduced-motion preferences. Changing reduced motion while an animation is running finishes it immediately. Keyboard-triggered changes bypass these transitions. No dependency was added.
- The mobile video-first order, hidden mobile header CTA and clean autoplay hero are preserved. Desktop layout is unchanged. The journey app-preview image now retains its intrinsic aspect ratio instead of stretching.

## Verification

Production build passed. The full 53-test suite passed, covering the existing routes, structured data, hero, forms and accessibility plus four new motion regressions. These exercise pointer/keyboard differences, rapid navigation, menu reversals, inert closing links, focus retention and reduced-motion changes. Accessibility snapshots wait for finite animations to settle, while separate tests check in-flight behavior.

Responsive checks at 320, 390, 700, 768 and 1440px found no horizontal overflow. Video-first ordering and the hidden header CTA remain limited to widths up to 700px.

Source files: `components/use-motion.ts`, `components/journey.tsx`, `components/header.tsx`, `components/inquiry.tsx`, `app/globals.css`. Regression coverage: `tests/motion.spec.ts` and the settled-state helper in `tests/accessibility.spec.ts`.

Physical-device and screen-reader sessions were not performed. This is not a full WCAG conformance certification.
