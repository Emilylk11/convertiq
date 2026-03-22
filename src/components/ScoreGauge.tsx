export default function ScoreGauge({
  score,
  size = 160,
}: {
  score: number;
  size?: number;
}) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score >= 70
      ? "text-green-400"
      : score >= 40
        ? "text-yellow-400"
        : "text-red-400";
  const strokeColor =
    score >= 70 ? "#4ade80" : score >= 40 ? "#facc15" : "#f87171";

  return (
    <div className="relative inline-flex items-center justify-center" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`Overall score: ${score} out of 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${color}`}>{score}</span>
        <span className="text-xs text-muted">/100</span>
      </div>
    </div>
  );
}
