"use client";

export default function AuditReportSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="h-4 w-32 bg-surface rounded mx-auto mb-3" />
        <div className="h-5 w-64 bg-surface rounded mx-auto mb-8" />
        {/* Score gauge placeholder */}
        <div className="mx-auto mb-4 h-36 w-36 rounded-full border-[6px] border-surface" />
        <div className="h-4 w-80 bg-surface rounded mx-auto mb-2" />
        <div className="h-4 w-60 bg-surface rounded mx-auto" />
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mb-8">
        <div className="h-10 w-28 bg-surface rounded-xl" />
        <div className="h-10 w-24 bg-surface rounded-xl" />
      </div>

      {/* Category score cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-surface/50 p-3 sm:p-4 text-center"
          >
            <div className="h-6 w-8 bg-surface rounded mx-auto mb-2" />
            <div className="h-3 w-12 bg-surface/70 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Headline rewrite placeholder */}
      <div className="rounded-2xl border border-border/30 bg-surface/30 p-5 sm:p-6 mb-8">
        <div className="h-5 w-48 bg-surface rounded mb-4" />
        <div className="h-3 w-16 bg-surface/60 rounded mb-2" />
        <div className="h-5 w-full bg-surface rounded mb-4" />
        <div className="h-3 w-20 bg-surface/60 rounded mb-2" />
        <div className="h-5 w-3/4 bg-surface rounded" />
      </div>

      {/* Finding cards placeholder */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/50 bg-surface/50 p-5 sm:p-6 mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-16 bg-red-500/10 rounded" />
            <div className="h-4 w-10 bg-surface rounded" />
            <div className="ml-auto h-4 w-20 bg-surface/60 rounded" />
          </div>
          <div className="h-5 w-2/3 bg-surface rounded mb-3" />
          <div className="space-y-2 mb-4">
            <div className="h-3 w-full bg-surface/60 rounded" />
            <div className="h-3 w-5/6 bg-surface/60 rounded" />
          </div>
          <div className="rounded-lg bg-surface/30 p-3">
            <div className="h-3 w-24 bg-surface rounded mb-2" />
            <div className="h-3 w-full bg-surface/50 rounded" />
            <div className="h-3 w-4/5 bg-surface/50 rounded mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
