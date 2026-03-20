export default function NotFound() {
  return (
    <div className="min-h-full bg-background text-foreground flex flex-col">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-4 sm:px-6 h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-mono text-sm font-bold text-white">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Convert<span className="text-accent-bright">IQ</span>
            </span>
          </a>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="text-7xl sm:text-8xl font-bold text-accent/20 mb-4 font-mono">
            404
          </p>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            Page not found
          </h1>
          <p className="text-muted text-sm mb-8 max-w-sm">
            This page doesn&apos;t exist or the report may have been removed.
          </p>
          <a
            href="/"
            className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
