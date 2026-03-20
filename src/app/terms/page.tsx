import type { Metadata } from "next";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Terms of Service — ConvertIQ",
  description:
    "ConvertIQ terms of service — the rules and conditions for using our conversion audit platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-full bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 sm:px-6 h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Convert<span className="text-accent-bright">IQ</span>
            </span>
          </a>
          <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
            <a
              href="/#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="/examples"
              className="hover:text-foreground transition-colors"
            >
              Examples
            </a>
            <a
              href="/pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/login"
              className="rounded-full bg-accent px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors"
            >
              Sign In
            </a>
            <MobileNav />
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 pt-14 sm:pt-20 pb-10 sm:pb-14 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-muted text-sm">Last updated: March 2026</p>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="space-y-10 text-muted leading-relaxed text-sm sm:text-base">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using ConvertIQ (&ldquo;the Service&rdquo;),
                you agree to be bound by these Terms of Service. If you do not
                agree to these terms, do not use the Service. We reserve the
                right to update these terms at any time, and your continued
                use of ConvertIQ constitutes acceptance of any changes.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                2. Description of Service
              </h2>
              <p>
                ConvertIQ is an AI-powered conversion rate optimisation
                platform. The Service analyses web pages you submit and
                generates audit reports with findings, scores, and
                recommendations. Reports are generated using artificial
                intelligence and should be treated as suggestions, not
                guarantees of specific conversion outcomes.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                3. Account & Eligibility
              </h2>
              <p>
                You must be at least 16 years old to use ConvertIQ. When you
                provide your email address or purchase credits, you are
                responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under
                your account. You agree to provide accurate and complete
                information.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                4. Credits & Payments
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  Credits are purchased in packs and each full audit consumes
                  1 credit.
                </li>
                <li>Credits are non-transferable and are tied to your account.</li>
                <li>Credits do not expire.</li>
                <li>
                  All prices are listed in USD and are exclusive of applicable
                  taxes unless otherwise stated.
                </li>
                <li>
                  Payments are processed securely by Lemon Squeezy. ConvertIQ
                  does not store your full payment card details.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                5. Refund Policy
              </h2>
              <p>
                Unused credits may be refunded upon request. Once a credit has
                been used to generate an audit, it is considered consumed and
                is non-refundable. If you are unsatisfied with the quality of
                an audit, contact us at{" "}
                <a
                  href="mailto:hello@convertiq.com"
                  className="text-accent-bright hover:underline"
                >
                  hello@convertiq.com
                </a>{" "}
                and we will work with you to resolve the issue.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                6. Acceptable Use
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  Submit URLs to pages you do not own or have authorisation to
                  analyse.
                </li>
                <li>
                  Use the Service to scrape, harvest, or collect data from
                  third-party websites in violation of their terms.
                </li>
                <li>
                  Attempt to reverse-engineer, decompile, or extract the
                  source code or AI models used by ConvertIQ.
                </li>
                <li>
                  Use the Service for any illegal, fraudulent, or harmful
                  purpose.
                </li>
                <li>
                  Interfere with or disrupt the Service or its infrastructure.
                </li>
                <li>
                  Resell, redistribute, or white-label audit reports without
                  prior written consent.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                7. Intellectual Property
              </h2>
              <p>
                All content, branding, software, and technology underlying
                ConvertIQ are owned by ConvertIQ or its licensors and are
                protected by intellectual property laws. Audit reports
                generated for you are licensed for your personal or internal
                business use. You may share reports with clients or
                stakeholders, but you may not resell them as a standalone
                product.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                8. AI-Generated Content Disclaimer
              </h2>
              <p>
                Audit reports are generated by artificial intelligence. While
                we strive for accuracy, AI-generated recommendations may
                contain errors, omissions, or suggestions that are not
                applicable to your specific situation. ConvertIQ does not
                guarantee any specific improvement in conversion rates,
                traffic, or revenue as a result of implementing audit
                recommendations. You are responsible for evaluating and
                applying recommendations at your own discretion.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                9. Data & Privacy
              </h2>
              <p>
                Your use of ConvertIQ is also governed by our{" "}
                <a
                  href="/privacy"
                  className="text-accent-bright hover:underline"
                >
                  Privacy Policy
                </a>
                . By using the Service, you consent to the collection and use
                of your information as described therein. Audit reports are
                stored for 90 days from generation. We recommend downloading
                PDF copies for your records.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                10. Service Availability
              </h2>
              <p>
                We aim to keep ConvertIQ available at all times but do not
                guarantee uninterrupted access. The Service may be temporarily
                unavailable due to maintenance, updates, or circumstances
                beyond our control. We are not liable for any loss or damage
                resulting from service downtime.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                11. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, ConvertIQ and its
                affiliates, officers, and employees shall not be liable for
                any indirect, incidental, special, consequential, or punitive
                damages, or any loss of profits or revenue, whether incurred
                directly or indirectly, arising from your use of the Service.
                Our total liability for any claim arising from or related to
                the Service shall not exceed the amount you paid to ConvertIQ
                in the 12 months preceding the claim.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                12. Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless ConvertIQ and its
                team from any claims, damages, losses, or expenses (including
                reasonable legal fees) arising from your use of the Service,
                your violation of these terms, or your infringement of any
                third-party rights.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                13. Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your access to
                ConvertIQ at any time, with or without notice, for conduct
                that we determine violates these Terms of Service or is
                harmful to the Service, other users, or third parties. Upon
                termination, unused credits may be refunded at our discretion.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                14. Governing Law
              </h2>
              <p>
                These Terms of Service are governed by and construed in
                accordance with applicable law. Any disputes arising from
                these terms or your use of ConvertIQ will be resolved through
                good-faith negotiation first, and if necessary, through
                binding arbitration or the courts of competent jurisdiction.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                15. Contact Us
              </h2>
              <p>
                If you have questions about these Terms of Service, contact us
                at{" "}
                <a
                  href="mailto:hello@convertiq.com"
                  className="text-accent-bright hover:underline"
                >
                  hello@convertiq.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

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
              <a
                href="/examples"
                className="hover:text-foreground transition-colors"
              >
                Examples
              </a>
              <a
                href="/pricing"
                className="hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <a
                href="/faq"
                className="hover:text-foreground transition-colors"
              >
                FAQ
              </a>
              <a
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
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
