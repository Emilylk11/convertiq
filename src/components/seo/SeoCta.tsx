export default function SeoCta({
  headline = "Ready to optimize your conversions?",
  description = "Run a free AI conversion audit on your page. Get your score, specific findings, and actionable fixes in under 2 minutes.",
  primaryHref = "/#free-audit",
  primaryText = "Try a Free Audit",
  secondaryHref,
  secondaryText,
}: {
  headline?: string;
  description?: string;
  primaryHref?: string;
  primaryText?: string;
  secondaryHref?: string;
  secondaryText?: string;
}) {
  return (
    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 sm:p-10 text-center">
      <h2 className="text-xl sm:text-2xl font-bold mb-3">{headline}</h2>
      <p className="text-sm text-muted mb-6 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={primaryHref}
          className="inline-block rounded-full bg-gradient-to-r from-accent to-accent-dim px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          {primaryText}
        </a>
        {secondaryHref && secondaryText && (
          <a
            href={secondaryHref}
            className="inline-block rounded-full border border-border/50 bg-surface px-6 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:border-border transition-all"
          >
            {secondaryText}
          </a>
        )}
      </div>
    </div>
  );
}
