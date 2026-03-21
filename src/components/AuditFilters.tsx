"use client";

import { useState, useCallback } from "react";

interface AuditFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    type: string;
    sort: string;
  }) => void;
  totalCount: number;
  filteredCount: number;
}

export default function AuditFilters({
  onFilterChange,
  totalCount,
  filteredCount,
}: AuditFiltersProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");

  const update = useCallback(
    (
      newSearch?: string,
      newStatus?: string,
      newType?: string,
      newSort?: string
    ) => {
      const s = newSearch ?? search;
      const st = newStatus ?? status;
      const t = newType ?? type;
      const so = newSort ?? sort;
      setSearch(s);
      setStatus(st);
      setType(t);
      setSort(so);
      onFilterChange({ search: s, status: st, type: t, sort: so });
    },
    [search, status, type, sort, onFilterChange]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by URL..."
            value={search}
            onChange={(e) => update(e.target.value, undefined, undefined, undefined)}
            className="w-full rounded-xl border border-border/50 bg-surface/30 pl-9 pr-4 py-2.5 text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
          />
          {search && (
            <button
              onClick={() => update("", undefined, undefined, undefined)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => update(undefined, e.target.value, undefined, undefined)}
            className="rounded-xl border border-border/50 bg-surface/30 px-3 py-2.5 text-sm text-muted focus:outline-none focus:border-accent/50 transition-all cursor-pointer"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={type}
            onChange={(e) => update(undefined, undefined, e.target.value, undefined)}
            className="rounded-xl border border-border/50 bg-surface/30 px-3 py-2.5 text-sm text-muted focus:outline-none focus:border-accent/50 transition-all cursor-pointer"
          >
            <option value="all">All types</option>
            <option value="full">Full audits</option>
            <option value="free">Free audits</option>
          </select>

          <select
            value={sort}
            onChange={(e) => update(undefined, undefined, undefined, e.target.value)}
            className="rounded-xl border border-border/50 bg-surface/30 px-3 py-2.5 text-sm text-muted focus:outline-none focus:border-accent/50 transition-all cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="score-high">Highest score</option>
            <option value="score-low">Lowest score</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {(search || status !== "all" || type !== "all") && (
        <p className="text-xs text-muted">
          Showing {filteredCount} of {totalCount} audit
          {totalCount !== 1 ? "s" : ""}
          {search && (
            <>
              {" "}
              matching &ldquo;
              <span className="text-foreground">{search}</span>&rdquo;
            </>
          )}
        </p>
      )}
    </div>
  );
}
