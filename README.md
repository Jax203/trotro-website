# TroTro — a better school morning

A complete service-first website redesign built with Next.js App Router, React, TypeScript and custom CSS. The starting workspace was empty; the stack follows the existing live Next.js site.

Preview: https://trotro-preview.vercel.app

To work on your own copy, fork this repository on GitHub, clone your fork, and follow the local setup below. No environment variables or backend credentials are required to run the preview.

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000.

```sh
npm run typecheck
npm run build
npm start
npm run test:e2e
```

Browser tests require Chromium (`npx playwright install chromium`). They do not submit inquiries or send messages.

## What's included

- Homepage with editorial family storytelling and an accessible four-step school-morning experience.
- Parent, school, safety, about, contact, download, privacy and terms pages.
- Four custom Higgsfield images, responsive WebP variants, and a 15-second silent film with desktop/mobile MP4 exports.
- A real TroTro app screenshot composited into the film; actual product screenshots throughout the site.
- Keyboard navigation, native FAQ disclosures, a muted autoplay hero video with a tap/keyboard pause control, reduced-motion support, visible focus, and semantic landmarks.
- A video-first mobile hero and interruptible animations for the journey, mobile menu, and inquiry review; keyboard and reduced-motion interactions remain immediate.
- Self-hosted WOFF2 typography with open-font license notices.
- Page metadata, canonical URLs, sitemap, robots and a custom icon.
- Homepage “Trusted by” carousel with the ten schools selected by the user: nine official logos and one text-only school name. Supports swipe, keyboard arrows, previous/next controls and reduced motion. A dedicated `/partner-preview` remains noindex. Sources are recorded in `docs/school-logo-sources.md`.

## Inquiry behavior and integration boundary

The original source and backend were not supplied. The live site uses private Next.js server actions tied to its deployment; hard-coding those hashes would be brittle.

The redesigned form validates details, requires contact consent, preserves them through review/edit, and creates an email draft to the verified public TroTro address. A visitor must explicitly send that draft in their email app. A copy option is available. The page never claims that an inquiry has been delivered.

Existing online parent, school and general forms remain available through explicit links to jointrotro.com. The current product tour and App Store / Google Play links are also preserved.

Before replacing the live deployment, integrate its original inquiry actions/backend into this project. Do not deploy these handoff links back to the same replacement host without preserving the original forms at a separate stable destination. The redesign is deployed to a separate Vercel preview; the original business website and backend remain unchanged.

## Content and asset provenance

See `docs/creative-direction.md` for the existing-site audit, layout plan, tokens, photography direction and operational constraints. See `docs/asset-provenance.md` for media sources and generation IDs.

Pricing, service availability, pilot status, driver checkpoints and the provisional school onboarding process were checked against the live site on October 21, 2026. Privacy and terms content is preserved verbatim from the live main content, with presentation markup simplified. Review current business information again before publishing.

All lifestyle imagery and film depict synthetic illustrative scenes, not actual TroTro families, staff, vehicles or partner schools. This distinction is stated on the website. No fictional founder biographies, reviews or safety guarantees were added. The school carousel uses the user-supplied school selection and official artwork.

## Checks

The Playwright tests in `tests/` cover desktop/mobile page rendering, automated accessibility checks, keyboard journey navigation, mobile menu, consent validation, draft review/edit, school inquiry routing, FAQs, hero video playback, reduced-motion behavior, app links, image loading, structured data, internal destinations and partner-preview indexing.

This is a preview implementation ready for review. Original backend integration and authentic team materials remain prerequisites for their respective production features.

## Structured data

All nine public pages include typed, server-rendered JSON-LD describing TroTro, its website and the current page. About and contact use their specific page types. Values are restricted to existing verified identity and visible page copy; preview and error pages are excluded. See `docs/structured-data.md` for the schema map, external validation results, complete JSON-LD examples and maintenance guidance.
