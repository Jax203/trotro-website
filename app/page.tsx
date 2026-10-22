import type { Metadata } from "next";
import {
  Heart,
  Route,
  ShieldCheck,
  ArrowUpRight,
  Check,
  Bell,
  Navigation,
  UserRound,
  History,
} from "lucide-react";
import {
  Button,
  TextLink,
  Photo,
  TrustStrip,
  CheckList,
  Closing,
  PlaceNote,
} from "@/components/ui";
import { HeroFilm } from "@/components/film";
import { Journey } from "@/components/journey";
import { StructuredData } from "@/components/structured-data";
import { SchoolCarousel } from "@/components/school-carousel";
import { schoolPartners } from "@/lib/school-partners";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <PlaceNote />
          <h1>
            A better ride
            <br />
            to school.
            <br />A calmer morning.
          </h1>
          <p>
            From the people behind the wheel to the moment your child arrives,
            we bring care, coordination, and clarity to the school ride.
          </p>
          <div className="hero-actions">
            <Button href="/contact">Check ride availability</Button>
            <a className="how-link" href="#school-morning">
              How TroTro works <span>↗</span>
            </a>
          </div>
          <p className="hero-disclosure">
            For families. Built around your school and neighborhood.
          </p>
          <div className="school-path">
            Here for your school?{" "}
            <TextLink href="/schools">Let’s talk</TextLink>
          </div>
        </div>
        <HeroFilm />
      </section>
      <TrustStrip />
      {schoolPartners.length > 0 && (
        <div className="container">
          <SchoolCarousel schools={schoolPartners} />
        </div>
      )}
      <section className="parent-story container section-space">
        <div className="story-photo">
          <Photo
            name="morning"
            alt="Illustrative father helping his son with a backpack in a sunlit kitchen."
          />
          <span className="photo-caption">
            For the mornings with a lot to carry.
          </span>
        </div>
        <div className="story-copy">
          <span className="small-sun" aria-hidden="true">
            ☀
          </span>
          <h2>
            You’ve got enough
            <br />
            on your mind
            <br />
            every morning.
          </h2>
          <p>
            The lunchbox. The missing shoe. The meeting that starts right after
            drop-off. Getting to school is one more thing your family has to
            figure out.
          </p>
          <p>
            We help bring the ride together: a planned route, a driver you can
            know, and updates that keep you connected. So the journey feels a
            little less like a question mark.
          </p>
          <TextLink href="/parents">Made for your family’s morning</TextLink>
        </div>
      </section>
      <section className="responsibility container section-space">
        <div className="section-heading">
          <h2>
            Real transportation.
            <br />
            Real responsibility.
          </h2>
          <p>
            Behind the updates is a real, coordinated ride.
            <br />
            And people who understand what it means.
          </p>
        </div>
        <div className="principles">
          <article>
            <span className="principle-icon">
              <UserRound aria-hidden="true" size={28} strokeWidth={1.4} />
            </span>
            <h3>People you can know.</h3>
            <p>
              See who’s driving, the vehicle they’re using, and their
              verification status before the journey begins.
            </p>
            <TextLink href="/safety">
              Meet our approach to verification
            </TextLink>
          </article>
          <article>
            <span className="principle-icon">
              <Route aria-hidden="true" size={28} strokeWidth={1.4} />
            </span>
            <h3>Rides planned with purpose.</h3>
            <p>
              Routes, schedules and stops are coordinated in advance. The people
              around the ride know their part.
            </p>
            <TextLink href="/#school-morning">
              See the journey come together
            </TextLink>
          </article>
          <article>
            <span className="principle-icon">
              <Check aria-hidden="true" size={28} strokeWidth={1.4} />
            </span>
            <h3>The moments accounted for.</h3>
            <p>
              Pickups and drop-offs are confirmed and recorded. Important
              updates reach you along the way.
            </p>
            <TextLink href="/parents">Know what to expect</TextLink>
          </article>
        </div>
      </section>
      <Journey />
      <section className="safety-section">
        <div className="container safety-layout">
          <div className="safety-copy">
            <span className="verified-label">
              <ShieldCheck aria-hidden="true" size={19} /> TroTro Verified
            </span>
            <h2>
              Confidence starts
              <br />
              before the first pickup.
            </h2>
            <p>
              Trust takes more than a friendly introduction. Every driver
              completes a structured verification process, with documented
              checkpoints and a status that stays visible to parents.
            </p>
            <p>
              A route can only start when the driver’s required verification is
              current.
            </p>
            <Button href="/safety" light>
              Explore our safety process
            </Button>
          </div>
          <div className="safety-checks">
            <CheckList />
            <p className="safety-limit">
              TroTro Verified is a documented process. It is not a government
              certification, insurance, or a guarantee of safety or any outcome.
            </p>
          </div>
        </div>
      </section>
      <section className="app-section container section-space">
        <div className="app-art">
          <div className="app-photo-strip">
            <Photo
              name="morning"
              alt="Illustrative family preparing for the school day."
            />
          </div>
          <div className="product-screen">
            <img
              src="/app-screens/track-live.png"
              alt="Actual TroTro parent app preview showing the live ride map, arrival estimate and driver details."
              width="900"
              height="1950"
              loading="lazy"
            />
            <span>Actual TroTro app preview</span>
          </div>
          <div className="app-margin-note">
            A little connection.
            <br />
            Wherever your morning takes you.
          </div>
        </div>
        <div className="app-copy">
          <p className="section-kicker">The app, along for the ride</p>
          <h2>
            A little more clarity.
            <br />A lot less wondering.
          </h2>
          <p>
            Your day doesn’t stop when their ride starts. The TroTro parent app
            helps you stay informed while you get on with it.
          </p>
          <ul className="app-benefits">
            <li>
              <UserRound aria-hidden="true" />
              <div>
                <h3>See who’s behind the wheel.</h3>
                <p>Your assigned driver, vehicle and verification status.</p>
              </div>
            </li>
            <li>
              <Navigation aria-hidden="true" />
              <div>
                <h3>Know where their ride is.</h3>
                <p>A live view and estimated arrival during an active ride.</p>
              </div>
            </li>
            <li>
              <Bell aria-hidden="true" />
              <div>
                <h3>Be there for the little updates.</h3>
                <p>Notifications when pickup and drop-off are confirmed.</p>
              </div>
            </li>
            <li>
              <History aria-hidden="true" />
              <div>
                <h3>Look back when you need to.</h3>
                <p>Ride information and recorded stops, in one place.</p>
              </div>
            </li>
          </ul>
          <TextLink href="/download">Explore the parent app</TextLink>
          <p className="fine-print">
            App access is open to everyone. Transportation is subject to
            availability.
          </p>
        </div>
      </section>
      <section className="school-section">
        <div className="container school-layout">
          <div className="school-copy">
            <p className="section-kicker">For school communities</p>
            <h2>
              The school day
              <br />
              starts long before
              <br />
              the bell.
            </h2>
            <p>
              A great school should feel within reach. We work with schools and
              families to explore practical routes, clarify responsibilities,
              and keep communication connected.
            </p>
            <TextLink href="/schools">Explore school partnerships</TextLink>
          </div>
          <div className="school-photo">
            <Photo
              name="school"
              alt="Illustrative children and an adult walking toward a neighborhood school."
            />
            <span className="photo-caption">
              Helping the journey feel like part of the welcome.
            </span>
          </div>
        </div>
      </section>
      <section className="mission container section-space">
        <span className="mission-icon">
          <Heart aria-hidden="true" size={28} strokeWidth={1.3} />
        </span>
        <p className="section-kicker">The care behind the ride</p>
        <h2>
          Because it’s never
          <br />
          just a ride to school.
        </h2>
        <p>
          It’s a child’s day beginning. A parent’s trust. A community coming
          together. TroTro exists to make that everyday journey more
          coordinated, accountable, and clear.
        </p>
        <TextLink href="/about">Get to know TroTro</TextLink>
      </section>
      <Closing />
      <StructuredData path="/" />
    </>
  );
}
