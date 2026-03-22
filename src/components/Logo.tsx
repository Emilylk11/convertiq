import Link from "next/link";

export default function Logo({
  href = "/",
  size = "default",
}: {
  href?: string;
  size?: "small" | "default" | "large";
}) {
  const sizes = {
    small: { mark: 28, text: "text-base", gap: "gap-1.5" },
    default: { mark: 36, text: "text-xl", gap: "gap-2" },
    large: { mark: 48, text: "text-3xl", gap: "gap-3" },
  };
  const s = sizes[size];

  return (
    <Link href={href} className={`flex items-center ${s.gap} group`}>
      {/* Logo mark */}
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M8 36 C8 16 28 4 40 4"
          stroke="url(#logoGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M14 34 C14 20 28 10 38 10"
          stroke="url(#logoGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M20 32 C20 24 28 16 36 16"
          stroke="url(#logoGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M30 38 L30 20 M24 26 L30 20 L36 26"
          stroke="var(--accent-bright, #c084fc)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:translate-y-[-2px] transition-transform duration-200"
        />
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-dim, #7c3aed)" />
            <stop offset="100%" stopColor="var(--accent-bright, #c084fc)" />
          </linearGradient>
        </defs>
      </svg>
      {/* Wordmark */}
      <span className={`${s.text} font-bold tracking-tight`}>
        Convert<span className="text-accent-bright">IQ</span>
      </span>
    </Link>
  );
}
