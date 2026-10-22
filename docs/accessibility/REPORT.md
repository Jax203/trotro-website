# TroTro accessibility and UX audit

> Subsequent update, October 21: the user requested a clean hero with no overlays. The visible Pause/Full film controls, caption and illustration badge were removed; the whole video remains a keyboard-operable click/tap playback control with an accessible text alternative. The full-film modal was removed. The historical report below describes the preceding audit snapshot; 34 affected tests passed after the cleanup. See the [current motion audit](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/motion/AUDIT.md>).

Audit date: October 21, 2026 (America/New_York). Scope: the local redesigned Next.js site at http://127.0.0.1:3001. Changes are implemented locally; the public production site was not deployed.

The approved visual direction is preserved. Readability, focus, form behavior, responsive sizing and accessible semantics were improved. The subsequent request for an automatically playing hero film is also implemented: muted inline looping playback, a visible keyboard-operable Pause/Play button, an opt-in still-image state for reduced motion, and a still-image fallback if playback fails. User pauses persist across scrolling; the hero pauses outside the viewport, in a hidden tab, and when the full film opens.

## Scorecard

“Pass” means the checks described below passed in the tested environment, not a blanket conformance certification. Counts represent distinct remediation groups, rather than repeated occurrences across routes. The WCAG row is the total, not an additional set of fixes. Remaining counts are validation gaps, not confirmed defects.

| Category | Status | Issues fixed | Remaining |
|---|---|---:|---:|
| Typography | Pass | 1 | 0 |
| Contrast | Pass | 2 | 0 |
| Keyboard accessibility | Pass | 3 | 0 |
| Screen readers | Needs Work | 4 | 1 |
| Mobile responsiveness | Needs Work | 3 | 1 |
| Images and video | Pass | 1 | 0 |
| Forms and interactions | Pass | 3 | 0 |
| WCAG 2.2 AA | Needs Work | 17 | 2 |

The remaining work is hands-on assistive-technology and physical-device validation. No known critical or serious defect remains in the tested states. Automated scores alone do not establish WCAG conformance.

## Changes and verification

| ID | Finding / improvement | Fix | Relevant requirement or project target |
|---|---|---|---|
| T1 | Shared body, control, caption and footer text was unnecessarily small; some labels were 8–9px and buttons were 12px. | Introduced body/UI/small text tokens. Body is 18px on desktop and 16px at widths up to 900px; controls/navigation/supporting descriptions are generally 16px; captions/labels are at least 14px; footer text is 16px. Display heading scale retained. | Project readability targets; 1.4.4, 1.4.10, 1.4.12 |
| C1 | Input boundaries were difficult to distinguish. | Border changed from #a8b2a1 to #73806f. Contrast against the paper field background increased from 2.05:1 to 3.87:1. Errors also have text and a thicker border. | 1.4.11, 1.4.1 |
| C2 | Photo text relied on a variable photographic background and translucent label. | Stronger caption scrim and solid pine illustration label; opaque video control with a white boundary. Reviewed against the still image and film frames. | 1.4.3, 1.4.11 |
| K1 | Editing an inquiry draft lost the intended keyboard focus destination. | “Edit my details” restores focus to the name field. | 2.4.3 |
| K2 | Skip destination lacked explicit programmatic focusability. | Main content now has tabindex=-1; a Tab/Enter test confirms the skip link focuses it. | 2.4.1 |
| K3 | Carousel edge focus outlines could be clipped by the scrolling area. | Added inset track padding and card scroll margins; keyboard scrolling remains available. | 2.4.7, 2.4.11 |
| S1 | Decorative SVG icons appeared as unnamed images in Chrome’s native accessibility tree. | Decorative Lucide icons are hidden from assistive technology; button/link names remain in text or aria-label. | 1.1.1, 4.1.2 |
| S2 | The East New York school fallback name was announced twice. | Visual wordmark is hidden from AT; its adjacent school name remains exposed once. | 1.1.1 |
| S3 | Inactive journey tabs referenced nonexistent panel IDs; arrow-button changes needed an announcement. | All tabs reference the persistent panel; selected-tab labeling and a concise live step announcement are maintained. | 1.3.1, 4.1.2, 4.1.3 |
| S4 | Unknown-route title inherited the homepage title. | Explicit “Page not found” metadata, including the dynamic slug fallback. | 2.4.2 |
| R1 | Larger readable navigation and CTA text needed room at intermediate/mobile widths. | Menu breakpoint at 1100px, flexible header height, stacked mobile CTA, and stale menu state cleared on desktop resize. | 1.4.4, 1.4.10 |
| R2 | Homepage at 320px overflowed with the prescribed text-spacing override. | Intrinsic grid sizing, wrapping and break opportunities prevent overflow without hiding page content. Form intent controls stack on small screens. | 1.4.10, 1.4.12 |
| R3 | Enlarged app-preview captions needed more room around positioned artwork. | Adjusted artwork limits and placed the marginal note in flow at narrow/intermediate widths. Dialog is height-limited and scrollable. Journey and close controls are 44px; consent checkbox is 24px. | 1.4.4, 1.4.10; 2.5.8 target-size improvement |
| M1 | Silent film alternative omitted visible boarding and app-overlay information. | Expanded the visible description and associated it with the full-film player; explicitly identified the film as silent and illustrative. | 1.2.1 |
| F1 | Native validation did not provide persistent, linked error feedback and explicit message-length guidance. | Focused error summary, field links, inline errors, aria-invalid/describedby and instructions. Whitespace and short required messages are checked. | 3.3.1, 3.3.2, 3.3.3 |
| F2 | Changing inquiry type discarded previously entered details. | Shared and pathway-specific details are retained in memory; consent is not silently transferred to a different inquiry. | 3.3.7 / usability |
| F3 | Clipboard failure could leave a stale copied-success state. | Failure clears the success state and announces the manual-copy alternative. | 4.1.3 |

The hero autoplay enhancement is additional requested functionality and is not counted as a pre-existing defect. Its pause control addresses moving content lasting more than five seconds. Native full-film controls remain available. The film has no audio track, so captions for speech/audio are not applicable; its visual alternative is provided as text. [WCAG pause/stop/hide guidance](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

## Automated evidence

- Production build: passed.
- TypeScript: passed. Temporary duplicate generated `.next/types` files initially caused duplicate-identifier errors; generated copies were cleaned and the check rerun successfully. No source files were removed for this cleanup.
- Playwright: **50/50 tests passed**. After shortening the visible hero-control labels, the **9 affected accessibility/video tests passed again**.
- axe: **77/77 route/viewport scans with zero violations**, covering WCAG 2 A/AA, 2.1 A/AA, 2.2 AA and best-practice tags. Baseline axe also reported zero violations; the manual/readability findings were not inferred from an axe score.
- Widths: **320, 375, 390, 768, 1024, 1440 and 1920px**.
- Routes: `/`, `/parents`, `/schools`, `/safety`, `/about`, `/contact`, `/download`, `/privacy`, `/terms`, `/partner-preview`, and an unknown-route 404.
- Reflow: no document horizontal overflow at any tested width.
- Text spacing: line-height 1.5, letter-spacing .12em, word-spacing .16em and paragraph spacing 2em; no document overflow or detected clipped text in all 77 scans. Baseline homepage overflow at 320px was corrected.
- Typography scan: baseline had 41 distinct tag/class combinations with text below 14px across tested sizes; final scan found none. This is a project readability check, not a WCAG minimum-font-size rule.
- Lighthouse mobile accessibility: **100/100 on homepage and contact page**. The homepage report includes autoplay; the contact report includes the form fixes. The final shortened visible hero-button labels subsequently passed the affected axe/Playwright checks.
- All existing structured-data regression tests passed, including page-content matching and exclusion of inquiry data from JSON-LD.

Important states tested include navigation open/closed/Escape, FAQ expansion, journey arrow/Home/End navigation, carousel scrolling and edges, invalid forms, general-inquiry short-message errors, draft review/edit, retained inquiry details, modal open/close, full-film description, reduced motion, hero autoplay/pause/restart and modal-induced background pause. Nothing was sent to TroTro or submitted to external forms.

Artifacts: [before.json](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/before.json>), [after.json](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/after.json>), [Lighthouse homepage](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/lighthouse-home.json>), [Lighthouse contact](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/lighthouse-contact.json>), [target dimensions](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/targets.json>), [200% zoom observations](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/zoom200.json>).

## Manual review

- Inspected source and rendered pages, Chrome’s native accessibility tree, and representative mobile/desktop screenshots. Decorative images, landmark content, headings, form names and journey relationships were reviewed. This is not equivalent to operating a screen reader.
- Used Chrome’s native Zoom control at **200%**, verified by its UI. All 11 routes had a viewport and document width of 854 CSS pixels, with no horizontal overflow. Inspected enlarged homepage and contact-field/focus screenshots. After the hero enhancement, actual 200% zoom was checked again: muted automatic playback and the Pause control worked, with no horizontal overflow. Browser zoom was restored to 100% afterward.
- Keyboard checks cover the skip link, navigation Escape/focus restoration, journey controls, FAQ, carousel, inquiry errors/review/edit, film close/Escape and video Pause/Play. Native dialog prevents focus reaching the background page; focus can still reach browser chrome, as expected.
- Inspected the film as a sequence of frames and checked stream metadata: silent video, no audio track. The description includes the app preview overlay and the school arrival.
- Reviewed app artwork and adjacent live HTML descriptions. Embedded app-screen text is illustrative product imagery, not the only source of the described functionality. School logos retain legible adjacent school names; logo artwork was not recolored.
- Sample contrast calculations: pine/paper **10.65:1**; stone/sage **4.71:1**; white/pine **11.44:1**; field boundary/paper **3.87:1**; gold-brown focus ring/sage approximately **3.00:1**. Photo/video caption text has a dark overlay; its safety does not depend on one fixed film frame.
- Target-dimension review at 320, 768 and 1440px found the remaining sub-24px text-link boxes in prose, legal contents lists and the contact email. Prose links use the inline exception; legal contents links have separated line boxes and spacing. Primary controls, carousel/journey arrows, modal close and video Pause/Play are at least 44px high. [WCAG target size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

320 CSS pixels is the reflow reference; automated overflow measurements supplement visual checks and do not alone prove content is usable. [WCAG reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

## Before and after

### Footer readability — 1440px

Before:

![Before: small footer text](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/screenshots/before-footer-1440.png>)

After:

![After: readable footer typography](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/screenshots/after-footer-1440.png>)

### Contact page — 390px

[Before contact page](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/screenshots/before-contact-390.png>) · [After contact page](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/screenshots/after-contact-390.png>)

![Persistent linked form errors at 320px](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/screenshots/after-form-errors-320.png>)

### Hero playback — 320px

![Automatic muted hero film with Pause and Full film controls](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/screenshots/after-hero-video-320.png>)

Additional comparisons: [homepage before](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/screenshots/before-home-390.png>) / [after](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/screenshots/after-home-390.png>); [download before](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/screenshots/before-download-390.png>) / [after](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/screenshots/after-download-390.png>). [Enlarged form at 200%](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/accessibility/screenshots/after-zoom200-form.png>).

## Exact implementation files

- [app/globals.css](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/globals.css>): typography tokens, contrast, focus space, responsive wrapping, target sizes, dialog sizing, app captions and hero video styling.
- [app/layout.tsx](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/layout.tsx>): focusable main skip destination.
- [app/page.tsx](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/page.tsx>): decorative icon semantics and hero film integration.
- [app/[slug]/page.tsx](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/[slug]/page.tsx>): decorative icon semantics and unknown-route title.
- [app/not-found.tsx](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/not-found.tsx>): 404 metadata.
- [components/header.tsx](</Users/jonathan/Documents/Code-Projects/Tro Tro/components/header.tsx>): decorative icons and menu reset on desktop resize.
- [components/ui.tsx](</Users/jonathan/Documents/Code-Projects/Tro Tro/components/ui.tsx>): decorative shared icons.
- [components/journey.tsx](</Users/jonathan/Documents/Code-Projects/Tro Tro/components/journey.tsx>): persistent panel relationship and live step announcement.
- [components/school-carousel.tsx](</Users/jonathan/Documents/Code-Projects/Tro Tro/components/school-carousel.tsx>): single accessible fallback school name.
- [components/inquiry.tsx](</Users/jonathan/Documents/Code-Projects/Tro Tro/components/inquiry.tsx>): persistent validation, instructions, field associations, data retention, focus restoration and clipboard status.
- [components/film.tsx](</Users/jonathan/Documents/Code-Projects/Tro Tro/components/film.tsx>): silent-film description, autoplay hero, Pause/Play, reduced-motion support and visibility-aware playback.
- [tests/site.spec.ts](</Users/jonathan/Documents/Code-Projects/Tro Tro/tests/site.spec.ts>): scopes existing opt-in full-film assertions to the dialog after the hero video was added.
- [tests/accessibility.spec.ts](</Users/jonathan/Documents/Code-Projects/Tro Tro/tests/accessibility.spec.ts>): six targeted accessibility regressions.
- [tests/hero-video.spec.ts](</Users/jonathan/Documents/Code-Projects/Tro Tro/tests/hero-video.spec.ts>): three autoplay/pause/reduced-motion regressions.
- [scripts/audit-accessibility.cjs](</Users/jonathan/Documents/Code-Projects/Tro Tro/scripts/audit-accessibility.cjs>): repeatable multi-route, seven-width axe/typography/spacing audit and screenshot capture.
- `docs/accessibility/`: report, JSON evidence and screenshots.

## Remaining work and limits

| ID | Severity | Remaining validation | Completion condition |
|---|---|---|---|
| V1 | Medium | VoiceOver and NVDA end-to-end use was not performed. Native AX-tree inspection cannot verify spoken ordering, live-region timing, rotor behavior or platform-specific media controls. | Run the navigation, journey, carousel, error correction, review/edit and film journeys with VoiceOver/Safari and NVDA/Firefox or Chrome. |
| V2 | Medium | No physical iPhone/Android, mobile virtual-keyboard or touch assistive-technology session was performed. Responsive Chromium emulation and desktop Chrome zoom were tested. | Verify small-screen menu, input keyboard, film autoplay policies, pause, modal scrolling, rotation and 200% accessibility text settings on representative devices. |

Other boundaries: external app-store destinations, email clients and TroTro’s existing online forms were checked as links, not audited as part of this codebase. Browser/OS settings can block autoplay; the hero retains its still image and Play control in that case. There are no authentication, payment, drag-only, time-limited or multi-pointer flows in this site to exercise. High-contrast/forced-colors modes and every browser/AT combination are not covered. Full WCAG 2.2 AA conformance is therefore not claimed.
