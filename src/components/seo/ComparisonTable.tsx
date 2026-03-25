interface ComparisonRow {
  feature: string;
  convertiq: string | boolean;
  competitor: string | boolean;
}

export default function ComparisonTable({
  competitorName,
  rows,
}: {
  competitorName: string;
  rows: ComparisonRow[];
}) {
  function renderCell(value: string | boolean) {
    if (typeof value === "boolean") {
      return value ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mx-auto text-green-400">
          <path d="M4 9l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mx-auto text-red-400">
          <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    return <span className="text-sm">{value}</span>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/50">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-surface/50 border-b border-border/50">
            <th className="px-4 sm:px-6 py-4 text-sm font-semibold text-muted w-1/3">Feature</th>
            <th className="px-4 sm:px-6 py-4 text-sm font-semibold text-accent-bright text-center w-1/3">ConvertIQ</th>
            <th className="px-4 sm:px-6 py-4 text-sm font-semibold text-muted text-center w-1/3">{competitorName}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-surface/30 transition-colors">
              <td className="px-4 sm:px-6 py-3.5 text-sm font-medium">{row.feature}</td>
              <td className="px-4 sm:px-6 py-3.5 text-center">{renderCell(row.convertiq)}</td>
              <td className="px-4 sm:px-6 py-3.5 text-center">{renderCell(row.competitor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
