"use client";

import { useState, useMemo, useCallback } from "react";
import { scoreColor } from "@/lib/audit-categories";
import AuditFilters from "./AuditFilters";
import ScoreTrend from "./ScoreTrend";

interface AuditItem {
  id: string;
  url: string;
  audit_type: string;
  status: string;
  overall_score: number | null;
  created_at: string;
}

interface AuditHistoryClientProps {
  audits: AuditItem[];
}

function statusIcon(status: string) {
  switch (status) {
    case "completed":
      return (
        <span className="inline-flex h-2 w-2 rounded-full bg-green-400" title="Completed" />
      );
    case "processing":
      return (
        <span className="inline-flex h-2 w-2 rounded-full bg-yellow-400 animate-pulse" title="Processing" />
      );
    case "pending":
      return (
        <span className="inline-flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" title="Pending" />
      );
    case "failed":
      return (
        <span className="inline-flex h-2 w-2 rounded-full bg-red-400" title="Failed" />
      );
    default:
      return null;
  }
}

/** Normalize a URL for grouping: strip protocol, www, trailing slash */
function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    return (u.hostname.replace(/^www\./, "") + u.pathname).replace(/\/$/, "");
  } catch {
    return url.toLowerCase().replace(/\/$/, "");
  }
}

export default function AuditHistoryClient({ audits }: AuditHistoryClientProps) {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    sort: "newest",
  });

  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => setFilters(newFilters),
    []
  );

  // Build score history map: normalized URL → array of { score, date } sorted oldest first
  const scoreHistoryMap = useMemo(() => {
    const map = new Map<string, { score: number; date: string }[]>();
    // Process oldest first to build chronological history
    const sorted = [...audits]
      .filter((a) => a.status === "completed" && a.overall_score !== null)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    for (const audit of sorted) {
      const key = normalizeUrl(audit.url);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({
        score: audit.overall_score!,
        date: audit.created_at,
      });
    }
    return map;
  }, [audits]);

  // Apply filters
  const filtered = useMemo(() => {
    let result = [...audits];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((a) => a.url.toLowerCase().includes(q));
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter((a) => a.status === filters.status);
    }

    // Type filter
    if (filters.type !== "all") {
      result = result.filter((a) => a.audit_type === filters.type);
    }

    // Sort
    switch (filters.sort) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "score-high":
        result.sort((a, b) => (b.overall_score ?? -1) - (a.overall_score ?? -1));
        break;
      case "score-low":
        result.sort((a, b) => (a.overall_score ?? 999) - (b.overall_score ?? 999));
        break;
      default: // newest
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return result;
  }, [audits, filters]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Audit history</h2>
      </div>

      <AuditFilters
        onFilterChange={handleFilterChange}
        totalCount={audits.length}
        filteredCount={filtered.length}
      />

      <div className="mt-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 p-10 text-center">
            <div className="text-3xl mb-3">&#128269;</div>
            {audits.length === 0 ? (
              <>
                <h3 className="text-lg font-semibold mb-2">No audits yet</h3>
                <p className="text-sm text-muted mb-5 max-w-sm mx-auto">
                  Run your first audit to see it appear here.
                </p>
                <a
                  href="/dashboard/new-audit"
                  className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-dim px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Run an Audit &rarr;
                </a>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">No matching audits</h3>
                <p className="text-sm text-muted max-w-sm mx-auto">
                  Try adjusting your search or filters.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((audit) => {
              const history = scoreHistoryMap.get(normalizeUrl(audit.url));
              const hasMultipleAudits = history && history.length >= 2;

              return (
                <a
                  key={audit.id}
                  href={`/audit/${audit.id}`}
                  className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/30 p-4 hover:bg-surface/60 hover:border-border transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {statusIcon(audit.status)}
                      <p className="text-sm font-medium truncate group-hover:text-accent-bright transition-colors">
                        {audit.url}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 mt-1">
                      <p className="text-xs text-muted">
                        {new Date(audit.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <span className="mx-1.5">&middot;</span>
                        <span className="capitalize">{audit.audit_type} audit</span>
                      </p>
                      {hasMultipleAudits && (
                        <div className="sm:ml-3 sm:pl-3 sm:border-l sm:border-border/30">
                          <ScoreTrend history={history} />
                        </div>
                      )}
                    </div>
                  </div>
                  {audit.overall_score !== null && (
                    <div
                      className={`text-xl font-bold tabular-nums ${scoreColor(audit.overall_score)}`}
                    >
                      {audit.overall_score}
                    </div>
                  )}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-muted shrink-0"
                  >
                    <path
                      d="M6 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
