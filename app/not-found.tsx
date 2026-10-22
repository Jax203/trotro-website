import type { Metadata } from "next";
import { Button } from "@/components/ui";
export const metadata: Metadata = {
  title: "Page not found — TroTro",
  description:
    "We couldn’t find that page. Return to TroTro to find your next step.",
};

export default function NotFound() {
  return (
    <section className="container not-found">
      <p className="section-kicker">A little off route</p>
      <h1>
        Let’s get you
        <br />
        back on your way.
      </h1>
      <p>We couldn’t find that page. Your next step is still close by.</p>
      <Button href="/">Back to TroTro</Button>
    </section>
  );
}
