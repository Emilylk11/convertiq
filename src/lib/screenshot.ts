/**
 * Captures a screenshot of a URL using the ScreenshotOne API.
 * Returns base64-encoded PNG or null on failure (graceful degradation).
 */

const SCREENSHOT_TIMEOUT_MS = 10_000;

export async function captureScreenshot(url: string): Promise<string | null> {
  const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY;
  if (!accessKey) {
    console.warn("SCREENSHOTONE_ACCESS_KEY not set — skipping visual analysis");
    return null;
  }

  try {
    const params = new URLSearchParams({
      access_key: accessKey,
      url,
      format: "jpg",
      quality: "50",
      viewport_width: "1280",
      viewport_height: "800",
      image_width: "640",
      block_cookie_banners: "true",
      block_chats: "true",
      full_page: "false",
      timeout: "8",
    });

    const apiUrl = `https://api.screenshotone.com/take?${params.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SCREENSHOT_TIMEOUT_MS);

    const response = await fetch(apiUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Screenshot API returned ${response.status} for ${url}`);
      return null;
    }

    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");

    // Check size — Claude accepts up to ~5MB base64, but let's keep it reasonable
    if (base64.length > 4_000_000) {
      console.warn(`Screenshot too large (${Math.round(base64.length / 1024)}KB) — skipping`);
      return null;
    }

    return base64;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn(`Screenshot capture timed out for ${url}`);
    } else {
      console.warn(`Screenshot capture failed for ${url}:`, error);
    }
    return null;
  }
}
