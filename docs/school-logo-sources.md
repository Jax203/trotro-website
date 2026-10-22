# School carousel sources

The user supplied the ten-school selection in `Screenshot 2026-10-21 at 8.19.23 PM.png` in response to the request for schools to feature under “Trusted by.” The selection and requested endorsement wording come from the user. Public sources below verify school identities and artwork, not a relationship with TroTro. No school relationships have been added to structured data.

Assets retrieved October 21, 2026 from the schools' own websites. Original artwork is preserved; Next.js serves size-optimized raster variants. Text captions identify each school, including the two Prospect campuses. Berkeley Carroll’s official white artwork is displayed on a dark backing for contrast.

| School | Official source | Local asset |
| --- | --- | --- |
| Brooklyn Prospect — Windsor Terrace Middle School | https://www.brooklynprospect.org/schools/windsor-terrace-middle/ | `windsor-terrace.png` |
| Brooklyn Prospect — Sunset Yards Middle School | https://www.brooklynprospect.org/schools/sunset-yards-middle/ | `sunset-yards.png` |
| P.S./I.S. 192 — The Magnet School for Math and Science Inquiry | https://www.ps-is192.org/home_page | `ps192.png` |
| East New York Middle School of Excellence | https://www.schools.nyc.gov/find-a-school/school/index/k678 | Text name only; no verified standalone logo found |
| Park Place Community Middle School | https://www.parkplace266.com/ | `park-place.webp` |
| Berkeley Carroll School | https://www.berkeleycarroll.org/ | `berkeley-carroll.svg` |
| P.S. 181 Brooklyn | https://www.ps181brooklyn.org/ | `ps181.avif` |
| Liberty Avenue Middle School | https://www.libertyavems.com/ | `liberty-avenue.webp` |
| Brooklyn School of Inquiry | https://bsi686.org/ | `brooklyn-inquiry.png` |
| Ebbets Field Middle School | https://www.efms352.org/ | `ebbets-field.svg` |

All image paths are beneath `public/images/schools/`. The carousel appears after the homepage trust strip. Its dedicated `/partner-preview` route remains noindex and excluded from the sitemap. Controls support pointer, keyboard and touch scrolling; reduced-motion preferences disable animated scrolling. There is no autoplay.
