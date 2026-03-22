import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Brand Guidelines",
  description: "ConvertIQ brand assets, colors, typography, and usage guidelines.",
};

const colors = [
  { name: "Purple Primary", hex: "#a855f7", var: "--accent", usage: "Primary actions, highlights, links" },
  { name: "Purple Bright", hex: "#c084fc", var: "--accent-bright", usage: "Logo accent, hover states, emphasis" },
  { name: "Purple Deep", hex: "#7c3aed", var: "--accent-dim", usage: "Gradients, secondary actions, dark accents" },
  { name: "Violet Core", hex: "#6d28d9", var: "—", usage: "Gradient endpoints, depth" },
  { name: "Background", hex: "#09090b", var: "--background", usage: "Page background (dark mode)" },
  { name: "Surface", hex: "#18181b", var: "--surface", usage: "Cards, panels, elevated surfaces" },
  { name: "Foreground", hex: "#fafafa", var: "--foreground", usage: "Primary text (dark mode)" },
  { name: "Muted", hex: "#a1a1aa", var: "--muted", usage: "Secondary text, captions, labels" },
  { name: "Border", hex: "#3f3f46", var: "--border", usage: "Dividers, card borders, separators" },
  { name: "Success", hex: "#22c55e", var: "--success", usage: "Positive states, high scores, confirmations" },
];

const donts = [
  "Don't change the logo colors",
  "Don't rotate or skew the logo",
  "Don't add effects (drop shadow, glow, outline) to the logo",
  "Don't place the logo on busy backgrounds without a container",
  "Don't use the icon mark without the wordmark at sizes below 24px",
  "Don't stretch or distort the logo proportions",
];

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <Logo href="/" />
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Brand Guidelines</h1>
        <p className="text-muted text-lg mb-16">
          Everything you need to represent ConvertIQ consistently.
        </p>

        {/* Logo Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-2">Logo</h2>
          <p className="text-muted mb-8">
            The ConvertIQ logo combines a signal/conversion mark with the wordmark. The
            mark represents upward conversion growth radiating outward — optimization that
            compounds.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Dark version */}
            <div className="rounded-2xl border border-border/50 bg-[#09090b] p-12 flex items-center justify-center">
              <Logo size="large" />
            </div>
            {/* Light version */}
            <div className="rounded-2xl border border-border/50 bg-[#fafafa] p-12 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M8 36 C8 16 28 4 40 4" stroke="url(#lgGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                  <path d="M14 34 C14 20 28 10 38 10" stroke="url(#lgGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
                  <path d="M20 32 C20 24 28 16 36 16" stroke="url(#lgGrad)" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M30 38 L30 20 M24 26 L30 20 L36 26" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="lgGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6d28d9"/>
                      <stop offset="100%" stopColor="#7c3aed"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-3xl font-bold tracking-tight text-[#18181b]">
                  Convert<span className="text-[#7c3aed]">IQ</span>
                </span>
              </div>
            </div>
          </div>

          {/* Icon mark */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl border border-border/50 bg-surface p-8 flex flex-col items-center justify-center gap-3">
              <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                <path d="M8 36 C8 16 28 4 40 4" stroke="url(#icGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                <path d="M14 34 C14 20 28 10 38 10" stroke="url(#icGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
                <path d="M20 32 C20 24 28 16 36 16" stroke="url(#icGrad)" strokeWidth="3" strokeLinecap="round"/>
                <path d="M30 38 L30 20 M24 26 L30 20 L36 26" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="icGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed"/>
                    <stop offset="100%" stopColor="#c084fc"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-xs text-muted">Icon Mark</span>
            </div>
            <div className="rounded-2xl border border-border/50 bg-surface p-8 flex flex-col items-center justify-center gap-3">
              <span className="text-3xl font-bold tracking-tight">
                Convert<span className="text-accent-bright">IQ</span>
              </span>
              <span className="text-xs text-muted">Wordmark Only</span>
            </div>
            <div className="rounded-2xl border border-border/50 bg-surface p-8 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-dim to-accent-bright flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                  <path d="M8 36 C8 16 28 4 40 4" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                  <path d="M14 34 C14 20 28 10 38 10" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
                  <path d="M20 32 C20 24 28 16 36 16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M30 38 L30 20 M24 26 L30 20 L36 26" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs text-muted">App Icon</span>
            </div>
          </div>

          {/* Don'ts */}
          <h3 className="text-lg font-semibold mb-3">Usage Don&apos;ts</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {donts.map((d) => (
              <div
                key={d}
                className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300"
              >
                <span className="text-red-400 mr-1">✕</span> {d}
              </div>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-2">Color Palette</h2>
          <p className="text-muted mb-8">
            Purple is our primary brand color — it represents intelligence, creativity,
            and premium quality. We use a refined violet spectrum paired with neutral zinc
            tones.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {colors.map((c) => (
              <div
                key={c.hex}
                className="rounded-xl border border-border/50 overflow-hidden"
              >
                <div
                  className="h-20"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="bg-surface p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <code className="text-xs text-muted font-mono">{c.hex}</code>
                  </div>
                  <p className="text-xs text-muted">{c.usage}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient */}
          <div className="mt-6 rounded-xl border border-border/50 overflow-hidden">
            <div
              className="h-20"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)",
              }}
            />
            <div className="bg-surface p-4">
              <p className="text-sm font-semibold">Brand Gradient</p>
              <code className="text-xs text-muted font-mono">
                linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)
              </code>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-2">Typography</h2>
          <p className="text-muted mb-8">
            We use Geist Sans for all UI text and Geist Mono for code and data. Both are
            modern, highly legible, and optimized for screens.
          </p>

          <div className="space-y-6">
            <div className="rounded-xl border border-border/50 bg-surface p-6">
              <p className="text-xs text-muted mb-3 uppercase tracking-wider">Geist Sans — Primary</p>
              <p className="text-4xl font-bold mb-2">The quick brown fox jumps</p>
              <p className="text-2xl font-semibold mb-2 text-muted">over the lazy dog</p>
              <p className="text-base text-muted">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
              </p>
            </div>

            <div className="rounded-xl border border-border/50 bg-surface p-6">
              <p className="text-xs text-muted mb-3 uppercase tracking-wider">Geist Mono — Data &amp; Code</p>
              <p className="text-2xl font-bold font-mono mb-2">Score: 73/100</p>
              <p className="text-base font-mono text-muted">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { weight: "Bold (700)", size: "text-2xl font-bold", sample: "Headlines" },
                { weight: "Semibold (600)", size: "text-xl font-semibold", sample: "Subheadings" },
                { weight: "Medium (500)", size: "text-base font-medium", sample: "Body emphasis" },
                { weight: "Regular (400)", size: "text-base", sample: "Body text" },
              ].map((t) => (
                <div key={t.weight} className="rounded-xl border border-border/50 bg-surface p-4">
                  <p className={t.size}>{t.sample}</p>
                  <p className="text-xs text-muted mt-2">{t.weight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Voice & Tone */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-2">Voice &amp; Tone</h2>
          <p className="text-muted mb-8">
            ConvertIQ speaks like a sharp, experienced consultant who respects your time.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                do_: true,
                title: "Direct & specific",
                example: "Your CTA is buried below the fold. Move it above the hero image.",
              },
              {
                do_: false,
                title: "Vague & generic",
                example: "Consider improving your call-to-action placement for better results.",
              },
              {
                do_: true,
                title: "Confident & backed by data",
                example: "Pages with above-fold CTAs convert 2.3x higher on average.",
              },
              {
                do_: false,
                title: "Hedging & uncertain",
                example: "You might want to maybe try moving your button, it could possibly help.",
              },
              {
                do_: true,
                title: "ROI-focused",
                example: "This fix could recover $4,200/month in lost conversions.",
              },
              {
                do_: false,
                title: "Feature-focused",
                example: "Our AI uses advanced algorithms to analyze page elements.",
              },
            ].map((v, i) => (
              <div
                key={i}
                className={`rounded-xl border px-5 py-4 ${
                  v.do_
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <p className={`text-sm font-semibold mb-1 ${v.do_ ? "text-green-400" : "text-red-400"}`}>
                  {v.do_ ? "✓ Do:" : "✕ Don't:"} {v.title}
                </p>
                <p className="text-sm text-muted italic">&ldquo;{v.example}&rdquo;</p>
              </div>
            ))}
          </div>
        </section>

        {/* Downloads */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Downloads</h2>
          <p className="text-muted mb-6">
            Download logo files for use in press, partnerships, and marketing materials.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Logo (Dark BG)", file: "/logo.svg" },
              { label: "Logo (Light BG)", file: "/logo-dark.svg" },
              { label: "Icon Mark", file: "/logo-icon.svg" },
              { label: "OG Image", file: "/og-image.svg" },
            ].map((d) => (
              <a
                key={d.file}
                href={d.file}
                download
                className="inline-flex items-center gap-2 rounded-xl bg-surface border border-border/50 px-5 py-3 text-sm font-medium hover:border-accent/50 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8M5 7l3 3 3-3M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {d.label}
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-8 mt-16">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted">
          &copy; 2026 ConvertIQ. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
