import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://convert-iqs.com";

export const metadata: Metadata = {
  title: {
    default: "ConvertIQ — AI-Powered Conversion Audits",
    template: "%s — ConvertIQ",
  },
  description:
    "Get a free AI-powered audit of your landing page. Discover exactly where you're losing conversions and get actionable fixes with ready-to-use copy rewrites in 60 seconds.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    siteName: "ConvertIQ",
    title: "ConvertIQ — AI-Powered Conversion Audits",
    description:
      "Paste any URL, get a full conversion teardown in 60 seconds. AI scores your page across 6 categories and gives you exact copy rewrites. A CRO agency charges $5,000 — ConvertIQ does it for $2.58.",
    url: APP_URL,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ConvertIQ — AI-Powered Conversion Audits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ConvertIQ — AI-Powered Conversion Audits",
    description:
      "Paste any URL, get a full conversion teardown in 60 seconds. AI-powered scoring, findings, and ready-to-deploy copy rewrites.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
        >{`(function(){try{var t=localStorage.getItem("convertiq-theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`}</Script>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
