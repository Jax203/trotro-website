export type SchoolPartner = {
  name: string;
  logo: string | null;
  darkBackground?: boolean;
};

// School selection supplied by the user in the October 21, 2026 screenshot.
// Official artwork sources and the one text-only entry: docs/school-logo-sources.md.
export const schoolPartners: SchoolPartner[] = [
  {
    name: "Brooklyn Prospect — Windsor Terrace Middle School",
    logo: "/images/schools/windsor-terrace.png",
  },
  {
    name: "Brooklyn Prospect — Sunset Yards Middle School",
    logo: "/images/schools/sunset-yards.png",
  },
  {
    name: "P.S./I.S. 192 — The Magnet School for Math and Science Inquiry",
    logo: "/images/schools/ps192.png",
  },
  { name: "East New York Middle School of Excellence", logo: null },
  {
    name: "Park Place Community Middle School",
    logo: "/images/schools/park-place.webp",
  },
  {
    name: "Berkeley Carroll School",
    logo: "/images/schools/berkeley-carroll.svg",
    darkBackground: true,
  },
  { name: "P.S. 181 Brooklyn", logo: "/images/schools/ps181.avif" },
  {
    name: "Liberty Avenue Middle School",
    logo: "/images/schools/liberty-avenue.webp",
  },
  {
    name: "Brooklyn School of Inquiry",
    logo: "/images/schools/brooklyn-inquiry.png",
  },
  {
    name: "Ebbets Field Middle School",
    logo: "/images/schools/ebbets-field.svg",
  },
];
