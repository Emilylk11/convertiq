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

const MAX_TEXT_LENGTH = 8000;

export async function scrapeUrl(url: string): Promise<ScrapedPageData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ConvertIQ/1.0; +https://convertiq.com)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
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
