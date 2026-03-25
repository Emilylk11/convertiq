import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "../posts";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/schema";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://convert-iqs.com";

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      url: `${APP_URL}/blog/${slug}`,
    },
    alternates: {
      canonical: `${APP_URL}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Simple markdown-ish rendering for blog content
  const paragraphs = post.content.split("\n\n");

  return (
    <div className="min-h-full bg-background text-foreground">
      {/* JSON-LD structured data — rendered server-side for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildArticleSchema({
            title: post.title,
            description: post.description,
            slug: post.slug,
            datePublished: post.date,
            readTime: post.readTime,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
        }}
      />
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

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-14 sm:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted mb-8">
          <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
          <span>/</span>
          <span className="text-foreground truncate">{post.title}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-bright bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5">
              {post.category}
            </span>
            <span className="text-xs text-muted">{post.readTime}</span>
            <span className="text-xs text-muted">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Content */}
        <article className="prose-convertiq">
          {paragraphs.map((p, i) => {
            const trimmed = p.trim();
            if (!trimmed) return null;

            // H2 headings
            if (trimmed.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="text-xl sm:text-2xl font-bold mt-10 mb-4"
                >
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }

            // H3 headings
            if (trimmed.startsWith("### ")) {
              return (
                <h3
                  key={i}
                  className="text-lg font-semibold mt-8 mb-3"
                >
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }

            // Render paragraph with basic inline formatting
            return (
              <p
                key={i}
                className="text-sm sm:text-base text-muted leading-relaxed mb-4"
                dangerouslySetInnerHTML={{
                  __html: trimmed
                    .replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="text-foreground font-semibold">$1</strong>'
                    )
                    .replace(
                      /\*(.*?)\*/g,
                      '<em>$1</em>'
                    ),
                }}
              />
            );
          })}
        </article>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center">
          <h2 className="text-xl font-bold mb-2">
            Want to see these principles in action?
          </h2>
          <p className="text-sm text-muted mb-5 max-w-md mx-auto">
            Run a free AI conversion audit on your landing page. Get your score, specific findings, and ready-to-use copy rewrites in 60 seconds.
          </p>
          <a
            href="/#free-audit"
            className="inline-block rounded-full bg-gradient-to-r from-accent to-accent-dim px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Try a Free Audit
          </a>
        </div>

        {/* More posts */}
        <div className="mt-16">
          <h3 className="text-lg font-semibold mb-4">More articles</h3>
          <div className="space-y-3">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug)
              .slice(0, 3)
              .map((p) => (
                <a
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block rounded-xl border border-border/50 bg-surface/30 p-4 hover:border-accent/30 transition-all"
                >
                  <p className="text-sm font-semibold mb-1">{p.title}</p>
                  <p className="text-xs text-muted">{p.readTime} &middot; {p.category}</p>
                </a>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
