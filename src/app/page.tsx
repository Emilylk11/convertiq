import AuditForm from "@/components/AuditForm";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Convert<span className="text-accent-bright">IQ</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="/examples" className="hover:text-foreground transition-colors">
              Examples
            </a>
            <a href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#free-audit"
              className="rounded-full bg-accent px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors"
            >
              Get Free Audit
            </a>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-44 sm:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[128px]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent-bright mb-6 sm:mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Now in beta — free audits for early adopters
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-5 sm:mb-6">
            Stop guessing.{" "}
            <span className="bg-gradient-to-r from-accent-bright to-accent bg-clip-text text-transparent">
              Start converting.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-xl text-muted leading-relaxed mb-8 sm:mb-10">
            ConvertIQ uses AI to analyse your website and pinpoint exactly where
            visitors drop off. Get a free conversion audit with actionable fixes
            — in under 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#free-audit"
              className="pulse-glow w-full sm:w-auto rounded-full bg-gradient-to-r from-accent to-accent-dim px-8 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity text-center"
            >
              Get Your Free Audit
            </a>
            <a
              href="/examples"
              className="w-full sm:w-auto rounded-full border border-border px-8 py-4 text-base font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-colors text-center"
            >
              See Example Reports
            </a>
          </div>

          {/* Trust strip */}
          <div className="mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <CheckIcon />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon />
              Results in 2 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon />
              Works on any website
            </span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/50 bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { value: "2,400+", label: "Sites audited" },
            { value: "23%", label: "Avg. conversion lift" },
            { value: "<2 min", label: "Time to insights" },
            { value: "97%", label: "Customer satisfaction" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-bold text-accent-bright">
                {stat.value}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
              Three steps to{" "}
              <span className="text-accent-bright">higher conversions</span>
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
              No complex setup. No learning curve. Just paste your URL and let
              AI do the heavy lifting.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                step: "01",
                title: "Paste your URL",
                desc: "Enter any page on your site. Our crawler handles the rest — no code or tag installation needed.",
                icon: LinkIcon,
              },
              {
                step: "02",
                title: "AI analyses everything",
                desc: "We scan layout, copy, CTAs, page speed, mobile UX, and 40+ conversion signals in real time.",
                icon: BrainIcon,
              },
              {
                step: "03",
                title: "Get your report",
                desc: "Receive a prioritised list of fixes with predicted impact scores so you know what to tackle first.",
                icon: ChartIcon,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="gradient-border p-6 sm:p-8 rounded-2xl bg-surface"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-accent tracking-widest">
                    {item.step}
                  </span>
                  <item.icon />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-28 bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to{" "}
              <span className="text-accent-bright">convert more</span>
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
              Powered by the same AI models used by top growth teams — now
              accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: "CTA Analysis",
                desc: "AI evaluates your calls-to-action for placement, copy strength, contrast, and urgency signals.",
                icon: "🎯",
              },
              {
                title: "Page Speed Scoring",
                desc: "Slow pages kill conversions. Get a speed score with specific fixes that move the needle.",
                icon: "⚡",
              },
              {
                title: "Mobile UX Audit",
                desc: "Over 60% of traffic is mobile. We flag tap-target issues, layout shifts, and scroll friction.",
                icon: "📱",
              },
              {
                title: "Copy Effectiveness",
                desc: "AI analyses your headline hierarchy, value propositions, and readability for conversion impact.",
                icon: "✍️",
              },
              {
                title: "Trust Signal Check",
                desc: "Reviews, testimonials, badges, guarantees — we verify you have the social proof that converts.",
                icon: "🛡️",
              },
              {
                title: "Downloadable PDF",
                desc: "Export your full audit report as a polished PDF to share with your team or clients.",
                icon: "📄",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/50 bg-surface/50 p-6 sm:p-8 hover:border-accent/30 hover:bg-surface transition-all duration-300"
              >
                <div className="text-2xl mb-4">{feature.icon}</div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-accent-bright transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Taster / Audit Form */}
      <section id="free-audit" className="py-16 sm:py-28 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
          <div className="gradient-border rounded-2xl bg-surface p-6 sm:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
                Get your{" "}
                <span className="text-accent-bright">free audit</span>
              </h2>
              <p className="text-muted text-base sm:text-lg">
                Enter your URL and email below. Your personalised conversion
                report will land in your inbox within minutes.
              </p>
            </div>

            <AuditForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-xs font-bold text-white">
                C
              </div>
              <span className="text-sm font-medium">
                Convert<span className="text-accent-bright">IQ</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <a href="/examples" className="hover:text-foreground transition-colors">
                Examples
              </a>
              <a href="/pricing" className="hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="/faq" className="hover:text-foreground transition-colors">
                FAQ
              </a>
              <a href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </a>
            </div>
            <p className="text-xs sm:text-sm text-muted/60">
              &copy; 2026 ConvertIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Inline icons ──────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-success shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      className="h-5 w-5 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg
      className="h-5 w-5 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      className="h-5 w-5 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}
