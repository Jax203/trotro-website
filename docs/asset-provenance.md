# Asset provenance

## Custom illustrative photography

Generated through the connected Higgsfield plugin with `gpt_image_2_5` on October 21, 2026. No reference images of real children were uploaded. Prompts requested fictional families, realistic safe transportation, natural Brooklyn morning light, plain passenger minivans, no logos, and no synthetic product UI.

| Local asset | Scene | Generation job |
| --- | --- | --- |
| `public/images/hero.webp` | Family goodbye beside parked vehicle, driver at door | `c32384d0-1833-4a7f-86e8-ba3bc65f7a1d` |
| `public/images/morning.webp` | Father helping child prepare a backpack | `f317dd56-fdfd-4a6a-806a-9eb5e4602e22` |
| `public/images/school.webp` | Children and caregiver approaching a fictional school | `45d2b553-faca-4d02-9564-d4ba92d64cef` |
| `public/images/driver.webp` | Driver inspecting passenger area of parked vehicle | `183a1773-c43c-4c05-8bd7-ee7520da433a` |

Each has a 700px `-small.webp` variant. Main widths are capped at 1800px (hero) and 1200px (supporting), without enlargement. Generated originals were visually inspected. Figures are not presented as actual employees or customers. Final scene disclosures appear in the hero, photo context, journey note and footer.

## Film

- Higgsfield model: `kling3_0`, pro mode, silent, 16:9, 15 seconds.
- Generation job: `3894ea7a-1dfe-4d34-902a-e28ad5adefe1`.
- Story: preparation, approach and greeting, boarding/goodbye, parent phone check, school arrival and return to the parent's day.
- Postproduction: authentic `/app-screens/parent/alerts.png` from the TroTro website is displayed at seconds 8–10, labeled “Actual TroTro app preview.” The generated phone is shown from the back; no generated interface is used as product evidence.
- Exports: `public/films/morning.mp4` (1280×720, H.264, approximately 2.2 MB) and `morning-mobile.mp4` (768×432, approximately 878 KB), yuv420p, fast-start metadata, no audio track.
- Native player requires a user click, offers controls, and has a prose visual description. The film is not loaded on initial page render.
- The scene is illustrative. School, vehicle and people are not real TroTro operations or approved partners.

## Authentic product screenshots

Retrieved from https://www.jointrotro.com/ on October 21, 2026:

- `/app-screens/parent/track-live.png`
- `/app-screens/parent/alerts.png`
- `/app-screens/parent/ride-recap.png`
- `/app-screens/shared/trotro-verified.png`
- `/app-screens/components/driver-verified-clean.png`

These are the existing website's product previews, not evidence that any example driver, route or student is an active real customer. Their content is unchanged; only display sizing and film compositing are applied.

## Typography

Lora and Manrope obtained through Google Fonts, converted to WOFF2 for local serving. License notices are included under `public/fonts/licenses/`. No visitor font requests go to Google.

## Identity and school logos

The TroTro logo is the original 512×512 artwork from the [TroTro Mobile App Store listing](https://apps.apple.com/us/app/trotro-mobile/id6780704075), retrieved on October 21, 2026 after the user requested this identity. Apple’s lookup API for app ID `6780704075` supplied the artwork URL. `public/images/trotro-logo.png`, `app/icon.png`, and `app/apple-icon.png` use that artwork unchanged; rounded corners and display sizes are applied in CSS. The adjacent website wordmark uses “TroTro.”

The school carousel uses the ten-school selection supplied by the user on October 21, 2026. Nine original school logos were retrieved from official school websites; East New York Middle School of Excellence is displayed as text. See [school-logo-sources.md](school-logo-sources.md) for provenance. No testimonials were added.
