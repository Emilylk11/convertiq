import * as cheerio from "cheerio";
import type { ScrapedPageData } from "./types";

const CTA_KEYWORDS = [
  "buy",
  "sign up",
  "signup",
  "get started",
  "try",
  "subscribe",
  "download",
  "start",
  "join",
  "register",
  "book",
  "schedule",
  "request",
  "claim",
  "free",
  "demo",
  "contact",
  "learn more",
];

const TESTIMONIAL_SIGNALS = [
  "testimonial",
  "review",
  "quote",
  "customer-story",
  "social-proof",
  "rating",
];

const MAX_TEXT_LENGTH = 5000; // Reduced from 8000 — faster Claude processing, still enough for thorough analysis
const MAX_RESPONSE_SIZE = 5 * 1024 * 1024; // 5MB limit

// Block private/internal IPs to prevent SSRF attacks
export function isPrivateUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    const hostname = parsed.hostname.toLowerCase();

    // Block localhost variants
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname === "0.0.0.0"
    ) {
      return true;
    }

    // Block private IP ranges
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[01])\./,
      /^192\.168\./,
      /^169\.254\./, // link-local
      /^fc00:/i, // IPv6 private
      /^fe80:/i, // IPv6 link-local
      /^fd/i, // IPv6 unique local
    ];

    if (privateRanges.some((r) => r.test(hostname))) {
      return true;
    }

    // Block cloud metadata endpoints
    if (hostname === "metadata.google.internal" || hostname === "169.254.169.254") {
      return true;
    }

    // Block non-HTTP protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return true;
    }

    return false;
  } catch {
    return true; // Block malformed URLs
  }
}

export async function scrapeUrl(url: string): Promise<ScrapedPageData> {
  // SSRF protection
  if (isPrivateUrl(url)) {
    throw new Error("URL not allowed: private or internal addresses cannot be audited");
  }

  // DNS rebinding protection: resolve hostname and check IP before fetching
  try {
    const { hostname } = new URL(url);
    const dns = await import("dns").then((m) => m.promises);
    const addresses = await dns.resolve4(hostname).catch(() => []);
    const privateIpRanges = [
      /^127\./, /^10\./, /^172\.(1[6-9]|2[0-9]|3[01])\./, /^192\.168\./,
      /^169\.254\./, /^0\./, /^100\.(6[4-9]|[7-9]\d|1[0-2]\d)\./, // CGNAT
    ];
    for (const ip of addresses) {
      if (privateIpRanges.some((r) => r.test(ip))) {
        throw new Error("URL resolves to a private IP address — request blocked");
      }
    }
  } catch (dnsErr) {
    if (dnsErr instanceof Error && dnsErr.message.includes("private IP")) {
      throw dnsErr;
    }
    // DNS resolution failures will be caught by the fetch below
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ConvertIQ/1.0; +https://convertiq.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        throw new Error("The page took too long to respond (over 10 seconds). Please check the URL and try again.");
      }
      if (err.message.includes("ENOTFOUND") || err.message.includes("getaddrinfo")) {
        throw new Error("Could not find that domain. Please check the URL for typos.");
      }
      if (err.message.includes("ECONNREFUSED")) {
        throw new Error("The server refused the connection. The site may be down.");
      }
      if (err.message.includes("certificate") || err.message.includes("SSL")) {
        throw new Error("SSL certificate error. The site may have an invalid certificate.");
      }
    }
    throw new Error("Could not connect to the URL. Please check it and try again.");
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Page not found (404). Please check the URL.");
    }
    if (response.status === 403) {
      throw new Error("Access denied (403). The site is blocking our scraper.");
    }
    if (response.status >= 500) {
      throw new Error(`The site returned a server error (${response.status}). It may be down.`);
    }
    throw new Error(`Failed to fetch page: HTTP ${response.status}`);
  }

  // Check final URL after redirects for SSRF bypass via redirect
  const finalUrl = response.url;
  if (finalUrl && isPrivateUrl(finalUrl)) {
    throw new Error("URL redirected to a private address — request blocked");
  }

  // Check content type
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    throw new Error("URL does not return HTML content");
  }

  // Check content length before reading
  const contentLength = response.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_SIZE) {
    throw new Error("Page is too large to audit (over 5MB)");
  }

  const html = await response.text();

  if (html.length > MAX_RESPONSE_SIZE) {
    throw new Error("Page is too large to audit (over 5MB)");
  }
  const $ = cheerio.load(html);

  // Remove scripts and styles from text extraction
  $("script, style, noscript").remove();

  const baseUrl = new URL(url);

  // Extract headings
  const headings: ScrapedPageData["headings"] = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const level = parseInt(el.tagName.replace("h", ""), 10);
    const text = $(el).text().trim();
    if (text) headings.push({ level, text });
  });

  // Extract CTAs (buttons and action links)
  const ctas: ScrapedPageData["ctas"] = [];
  $("button, a[href], [role='button'], input[type='submit']").each((_, el) => {
    const text = $(el).text().trim().toLowerCase();
    const href = $(el).attr("href") || "";
    const isCta = CTA_KEYWORDS.some((kw) => text.includes(kw));
    const isButton =
      el.tagName === "button" ||
      $(el).attr("role") === "button" ||
      $(el).attr("type") === "submit";

    if (isCta || isButton) {
      ctas.push({
        text: $(el).text().trim(),
        href,
        type: isButton ? "button" : "link",
      });
    }
  });

  // Extract images
  const images: ScrapedPageData["images"] = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src") || "";
    const alt = $(el).attr("alt") || "";
    if (src) images.push({ src, alt });
  });

  // Extract links
  const links: ScrapedPageData["links"] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    const text = $(el).text().trim();
    if (!href || href.startsWith("#") || href.startsWith("javascript:"))
      return;
    let isExternal = false;
    try {
      const linkUrl = new URL(href, url);
      isExternal = linkUrl.hostname !== baseUrl.hostname;
    } catch {
      // skip malformed URLs
    }
    if (text) links.push({ text, href, isExternal });
  });

  // Body text content
  let textContent = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = textContent.split(/\s+/).length;
  if (textContent.length > MAX_TEXT_LENGTH) {
    textContent = textContent.slice(0, MAX_TEXT_LENGTH) + "...";
  }

  // Detect testimonials
  const pageHtml = $.html().toLowerCase();
  const hasTestimonials =
    TESTIMONIAL_SIGNALS.some(
      (signal) =>
        pageHtml.includes(`class="${signal}`) ||
        pageHtml.includes(`id="${signal}`) ||
        pageHtml.includes(signal)
    ) || $("blockquote").length > 0;

  // Detect pricing
  const hasPricingSection =
    pageHtml.includes("pricing") ||
    pageHtml.includes("price") ||
    $('[class*="pricing"], [id*="pricing"]').length > 0;

  // Form count
  const formCount = $("form").length;

  return {
    url,
    title: $("title").text().trim(),
    metaDescription: $('meta[name="description"]').attr("content") || "",
    metaKeywords: $('meta[name="keywords"]').attr("content") || "",
    ogImage: $('meta[property="og:image"]').attr("content") || null,
    headings,
    ctas,
    images,
    links,
    textContent,
    formCount,
    hasTestimonials,
    hasPricingSection,
    wordCount,
  };
}
