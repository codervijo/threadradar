import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThreadRadar — The Friday briefing fractional CMOs read first" },
      {
        name: "description",
        content:
          "Weekly written intelligence from Reddit, Discord, and niche forums for the brands you advise. Built for fractional CMOs and operators juggling 3–5 brands.",
      },
      { property: "og:title", content: "ThreadRadar — Friday community intelligence for fractional CMOs" },
      {
        property: "og:description",
        content:
          "A written brief in your inbox every Friday at 7am. No dashboards. No alerts. Just what was said, where, and what it means.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ThreadRadar — Friday community intelligence" },
      {
        name: "twitter:description",
        content: "Weekly written brief on what's being said about your brands in the places that matter.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "ThreadRadar",
          description:
            "Weekly written community intelligence briefings for fractional CMOs. Monitors Reddit, Discord, and niche forums.",
          offers: {
            "@type": "Offer",
            price: "150",
            priceCurrency: "USD",
            description: "$150 per brand per month",
          },
        }),
      },
    ],
  }),
  component: LandingPage,
});

const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Briefing />
      <How />
      <Who />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden />
          ThreadRadar
        </a>
        <nav className="hidden gap-7 text-sm text-muted-foreground sm:flex">
          <a href="#briefing" className="hover:text-foreground">The briefing</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#signup"
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent hover:text-accent"
          >
            Get the brief
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-20 sm:pt-28">
        <p className="mb-6 text-xs uppercase tracking-[0.18em] text-accent">
          For fractional CMOs &middot; First 25 seats
        </p>
        <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          The Friday briefing fractional CMOs read{" "}
          <span className="text-accent">before</span> their first call.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Every Friday at 7am, you get one written intelligence brief per brand &mdash;
          what's being said on Reddit, Discord, and the niche forums your clients
          actually live in. No dashboards. No alerts. Just signal, in your inbox,
          before the week ends.
        </p>

        <div id="signup" className="mt-10">
          <SignupForm />
          <p className="mt-3 text-xs text-muted-foreground">
            Reserve a seat in the first cohort. We'll email you before launch &mdash; no spam, no
            tracking pixels.
          </p>
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
    </section>
  );
}

function SignupForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "New ThreadRadar waitlist signup");
    formData.append("from_name", "ThreadRadar Landing");

    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage("You're on the list. Watch for an email from us.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again in a moment.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="email" className="sr-only">Work email</label>
      <input
        id="email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@agency.com"
        className="flex-1 rounded-md border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
      {/* honeypot */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Reserving…" : "Reserve a seat"}
      </button>
      {message && (
        <p
          role="status"
          className={`mt-1 text-sm sm:absolute sm:mt-16 ${
            status === "success" ? "text-accent" : "text-destructive"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

function Briefing() {
  return (
    <section id="briefing" className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="mb-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          A sample brief
        </h2>
        <article className="rounded-lg border border-border bg-background p-8 font-serif sm:p-12">
          <header className="mb-8 border-b border-border pb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-accent" style={{ fontFamily: "var(--font-sans)" }}>
              Friday Brief &middot; Vol. 14 &middot; Acme Coffee Co.
            </p>
            <h3 className="mt-3 text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
              Sentiment is shifting in r/espresso &mdash; and it's about your grinder, not your beans.
            </h3>
          </header>

          <div className="space-y-5 text-[1.02rem] leading-relaxed text-foreground/90">
            <p>
              Three threads this week on r/espresso (combined 1,240 upvotes) singled out
              the new burr set as "stepless but inconsistent." Two of the posters are
              moderators. The tone is constructive, not hostile &mdash; they want a fix,
              not a refund.
            </p>
            <p>
              On the Home-Barista Discord (#gear-talk), a respected reviewer mentioned
              your name unprompted in a comparison with Niche. Worth a thank-you note.
              Screenshot and link in the appendix.
            </p>
            <p>
              <strong className="text-accent" style={{ fontFamily: "var(--font-sans)" }}>What it means:</strong>{" "}
              The community is telling you the grinder is the lever, not the beans.
              Your Q3 messaging is pointed the wrong way. A single technical post from
              your head of product, this week, would land harder than a campaign.
            </p>
          </div>

          <footer className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
            <p>3 conversations &middot; 2 communities &middot; 1 recommended action</p>
          </footer>
        </article>
        <p className="mt-6 text-sm text-muted-foreground">
          Every Friday. One brand, one page, one recommended action. Forwardable to
          your client without edits.
        </p>
      </div>
    </section>
  );
}

function How() {
  const steps = [
    {
      n: "01",
      t: "You name the brand and the rooms",
      d: "Tell us the brand, its category, and the subreddits, Discords, and forums where its customers actually talk. We'll add the ones you missed.",
    },
    {
      n: "02",
      t: "We listen all week",
      d: "Our analysts and tooling read every relevant thread. We weight signal by who's posting, not just upvotes. Moderators and repeat reviewers count more.",
    },
    {
      n: "03",
      t: "You get one brief on Friday at 7am",
      d: "A written summary, not a dashboard. What was said, where, by whom, and the one action we'd recommend this week. Forward to your client as-is.",
    },
  ];
  return (
    <section id="how" className="border-t border-border/60">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12 text-3xl font-semibold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <ol className="grid gap-10 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n}>
              <div className="mb-4 text-sm font-mono text-accent">{s.n}</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{s.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Who() {
  return (
    <section className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          Built for fractional CMOs and operators juggling 3&ndash;5 brands.
        </h2>
        <p className="text-lg text-muted-foreground">
          You don't have time to lurk on Reddit for every client. You also can't show
          up to a Monday call without knowing what their customers said over the
          weekend. ThreadRadar is the thing that makes that gap disappear &mdash; without
          adding another tab to your week.
        </p>
        <ul className="mt-8 grid gap-4 text-sm text-foreground/90 sm:grid-cols-2">
          <li className="rounded-md border border-border bg-background p-4">
            <strong className="text-foreground">No dashboards.</strong>{" "}
            <span className="text-muted-foreground">A written brief, not a tool to log into.</span>
          </li>
          <li className="rounded-md border border-border bg-background p-4">
            <strong className="text-foreground">No alerts.</strong>{" "}
            <span className="text-muted-foreground">One email, Friday morning. That's the contract.</span>
          </li>
          <li className="rounded-md border border-border bg-background p-4">
            <strong className="text-foreground">No tracking.</strong>{" "}
            <span className="text-muted-foreground">No pixels, no opens, no clicks. Read in peace.</span>
          </li>
          <li className="rounded-md border border-border bg-background p-4">
            <strong className="text-foreground">Forwardable.</strong>{" "}
            <span className="text-muted-foreground">Written to land in a client's inbox unedited.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/60">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pricing</h2>
        <p className="mt-3 text-muted-foreground">One number. One brand. One brief.</p>
        <div className="mx-auto mt-10 max-w-md rounded-lg border border-border bg-card p-8 text-left">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">Per brand</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tight">$150</span>
            <span className="text-muted-foreground">/ month</span>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>&middot; One brand, one Friday brief, every week</li>
            <li>&middot; Up to 10 communities monitored per brand</li>
            <li>&middot; Forwardable to your client, no edits required</li>
            <li>&middot; Cancel anytime, no contract</li>
          </ul>
          <a
            href="#signup"
            className="mt-8 block rounded-md bg-accent px-5 py-3 text-center text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            Reserve a seat
          </a>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Is this a dashboard?",
      a: "No. It's an email. One written brief per brand, delivered Friday at 7am your timezone. If you wanted a dashboard, you'd already have five.",
    },
    {
      q: "Which communities do you cover?",
      a: "Reddit, Discord servers, and niche forums (Indie Hackers, Hacker News, vertical communities). You name the rooms; we'll add the ones you missed.",
    },
    {
      q: "Who writes the briefs?",
      a: "A small team of analysts using internal tooling to surface threads. Every brief is read and edited by a human before it ships.",
    },
    {
      q: "When does it launch?",
      a: "We're onboarding the first 25 fractional CMOs in the coming weeks. Reserve a seat and we'll email you before the first brief goes out.",
    },
  ];
  return (
    <section className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">Questions</h2>
        <dl className="divide-y divide-border">
          {items.map((i) => (
            <div key={i.q} className="py-6">
              <dt className="text-base font-semibold text-foreground">{i.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-6 py-10 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p>&copy; {new Date().getFullYear()} ThreadRadar. A Friday morning habit.</p>
        <p>No tracking. No pixels. No spam.</p>
      </div>
    </footer>
  );
}
