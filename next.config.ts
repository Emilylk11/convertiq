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

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
