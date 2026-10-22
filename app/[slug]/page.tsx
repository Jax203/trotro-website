import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  Heart,
  Route,
  Bell,
  Check,
  Download,
  Mail,
  MapPin,
} from "lucide-react";
import {
  PageHero,
  Button,
  TextLink,
  Photo,
  Closing,
  Faq,
  CheckList,
  IllustrationNote,
} from "@/components/ui";
import { Inquiry } from "@/components/inquiry";
import { Journey } from "@/components/journey";
import legal from "@/lib/legal.json";
import { StructuredData } from "@/components/structured-data";
import { SchoolCarousel } from "@/components/school-carousel";
import { schoolPartners } from "@/lib/school-partners";
const pages: Record<string, { title: string; description: string }> = {
  parents: {
    title: "For parents — care for your school morning",
    description:
      "Get clear answers about your driver, ride updates, school transportation availability and plans from $85/week.",
  },
  schools: {
    title: "For schools — make your community easier to reach",
    description:
      "Explore a school transportation partnership built around your campus, families, planned routes and clear communication.",
  },
  safety: {
    title: "Our approach to safety & TroTro Verified",
    description:
      "Understand TroTro’s documented driver verification, vehicle and training checkpoints, and recorded pickup and drop-off process.",
  },
  about: {
    title: "Our story — the care behind the ride",
    description:
      "TroTro brings coordinated transportation and thoughtful technology together around a child’s journey to school.",
  },
  contact: {
    title: "Check ride availability & get in touch",
    description:
      "Ask about school transportation for your family, explore a school partnership, or contact TroTro.",
  },
  download: {
    title: "The parent app — connection along the way",
    description:
      "Download TroTro for iOS or Android to follow active rides, see your driver and receive pickup and drop-off updates.",
  },
  privacy: {
    title: "Privacy policy",
    description: "How TroTro collects, uses and protects your information.",
  },
  terms: {
    title: "Terms of service",
    description:
      "TroTro transportation terms, service responsibilities, billing and availability.",
  },
  "partner-preview": {
    title: "Partner logo treatment — internal preview",
    description:
      "Unpublished layout awaiting documented school relationships and logo permissions.",
  },
};
export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = pages[slug];
  if (!p)
    return {
      title: "Page not found",
      description:
        "We couldn’t find that page. Return to TroTro to find your next step.",
    };
  return {
    ...p,
    alternates: { canonical: `/${slug}` },
    ...(slug === "partner-preview"
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ intent?: string }>;
};

export default async function Page(props: PageProps) {
  const content = await PageContent(props);
  const { slug } = await props.params;
  return (
    <>
      {content}
      <StructuredData path={`/${slug}`} />
    </>
  );
}

async function PageContent({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ intent?: string }>;
}) {
  const { slug } = await params;
  if (!pages[slug]) notFound();
  if (slug === "parents") return <Parents />;
  if (slug === "schools") return <Schools />;
  if (slug === "safety") return <Safety />;
  if (slug === "about") return <About />;
  if (slug === "download") return <DownloadPage />;
  if (slug === "contact") {
    const { intent } = await searchParams;
    return (
      <Contact
        intent={
          intent === "school"
            ? "school"
            : intent === "general"
              ? "general"
              : "parent"
        }
      />
    );
  }
  if (slug === "partner-preview") return <PartnerPreview />;
  return (
    <article
      className="legal container"
      dangerouslySetInnerHTML={{ __html: legal[slug as "privacy" | "terms"] }}
    />
  );
}
function Parents() {
  return (
    <>
      <PageHero
        label="For your family"
        title="A school ride you can feel more connected to."
        body="Know the people behind the ride, understand the plan, and get the updates that matter. We help put the school journey in clearer view."
        image="morning"
        alt="Illustrative father and child preparing a backpack for school."
      >
        <Button href="/contact">Check ride availability</Button>
        <TextLink href="#parent-questions">Your questions, answered</TextLink>
      </PageHero>
      <div className="price-ribbon">
        <div className="container">
          <strong>Plans from $85/week.</strong>
          <span>
            Your exact plan is confirmed after a call. Availability depends on
            your school and area.
          </span>
        </div>
      </div>
      <section className="container section-space parent-intro">
        <h2>
          You take care of the goodbye.
          <br />
          We help coordinate what comes next.
        </h2>
        <div>
          <p>
            Before the first ride, routes, schedules and stops are planned. An
            approved driver is assigned, and you can see their details in the
            parent app.
          </p>
          <p>
            During the ride, pickup and drop-off are confirmed at the stop. You
            can follow an active journey and receive relevant updates.
            Afterward, a record of the ride remains available.
          </p>
          <TextLink href="/safety">
            Understand the verification process
          </TextLink>
        </div>
      </section>
      <Journey />
      <section
        id="parent-questions"
        className="container section-space faq-section"
      >
        <div>
          <p className="section-kicker">The things parents want to know</p>
          <h2>
            Good questions.
            <br />
            Clear answers.
          </h2>
          <p>
            A school ride is a big part of your family’s day. You deserve to
            know how it works.
          </p>
          <TextLink href="/contact?intent=general">
            Ask us something else
          </TextLink>
        </div>
        <Faq
          items={[
            {
              q: "Who is driving my child?",
              a: (
                <p>
                  Your assigned driver’s name, photo, vehicle information and
                  verification status appear in the parent app. Drivers join by
                  invitation and complete the required TroTro Verified
                  checkpoints before running a route.
                </p>
              ),
            },
            {
              q: "How does TroTro approach safety?",
              a: (
                <p>
                  Identity and license, driving record, background checks,
                  vehicle inspection and training completion are documented
                  checkpoints. Required verification must be current for a route
                  to start.{" "}
                  <Link href="/safety">Read the process and its limits.</Link>
                </p>
              ),
            },
            {
              q: "How will I know when my child is picked up?",
              a: (
                <p>
                  The driver confirms pickup at the stop. The event is recorded
                  and the parent app provides a notification. Keep your ride
                  notification settings enabled to receive updates.
                </p>
              ),
            },
            {
              q: "Can I follow the ride?",
              a: (
                <p>
                  Yes. During an active ride, the parent app shows a live map,
                  ride status and an estimated time of arrival. Estimates can
                  change with traffic and route conditions.
                </p>
              ),
            },
            {
              q: "What happens when my child arrives?",
              a: (
                <p>
                  Drop-off is confirmed and recorded, and you receive an update.
                  Completed ride information remains available for you to
                  review. Pickup and release arrangements are confirmed as part
                  of your service.
                </p>
              ),
            },
            {
              q: "Is transportation available for my school?",
              a: (
                <p>
                  Availability depends on your school and service area.{" "}
                  <Link href="/contact">
                    Ask about your neighborhood and school
                  </Link>{" "}
                  so the team can follow up. Downloading the app does not
                  reserve or guarantee a ride.
                </p>
              ),
            },
            {
              q: "How much does transportation cost?",
              a: (
                <p>
                  Plans start from $85 per week. TroTro confirms your exact plan
                  after a quick call. A starting price is not a quote for every
                  route or family.
                </p>
              ),
            },
            {
              q: "What if a plan changes or I have a concern?",
              a: (
                <p>
                  Contact TroTro about schedule changes or absences as early as
                  possible. You can report a ride issue in the app. Drivers and
                  vehicles may change according to availability; service
                  interruptions and cancellations are covered in the{" "}
                  <Link href="/terms">transportation terms</Link>.
                </p>
              ),
            },
          ]}
        />
      </section>
      <section className="simple-band container">
        <div>
          <h2>Already have a ride arranged?</h2>
          <p>Keep the people, route and important updates close at hand.</p>
        </div>
        <Button secondary href="/download">
          Get the parent app
        </Button>
      </section>
      <Closing />
    </>
  );
}
const schoolSteps = [
  [
    "Start with your community",
    "We learn about your campus, your families and the transportation gap you’re trying to close.",
  ],
  [
    "Look at the routes that could help",
    "Service areas and family demand are reviewed together, so planning starts with the actual need.",
  ],
  [
    "Coordinate drivers and the ride",
    "Routes are planned and drivers move through the TroTro Verified process before service.",
  ],
  [
    "Help parents get connected",
    "Families set up the app and get a structured picture of how their ride will work.",
  ],
  [
    "Begin, learn and review",
    "A pilot launch and operational review help the team refine the plan with your school.",
  ],
];
function Schools() {
  return (
    <>
      <PageHero
        label="For your school community"
        title="The right school should feel within reach."
        body="Transportation is part of how families experience your school. TroTro helps bring practical routes, responsible coordination and clearer communication into that journey."
        image="school"
        alt="Illustrative children and caregiver arriving at a neighborhood school."
      >
        <Button href="#partnership">How a partnership begins</Button>
        <TextLink href="/contact?intent=school">Talk with TroTro</TextLink>
      </PageHero>
      <section className="container section-space school-access">
        <div>
          <h2>
            A thoughtful journey
            <br />
            belongs in the school day.
          </h2>
          <p>
            A campus move. An awkward transit connection. A school schedule that
            doesn’t match the bus. These everyday challenges can shape which
            schools feel possible for a family.
          </p>
          <p>
            We start with the people affected and the routes that could help.
            Then we connect the planning, driver verification and parent updates
            around the ride.
          </p>
        </div>
        <div className="school-benefits">
          {[
            [
              "More practical access",
              "Explore coordinated routes for families beyond convenient transit connections.",
            ],
            [
              "Clear responsibilities",
              "Drivers, families and operations work around the same planned ride.",
            ],
            [
              "Parents kept informed",
              "Live ride information and recorded pickup and drop-off updates support clearer communication.",
            ],
            [
              "Verification built into the plan",
              "Required driver checkpoints are documented and their current status is tracked.",
            ],
          ].map(([title, body]) => (
            <article key={title}>
              <Check aria-hidden="true" size={19} />
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="partnership-section" id="partnership">
        <div className="container partnership-layout">
          <div>
            <p className="section-kicker">Built around your community</p>
            <h2>
              Every good partnership
              <br />
              starts with listening.
            </h2>
            <p>
              Every school is different. This is the provisional path we work
              through together; service details are confirmed for each school.
            </p>
            <Button href="/contact?intent=school">
              Start a school conversation
            </Button>
            <a
              className="plain-link"
              href="https://www.jointrotro.com/schools#request-demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Request a guided demo on the existing site ↗
            </a>
          </div>
          <ol className="school-steps">
            {schoolSteps.map(([title, body], i) => (
              <li key={title}>
                <span>{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="container school-evidence section-space">
        <Photo
          name="driver"
          alt="Illustrative driver checking a parked vehicle before a ride."
        />
        <div>
          <h2>
            Care that has
            <br />a process behind it.
          </h2>
          <p>
            Verification checkpoints, planned stops and a ride record give the
            journey a structure everyone can understand. The technology helps
            keep that responsibility visible.
          </p>
          <TextLink href="/safety">Explore TroTro Verified</TextLink>
          <p className="fine-print">
            TroTro coordinates transportation; drivers operate their own
            vehicles. Current service is a controlled pilot.
          </p>
        </div>
      </section>
      <Closing />
    </>
  );
}
function Safety() {
  return (
    <>
      <PageHero
        label="Our approach to safety"
        title="Trust starts with knowing what’s behind the ride."
        body="Before a driver runs a TroTro route, required verification checkpoints are completed and recorded. That process supports a ride with clear responsibilities and a record of important moments."
        image="driver"
        alt="Illustrative professional driver inspecting the passenger area of a vehicle."
      >
        <Button href="#verification">Understand the checkpoints</Button>
      </PageHero>
      <section className="safety-section" id="verification">
        <div className="container safety-layout">
          <div className="safety-copy">
            <span className="verified-label">
              <ShieldCheck aria-hidden="true" size={20} /> TroTro Verified
            </span>
            <h2>
              A current status.
              <br />
              An ongoing process.
            </h2>
            <p>
              Drivers join by invitation and complete required checkpoints
              before their first route. Verification expirations are tracked
              over time, and a route cannot start unless the driver’s required
              status is current.
            </p>
            <p>
              Parents can see that status alongside the driver’s name, photo and
              vehicle. Operations manages the underlying records.
            </p>
          </div>
          <CheckList />
        </div>
      </section>
      <section className="container section-space safety-record">
        <h2>
          Responsibility doesn’t
          <br />
          end at the curb.
        </h2>
        <div className="principles">
          <article>
            <h3>Agreed expectations.</h3>
            <p>
              Drivers and families acknowledge documented expectations before
              service begins. Agreement acceptance is recorded.
            </p>
          </article>
          <article>
            <h3>Confirmed stops.</h3>
            <p>
              Pickups and drop-offs are confirmed at the location with GPS
              evidence. Each ride leaves a stop-by-stop record.
            </p>
          </article>
          <article>
            <h3>A way to raise a concern.</h3>
            <p>
              Parents can report a ride issue in the app for operational review
              and look back at completed ride information.
            </p>
          </article>
        </div>
      </section>
      <section className="container safety-boundary">
        <div>
          <h2>
            Clear about what
            <br />
            verification means.
          </h2>
          <p>
            A documented process helps make responsibility visible. It should
            never be confused with a promise that risk can be eliminated.
          </p>
        </div>
        <div>
          <h3>TroTro Verified is</h3>
          <ul>
            <li>A structured, recorded checkpoint process</li>
            <li>A driver status parents can see in the app</li>
            <li>A requirement enforced before route starts</li>
            <li>Verification with tracked expirations</li>
          </ul>
          <h3>It is not</h3>
          <ul>
            <li>A government certification or regulatory endorsement</li>
            <li>A guarantee of safety or any particular outcome</li>
            <li>Insurance coverage</li>
            <li>An emergency-response service</li>
          </ul>
        </div>
      </section>
      <section className="container simple-band">
        <div>
          <h2>Questions deserve a conversation.</h2>
          <p>
            Ask us about verification, the ride, or who is responsible for what.
          </p>
        </div>
        <Button href="/contact?intent=general">Talk with TroTro</Button>
      </section>
      <Closing />
    </>
  );
}
function About() {
  return (
    <>
      <PageHero
        label="The care behind the ride"
        title="It’s a school journey. And someone’s whole world."
        body="Behind every backpack is a family. Behind every route is a responsibility. TroTro brings those people and everyday moments together with more care, coordination and clarity."
        image="hero"
        alt="Illustrative mother, child and driver sharing a school-morning goodbye."
      />
      <section className="container section-space about-mission">
        <span className="mission-icon">
          <Heart aria-hidden="true" size={30} />
        </span>
        <h2>
          Built around one ride:
          <br />a child’s.
        </h2>
        <p className="lead">
          Getting a child to school touches the people who care most: the parent
          who needs to know, the driver who carries the responsibility, and the
          school ready to welcome them.
        </p>
        <p>
          TroTro is a founder-led effort to close the gaps between those people.
          We believe responsibility should be clear before the journey starts,
          and that families deserve to stay informed along the way.
        </p>
        <p>
          That means both a real coordinated transportation service and
          thoughtful technology. Routes are planned, drivers complete documented
          checkpoints, and important moments are confirmed and recorded.
        </p>
      </section>
      <section className="values-section">
        <div className="container">
          <h2>What we bring to every journey.</h2>
          <div className="principles">
            <article>
              <Heart aria-hidden="true" size={26} />
              <h3>Care.</h3>
              <p>
                Every school ride matters to a child and the family who trusts
                the people behind it.
              </p>
            </article>
            <article>
              <ShieldCheck aria-hidden="true" size={26} />
              <h3>Trust.</h3>
              <p>
                Parents deserve to understand who is responsible and how a
                journey is managed.
              </p>
            </article>
            <article>
              <Route aria-hidden="true" size={26} />
              <h3>Connection.</h3>
              <p>
                Meaningful updates help families stay close to the ride without
                having to manage it.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="container section-space about-details">
        <Photo
          name="morning"
          alt="Illustrative parent and child getting ready for the school day."
        />
        <div>
          <h2>
            Thoughtful technology.
            <br />A very human purpose.
          </h2>
          <p>
            The app supports the work that happens in real life: planning
            routes, coordinating drivers and keeping parents informed.
          </p>
          <p>
            TroTro coordinates transportation; drivers operate their own
            vehicles. Service availability is confirmed with each family and
            school during the controlled pilot.
          </p>
          <TextLink href="/contact?intent=general">
            Start a conversation with us
          </TextLink>
        </div>
      </section>
      <Closing />
    </>
  );
}
function Contact({ intent }: { intent: "parent" | "school" | "general" }) {
  return (
    <>
      <div className="container contact-layout">
        <aside className="contact-intro">
          <p className="section-kicker">A better morning starts with a hello</p>
          <h1>
            Let’s find
            <br />
            your next step.
          </h1>
          <p>
            Finding a ride for your child? Exploring options for your school?
            We’d love to hear a little about what you need.
          </p>
          <div className="contact-detail">
            <Mail aria-hidden="true" size={21} />
            <div>
              <span>Email the team</span>
              <a href="mailto:trotrotransit@gmail.com">
                trotrotransit@gmail.com
              </a>
            </div>
          </div>
          <div className="contact-note">
            <ShieldCheck aria-hidden="true" size={23} />
            <p>
              Just the details needed for a conversation. Please keep children’s
              personal information out of your inquiry.
            </p>
          </div>
          <Photo
            name="morning"
            alt="Illustrative father helping his son get ready for school."
          />
          <p className="fine-print">
            Availability depends on your school and area. An inquiry does not
            book a ride.
          </p>
        </aside>
        <Inquiry initialIntent={intent} />
      </div>
    </>
  );
}
function DownloadPage() {
  return (
    <>
      <section className="container download-layout">
        <div>
          <p className="section-kicker">Connection, along for the ride</p>
          <h1>
            The school ride.
            <br />A little closer.
          </h1>
          <p className="lead">
            See who’s driving. Follow the active ride. Get an update at pickup
            and drop-off. The TroTro parent app keeps useful information within
            reach.
          </p>
          <div className="store-links">
            <a
              href="https://apps.apple.com/us/app/trotro-mobile/id6780704075"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download aria-hidden="true" />
              <span>
                <small>Available for iPhone</small>Apple App Store
              </span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.trotro.mobile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download aria-hidden="true" />
              <span>
                <small>Available for Android</small>Google Play
              </span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <p className="download-notice">
            Anyone can download the app. An active ride depends on service
            availability for your school and area. Downloading does not
            guarantee transportation.
          </p>
          <TextLink href="/contact">
            Check transportation availability first
          </TextLink>
          <a
            className="plain-link"
            href="https://www.jointrotro.com/tour?track=parent"
            target="_blank"
            rel="noopener noreferrer"
          >
            Take the existing guided product tour ↗
          </a>
        </div>
        <div className="download-screens">
          <img
            src="/app-screens/track-live.png"
            width="900"
            height="1950"
            alt="Actual TroTro app preview of a live ride with map and arrival estimate"
          />
          <img
            src="/app-screens/alerts.png"
            width="900"
            height="1950"
            alt="Actual TroTro app preview of ride notifications"
          />
          <span>Actual TroTro app previews</span>
        </div>
      </section>
      <section className="container section-space">
        <h2>From download to your first ride.</h2>
        <ol className="download-steps">
          <li>
            <span>1</span>
            <h3>Get the app.</h3>
            <p>Download TroTro for iOS or Android.</p>
          </li>
          <li>
            <span>2</span>
            <h3>Set up your account.</h3>
            <p>Create your family profile or access your existing account.</p>
          </li>
          <li>
            <span>3</span>
            <h3>Connect to your service.</h3>
            <p>
              Join your arranged transportation or request availability for your
              family.
            </p>
          </li>
        </ol>
        <div className="simple-band">
          <div>
            <h3>A little help getting started?</h3>
            <p>The team can help with downloading or setting up.</p>
          </div>
          <Button secondary href="/contact?intent=general">
            Contact TroTro
          </Button>
        </div>
      </section>
    </>
  );
}
function PartnerPreview() {
  return (
    <section className="container section-space partner-preview">
      <p className="section-kicker">Internal carousel preview</p>
      <h1>
        Helping families get to
        <br />
        the schools they love.
      </h1>
      <p>The school selection supplied for TroTro’s “Trusted by” carousel.</p>
      <SchoolCarousel
        schools={schoolPartners}
        preview={schoolPartners.length === 0}
      />
      <p className="fine-print">
        This preview page is excluded from the sitemap and marked noindex. The
        carousel also appears on the homepage.
      </p>
    </section>
  );
}
