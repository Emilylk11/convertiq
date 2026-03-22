import type { Metadata } from "next";
import { BLOG_POSTS } from "./posts";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "Blog — CRO Tips & Conversion Optimization",
  description:
    "Practical conversion rate optimization tips, landing page strategies, and copywriting frameworks to increase your website conversions.",
};

export default function BlogPage() {
  return (
    <div className="min-h-full bg-background text-foreground">
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
            <a href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="/blog" className="text-foreground font-medium">Blog</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href="/login" className="rounded-full bg-accent px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-accent-bright transition-colors">
              Sign In
            </a>
            <MobileNav />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            CRO Tips &{" "}
            <span className="bg-gradient-to-r from-accent-bright to-accent bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
            Practical conversion optimization strategies you can implement today.
          </p>
        </div>

        <div className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-border/50 bg-surface/30 p-6 sm:p-8 hover:border-accent/30 hover:bg-surface/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-bright bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5">
                  {post.category}
                </span>
                <span className="text-xs text-muted">{post.readTime}</span>
                <span className="text-xs text-muted">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-accent-bright transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {post.description}
              </p>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8">
            <h2 className="text-xl font-bold mb-2">
              Ready to optimize your pages?
            </h2>
            <p className="text-sm text-muted mb-5 max-w-md mx-auto">
              Get an AI-powered conversion audit in 60 seconds. No account needed for your first audit.
            </p>
            <a
              href="/#free-audit"
              className="inline-block rounded-full bg-gradient-to-r from-accent to-accent-dim px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Try a Free Audit
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-xs font-bold text-white">C</div>
              <span className="text-sm font-medium">Convert<span className="text-accent-bright">IQ</span></span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
              <a href="/faq" className="hover:text-foreground transition-colors">FAQ</a>
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
            </div>
            <p className="text-xs text-muted/60">&copy; 2026 ConvertIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
