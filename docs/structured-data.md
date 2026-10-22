# TroTro structured data

Implemented and validated October 21, 2026 using the schema skill.

## Coverage

Every indexable public page emits one server-rendered, safely escaped JSON-LD graph. Shared Organization and WebSite entities use consistent canonical IDs; each page has its own ID, canonical URL, language and publisher relationship.

| Routes | Page type | Content source |
| --- | --- | --- |
| `/` | WebPage | Existing hero heading and introduction |
| `/parents` | WebPage | Existing parent heading and introduction |
| `/schools` | WebPage | Existing school heading and introduction |
| `/safety` | WebPage | Existing safety heading and introduction |
| `/about` | AboutPage | Existing about heading and introduction |
| `/contact` and its intent variants | ContactPage | Existing contact heading and introduction; canonical `/contact` |
| `/download` | WebPage | Existing app heading and introduction |
| `/privacy`, `/terms` | WebPage | Exact existing legal headings; no inferred publication dates |

Organization properties are limited to the already-verified public name **TroTro**, URL **https://www.jointrotro.com**, and email **trotrotransit@gmail.com** shown in the footer. No outside source was used to add new business facts.

`/partner-preview` and 404 responses emit no structured data. Inquiry input and query parameters never enter the graph. Every graph can resolve its publisher, website and organization references locally.

## Conservative omissions

- No LocalBusiness address, phone, hours or geographic service area: these are not established by the visible pages.
- No Product/Offer price or availability: $85/week is only a starting price, with plans and availability confirmed individually.
- No reviews, ratings, school relationships, government certifications, founder identities or legal entity names.
- No organization image derived from the synthetic lifestyle imagery. Organization image and logo properties are omitted from the current graph; the site's visible logo uses the user-selected official App Store artwork.
- No BreadcrumbList or SearchAction: the existing pages have neither a breadcrumb trail nor site search.
- No SoftwareApplication rich-result claim: the pages do not establish app pricing or reviews required for that enhancement. Existing store links are unchanged.
- No VideoObject: the illustrative film does not have an established public upload date on the page.
- No FAQ/HowTo rich-result markup. Google's FAQ feature was retired in May 2026. Parent answers remain accessible in normal HTML.

## Validation results

- TypeScript `schema-dts` vocabulary checks: passed.
- Production build: passed.
- Browser suite: **38 passed**, including 12 schema-specific cases.
- All nine actual server responses contain exactly one parseable graph. Tests compare page names and descriptions with visible content, URLs with canonical links, and shared IDs with their definitions.
- Tests cover query variants, exclusion of private form values, preview/404 exclusions, allowed claims, and script-breakout escaping.
- **Schema.org Validator:** homepage graph (WebPage with linked WebSite and Organization) returned **0 errors, 0 warnings**. A combined validation of the exact AboutPage and ContactPage nodes with shared definitions returned **2 items, 0 errors, 0 warnings**. These three page shapes cover the implementation; all nine individual payloads are also verified locally.
- **Google Rich Results Test, code mode:** homepage payload returned **1 valid Organization item**. [Saved result](https://search.google.com/test/rich-results/result?id=kF5UmuUf2mUawTnVg-82Eg).

External validation used code snippets, not a crawl of localhost or the unchanged production domain. No deployment or Search Console submission was performed. After deployment, test the public URLs and monitor Search Console. Passing validation does not guarantee a particular search appearance.

## Maintenance

- Builder and source mapping: `lib/structured-data.ts`.
- Server-rendered script and safe serialization: `components/structured-data.tsx`.
- Regression checks: `tests/structured-data.spec.ts`.
- Full JSON-LD snapshots for review or code-mode validation: `docs/schema-examples/*.json`. These are generated review artifacts, not runtime inputs; regenerate them when changing the builder.
- Editorial changes must update the mapping when relevant; the rendered-content tests catch mismatches.
- Default test preview remains port 3000. To validate another port: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npm run test:e2e`. This run used 3001 because an unrelated local service occupies 3000.

## Primary references checked

- [Google Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google site-name guidance](https://developers.google.com/search/docs/appearance/site-names)
- [Google FAQ feature retirement](https://developers.google.com/search/updates#may-2026)
- [Schema.org WebPage](https://schema.org/WebPage), [AboutPage](https://schema.org/AboutPage), [ContactPage](https://schema.org/ContactPage)
- Installed Next.js JSON-LD guide: `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`.
