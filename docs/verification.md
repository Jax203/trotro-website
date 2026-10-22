# Verification · October 21, 2026

- `npm run typecheck`: passed.
- `npm run build`: passed; marketing routes prerendered, contact reads inquiry intent at request time.
- `npx playwright test` against the production build: **26 passed (6.5 seconds)**.
- Automated axe WCAG 2 A/AA and WCAG 2.1 AA checks: no violations on the nine public routes at 390px and 1440px. Automated checks are not a substitute for a complete manual accessibility audit.
- Tested: mobile navigation and Escape/focus return; keyboard journey tabs; native FAQ keyboard access; required inquiry consent; email review/edit data retention; correct school intent; original online form handoffs; both app-store links; video metadata/controls and modal focus return; local image loading; internal homepage destinations; no horizontal overflow, including homepage at 320px; partner treatment noindex and sitemap exclusion.
- Desktop and mobile screenshots visually reviewed. Corrected the app screenshot aspect ratio and increased desktop reading sizes.
- Film contact sheet and product insert visually reviewed. Film has no audio and does not autoplay. Final exports: 1280×720 and 768×432, both 15 seconds.
- Dependency install audit: zero reported vulnerabilities after upgrading sharp to the patched version.
- No production form was submitted, no email sent, and no live site was deployed or changed.

## Remaining production integration

The original project/backend is absent. Inquiry forms therefore use an explicitly reviewed email draft and link to the still-live original online forms. Before a domain cutover, migrate the original first-party submission backend and product tour or preserve those originals at a separate stable destination; otherwise same-domain handoff links would no longer reach the original application.

School-logo and team-story materials require documented relationships, display permission and authentic content. The website makes no invented claims in their place.
