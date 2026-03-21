"use client";

interface ScoreTrendProps {
  /** Array of { score, date } sorted oldest to newest */
  history: { score: number; date: string }[];
}

function trendColor(change: number) {
  if (change > 0) return "text-green-400";
  if (change < 0) return "text-red-400";
  return "text-muted";
}

function trendIcon(change: number) {
  if (change > 0) {
    return (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-green-400">
        <path d="M8 12V4m0 0L4 8m4-4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (change < 0) {
    return (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-red-400">
        <path d="M8 4v8m0 0l4-4m-4 4L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-muted">
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ScoreTrend({ history }: ScoreTrendProps) {
  if (history.length < 2) return null;

  const latest = history[history.length - 1].score;
  const previous = history[history.length - 2].score;
  const change = latest - previous;
  const totalChange = latest - history[0].score;

  // Mini sparkline
  const maxScore = Math.max(...history.map((h) => h.score), 100);
  const minScore = Math.min(...history.map((h) => h.score), 0);
  const range = maxScore - minScore || 1;
  const width = 80;
  const height = 24;
  const padding = 2;

  const points = history.map((h, i) => {
    const x = padding + (i / (history.length - 1)) * (width - padding * 2);
    const y = height - padding - ((h.score - minScore) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p}`).join(" ");

  return (
    <div className="flex items-center gap-2">
      {/* Mini sparkline */}
      <svg width={width} height={height} className="shrink-0">
        <path
          d={pathD}
          fill="none"
          stroke={change >= 0 ? "#4ade80" : "#f87171"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots at each data point */}
        {history.map((h, i) => {
          const x = padding + (i / (history.length - 1)) * (width - padding * 2);
          const y = height - padding - ((h.score - minScore) / range) * (height - padding * 2);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill={i === history.length - 1 ? (change >= 0 ? "#4ade80" : "#f87171") : "#6b7280"}
            />
          );
        })}
      </svg>

      {/* Change badge */}
      <div className={`flex items-center gap-0.5 text-xs font-medium ${trendColor(change)}`}>
        {trendIcon(change)}
        <span>{change > 0 ? "+" : ""}{change}</span>
      </div>

      {/* Audit count */}
      <span className="text-[10px] text-muted">
        {history.length} audit{history.length !== 1 ? "s" : ""}
        {history.length > 2 && totalChange !== change && (
          <span className={`ml-1 ${trendColor(totalChange)}`}>
            ({totalChange > 0 ? "+" : ""}{totalChange} total)
          </span>
        )}
      </span>
    </div>
  );
}
