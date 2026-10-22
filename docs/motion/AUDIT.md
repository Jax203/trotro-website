# TroTro motion audit

> Implementation update: journey, mobile-menu and form-review transitions are now implemented. The original findings below remain a historical audit. See [implementation notes](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/motion/IMPLEMENTATION.md>) for the shipped scope and verification.

October 21, 2026 · Local redesigned site · Recommendations, not newly implemented animations.

The best opportunity is to connect user-triggered state changes: the school-morning sequence, mobile navigation, and inquiry review. Use restrained, fast motion that fits TroTro’s calm visual direction. The autoplay hero already supplies the main continuous movement.

The preceding requested cleanup is complete: the hero’s Pause/Full film buttons, illustration badge, caption and dark caption scrim are removed. The video itself is a keyboard-operable click/tap target for pausing and resuming. Its accessible name, text alternative, reduced-motion behavior and visibility-aware playback remain. No additional animation effects were implemented during this audit.

## Findings and proposed treatments

“After” describes a recommendation. P1 = first implementation pass, P2 = optional polish. Missing animation is an opportunity, not automatically a usability or accessibility defect.

| Before | After | Why |
|---|---|---|
| **P1 · Shared buttons:** hover lifts by 2px with implicit `ease`, 200ms; no consistent press feedback. [globals.css:182](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/globals.css:182>) | Gate lift to fine-pointer hover. Add pointer-only `scale(.97)` press feedback within the 100–160ms budget, with a quicker release. Keep keyboard activation immediate. | Gives confirmation of a press and avoids touch devices retaining a hover appearance. |
| **P1 · Text links:** arrow moves 3px on hover with the same ungated 200ms transition. [globals.css:233](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/globals.css:233>) | Keep the existing small movement, shorten to 160ms, use the shared ease-out curve, and gate it to fine pointers. | Refines an existing cue instead of adding more moving elements. |
| **P1 · School-morning journey:** image and copy switch immediately; only the numbered dot’s background transitions. [journey.tsx:88](</Users/jonathan/Documents/Code-Projects/Tro Tro/components/journey.tsx:88>) | On pointer activation, transition the incoming image/copy with opacity and a very small directional translation over 200ms. Reserve the panel’s space; keep the tablist and focus destination stable. Update keyboard selections instantly. | The strongest larger-scale opportunity: makes the four stages feel connected without turning them into an autoplay slideshow. |
| **P1 · Mobile navigation:** `hidden` switches the entire menu on/off immediately. [header.tsx:67](</Users/jonathan/Documents/Code-Projects/Tro Tro/components/header.tsx:67>) | On pointer opening, reveal menu content from a slight upward offset with opacity over 200ms, originating at the menu edge. Use a faster exit. Preserve its existing in-flow layout; do not animate height. | Clarifies where the menu came from while keeping navigation responsive. Hidden links must immediately stop receiving focus. |
| **P1 · Inquiry review:** the form hides and the review replaces it in one step. [inquiry.tsx:131](</Users/jonathan/Documents/Code-Projects/Tro Tro/components/inquiry.tsx:131>) | On pointer submission, use a 200ms opacity/small-translation transition for the review. Keep focus transfer immediate and retain field values. Editing should respond faster. | Acknowledges the move from entering details to reviewing an unsent draft. Do not use confetti, a “sent” check animation, or delayed validation. |
| **P1 · School carousel:** Arrow-key navigation calls the same smooth-scrolling function as pointer buttons. [school-carousel.tsx:43](</Users/jonathan/Documents/Code-Projects/Tro Tro/components/school-carousel.tsx:43>) | Make keyboard steps immediate; retain user-triggered smooth scrolling for pointer controls and native touch scrolling. Keep reduced-motion scrolling instant. | Under the motion-review standard, repeated keyboard navigation should not wait on animation. This is a craft recommendation, not a claim that smooth scrolling itself violates WCAG. |
| **P2 · FAQ:** the plus icon jumps directly to its 45° open state. [globals.css:1149](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/globals.css:1149>) | Rotate the icon over 160ms on pointer activation. Optionally introduce answer content with opacity and a small translation; leave document expansion immediate. | A small, useful state cue. Keep native `details`/`summary` behavior and avoid animated height/max-height. |
| **P2 · App preview:** photo and phone artwork enter view together as a static composition. [page.tsx:187](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/page.tsx:187>) | Consider a one-time, 200ms entrance for the artwork only, with the phone following by 50ms. Use opacity and a small translation. Keep all explanatory text and links immediately available. | The best optional editorial reveal: establishes the relationship between the family scene and the app without continuous floating or parallax. |
| **P2 · Hero readiness:** the loaded video’s opacity switches from 0 to 1 immediately. [globals.css:474](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/globals.css:474>) | A 160ms opacity transition after the first decoded frame can blend the still poster into playback. Keep the current clean surface with no callouts. | Smooths media readiness without delaying the page or changing the approved layout. This is a crossfade between existing layers, not a decorative entrance. |
| **P2 · Navigation underline:** expands from the default center with an implicit 200ms ease. [globals.css:329](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/globals.css:329>) | Left-origin 160ms transform transition for fine-pointer hover; current-page and keyboard-focus indications remain immediate. | Gives the underline a deliberate reading direction. The existing `scaleX(0)` underline is appropriate; it is not a whole component appearing from zero scale. |
| **P1 · Animated background colors:** buttons and journey dots transition background paint. [globals.css:196](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/globals.css:196>), [globals.css:628](</Users/jonathan/Documents/Code-Projects/Tro Tro/app/globals.css:628>) | Prefer instant color changes plus transform feedback; where a color blend earns its complexity, crossfade a noninteractive pseudo-element using opacity. | Avoids adding paint-driven transitions under the strict review standard. These are small regions; no dropped frames were measured, so this is a preventive optimization, not an observed performance failure. |

## Verdict

### Missed simplifications

Keep school logos, safety verification statements, legal pages and long-form copy steady. Do not introduce a marquee, bouncing badges, pulsing CTAs, scroll hijacking, cursor-following effects, or hover zoom on non-clickable photos. Do not animate all sections as the visitor scrolls. The hero already moves continuously.

For any one-time reveal, content must remain available when JavaScript fails or reduced motion is requested. An off-screen component should not spend time animating indefinitely.

### Performance

Use CSS transitions for simple transforms and opacity. Use Web Animations only when coordinating the journey or form replacement requires cancellation. No animation library is necessary for this scope. Transform/opacity generally avoid the layout and paint work associated with geometric properties; this is a preference to validate with profiling, not a guarantee that every layer is free. [Browser performance guidance](https://web.dev/articles/animations-and-performance?hl=en).

### Interruptibility and timing

Use these starting points from the [motion skill’s standards](</Users/jonathan/.codex/skills/review-animations/STANDARDS.md>):

- Press: 100–160ms; link/icon feedback: 160ms.
- Menu, journey and review: 200ms, below the 300ms UI ceiling.
- Optional app artwork: 200ms per layer with a 50ms stagger.
- Enter/response curve: `cubic-bezier(0.23, 1, 0.32, 1)`.
- On-screen movement when appropriate: `cubic-bezier(0.77, 0, 0.175, 1)`.
- Exit should be faster than entry. Rapid clicks must retarget/cancel existing motion, not queue transitions.

When using Web Animations, handle cancellation and its rejected finished promise; cancellation resets the animation’s timing state. [MDN cancellation documentation](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel).

### Accessibility

The existing reduced-motion handling works in the tested states: hero stays paused, CSS transitions are disabled and smooth scrolling becomes instant. Preserve that baseline. Any new effect must drop translations/scaling under reduced motion and must not delay focus, error announcements or keyboard operation. An optional short dissolve can be used only where it improves comprehension. [Reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

The hero’s invisible whole-surface control is operable but less discoverable than a visible Pause button. That is a deliberate consequence of the requested clean visual treatment; do not reintroduce the removed callouts as part of an animation pass.

**Decision: Block a broad animation rollout in its current form.** First address pointer gating, keyboard-triggered carousel motion and the shared transition rules. Then implement the P1 journey/menu/review improvements as a small, cohesive pass. Optional app-preview and media-readiness polish can follow. This is an animation-review decision, not a deployment restriction or a request for approval.

## Evidence and limits

Inspected the shared stylesheet and components, plus their placement on public routes. Exercised homepage journey/hero, mobile navigation, parent FAQs and general-inquiry review in Chromium at desktop and mobile sizes. The rendered journey panel, mobile menu and review each had zero active subtree animations immediately after their state changes. The FAQ icon changed rotation without a timed transition. The review correctly focused its heading.

[Rendered observations](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/motion/observations.json>) include computed CSS and reduced-motion checks. A computed `transition: all` with the browser’s default zero duration is not an authored `transition: all` violation; those elements currently have no timed transition.

The clean-hero change passed the production build and 34 affected Playwright tests, including autoplay, click/keyboard pause, persistent manual pause, reduced motion, responsive routes and form accessibility. The removed modal tests were retired because the Full film entry point and modal were removed.

This audit did not measure frame budgets on physical mobile hardware or test proposed animations in slow motion; the proposals have not been implemented. Those checks belong to the implementation pass.

![Clean desktop hero](</Users/jonathan/Documents/Code-Projects/Tro Tro/docs/motion/clean-hero-desktop.png>)
