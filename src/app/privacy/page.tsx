import type { Metadata } from "next";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Privacy Policy — ConvertIQ",
  description:
    "ConvertIQ privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-muted text-sm">Last updated: March 2026</p>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="space-y-10 text-muted leading-relaxed text-sm sm:text-base">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                1. Introduction
              </h2>
              <p>
                ConvertIQ (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) operates the ConvertIQ website and
                conversion audit service. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our service. By using ConvertIQ, you agree to the
                collection and use of information in accordance with this
                policy.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                2. Information We Collect
              </h2>
              <p className="mb-3">
                We collect information you provide directly and information
                generated through your use of the service:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  <strong className="text-foreground">Account information:</strong>{" "}
                  Email address, name, and payment details when you purchase
                  credits.
                </li>
                <li>
                  <strong className="text-foreground">Audit data:</strong> URLs
                  you submit for analysis, the scraped page content used to
                  generate your report, and the resulting audit reports.
                </li>
                <li>
                  <strong className="text-foreground">Usage data:</strong>{" "}
                  Browser type, IP address, pages visited, time spent on the
                  site, and referring URLs.
                </li>
                <li>
                  <strong className="text-foreground">Cookies:</strong> We use
                  essential cookies for session management and optional
                  analytics cookies to improve the service.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>To provide, operate, and maintain the ConvertIQ audit service.</li>
                <li>To process transactions and send related information, including purchase confirmations and credit receipts.</li>
                <li>To send you audit reports and results via email.</li>
                <li>To improve, personalise, and expand our service.</li>
                <li>To understand and analyse usage trends and preferences.</li>
                <li>To detect, prevent, and address technical issues or abuse.</li>
                <li>To communicate with you about updates, promotions, or support — only with your consent where required by law.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                4. Data Sharing & Third Parties
              </h2>
              <p className="mb-3">
                We do not sell your personal information. We may share data
                with the following categories of third parties:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  <strong className="text-foreground">Payment processors:</strong>{" "}
                  We use Lemon Squeezy to process payments. Your payment
                  information is handled directly by them under their own
                  privacy policy.
                </li>
                <li>
                  <strong className="text-foreground">AI providers:</strong>{" "}
                  Page content submitted for audit is processed by our AI
                  engine. We do not send your personal information to AI
                  providers — only the scraped page content.
                </li>
                <li>
                  <strong className="text-foreground">Analytics:</strong> We
                  may use analytics services to monitor and analyse usage of
                  the service.
                </li>
                <li>
                  <strong className="text-foreground">Legal requirements:</strong>{" "}
                  We may disclose information if required by law, regulation,
                  or legal process.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                5. Data Retention
              </h2>
              <p>
                Audit reports are stored for 90 days from generation. Account
                information is retained for as long as your account is active
                or as needed to provide the service. You can request deletion
                of your data at any time by contacting us at{" "}
                <a
                  href="mailto:hello@convertiq.com"
                  className="text-accent-bright hover:underline"
                >
                  hello@convertiq.com
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                6. Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect
                your information, including encryption in transit (TLS/SSL)
                and at rest. However, no method of transmission over the
                internet or electronic storage is completely secure, and we
                cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                7. Your Rights
              </h2>
              <p className="mb-3">
                Depending on your jurisdiction, you may have the following
                rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>The right to access the personal data we hold about you.</li>
                <li>The right to request correction of inaccurate data.</li>
                <li>The right to request deletion of your data.</li>
                <li>The right to object to or restrict processing of your data.</li>
                <li>The right to data portability.</li>
                <li>The right to withdraw consent at any time.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:hello@convertiq.com"
                  className="text-accent-bright hover:underline"
                >
                  hello@convertiq.com
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                8. Cookies
              </h2>
              <p>
                ConvertIQ uses essential cookies required for the service to
                function (such as session cookies) and optional analytics
                cookies. You can control cookie preferences through your
                browser settings. Disabling essential cookies may affect
                service functionality.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                9. Children&apos;s Privacy
              </h2>
              <p>
                ConvertIQ is not directed to individuals under the age of 16.
                We do not knowingly collect personal information from children.
                If we become aware that we have collected data from a child
                without parental consent, we will take steps to delete that
                information.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                10. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of material changes by posting the updated policy
                on this page and updating the &ldquo;Last updated&rdquo; date.
                Your continued use of ConvertIQ after changes are posted
                constitutes acceptance of the revised policy.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">
                11. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy or our data
                practices, contact us at{" "}
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
