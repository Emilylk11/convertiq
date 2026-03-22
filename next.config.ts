import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { resolve } from "path";

// Force-load .env.local to fix Claude Code setting ANTHROPIC_API_KEY=""
// in the shell environment. process.env takes precedence over .env.local,
// so empty strings block the real values. This runs before Next.js starts.
try {
  const envPath = resolve(__dirname, ".env.local");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
} catch {
  // .env.local may not exist in CI/production
}

// Validate critical env vars at build/start time
const REQUIRED_ENV_VARS = [
  "ANTHROPIC_API_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

if (process.env.NODE_ENV === "production") {
  const missing = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(
      `\n❌ Missing required environment variables:\n${missing.map((v) => `   - ${v}`).join("\n")}\n`
    );
    // Warn but don't crash — Vercel builds may not have all vars at build time
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
