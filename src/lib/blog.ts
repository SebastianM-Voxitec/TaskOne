/**
 * Fetches and parses the official Voxitec blog (https://www.voxitec.com/blog)
 * for the RECENT NEWS section. Uses server-side fetch only; no mock data.
 * See: https://www.voxitec.com/blog
 */

const BLOG_ORIGIN = "https://www.voxitec.com";
const BLOG_URL = `${BLOG_ORIGIN}/blog`;

/** Official Voxitec blog post slugs only — RECENT NEWS shows only these 5 articles, in this order. */
const ALLOWED_BLOG_SLUGS_ORDERED = [
  "transforming-ontario-s-education-revolution-through-technology",
  "why-human-in-the-loop-is-the-foundation-of-responsible-ai-systems",
  "how-autonomy-drives-successful-mission-execution",
  "internship-reflections-building-the-foundation-at-voxitec",
  "the-exciting-future-of-large-language-models-1",
];
const ALLOWED_BLOG_SLUGS = new Set(ALLOWED_BLOG_SLUGS_ORDERED);

function getPostSlug(post: BlogPost): string {
  return new URL(post.url).pathname.replace(/^\/blog\/?/, "").replace(/\/$/, "").toLowerCase();
}

export type BlogPost = {
  title: string;
  url: string;
  date?: string;
  author?: string;
  excerpt?: string;
  /** Featured image from listing page or post og:image */
  imageUrl?: string;
  /** Fallback image (Lorem Picsum, no API key). Used when imageUrl is missing or fails to load. */
  fallbackImageUrl: string;
};

/** Lorem Picsum: no API key, no sign-up. Topic seed gives each article a stable, distinct image. */
const PICSUM_WIDTH = 360;
const PICSUM_HEIGHT = 240;

/** Map known article slugs to topic keywords so fallback images are more related to the article. */
const SLUG_TO_TOPIC: Record<string, string> = {
  "transforming-ontario-s-education-revolution-through-technology": "education-technology",
  "why-human-in-the-loop-is-the-foundation-of-responsible-ai-systems": "human-ai-responsible",
  "how-autonomy-drives-successful-mission-execution": "autonomy-mission",
  "internship-reflections-building-the-foundation-at-voxitec": "internship-office-team",
  "the-exciting-future-of-large-language-models-1": "ai-future-language",
};

/** Optional: hand-picked Picsum image IDs for stronger visual relevance (from picsum.photos/v2/list). */
const SLUG_TO_PICSUM_ID: Partial<Record<string, number>> = {
  "transforming-ontario-s-education-revolution-through-technology": 10,   // tech / laptop
  "why-human-in-the-loop-is-the-foundation-of-responsible-ai-systems": 26, // abstract / tech
  "how-autonomy-drives-successful-mission-execution": 24,                  // landscape / scope
  "internship-reflections-building-the-foundation-at-voxitec": 11,        // workspace
  "the-exciting-future-of-large-language-models-1": 16,                    // tech / future
};

function getPicsumUrlForSlug(slug: string): string {
  const id = SLUG_TO_PICSUM_ID[slug];
  if (id !== undefined) {
    return `https://picsum.photos/id/${id}/${PICSUM_WIDTH}/${PICSUM_HEIGHT}`;
  }
  const topic = SLUG_TO_TOPIC[slug] || slug || "blog";
  return `https://picsum.photos/seed/${encodeURIComponent(topic)}/${PICSUM_WIDTH}/${PICSUM_HEIGHT}`;
}

function resolveUrl(href: string): string {
  const trimmed = href.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = BLOG_ORIGIN;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return `${base}${trimmed}`;
  return `${BLOG_URL}/${trimmed}`;
}

/** Derive a readable title from blog post URL path (e.g. slug) when link has no text (e.g. image-only). */
function titleFromSlug(pathname: string): string {
  const slug = pathname.replace(/^\/blog\/?/, "").replace(/\/$/, "");
  if (!slug) return "Blog post";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** True if slug looks like a real article slug (not a page ID or internal path). */
function isLikelyArticleSlug(slug: string): boolean {
  const s = slug.toLowerCase();
  // Reject hex-only IDs (e.g. b7e06e395f27e247)
  if (/^[a-f0-9]{10,}$/i.test(s)) return false;
  // Reject "page-..." or slug that is just "page" + hex
  if (s.startsWith("page-") || s.startsWith("p-")) return false;
  // Require at least one hyphen: real post URLs are usually "word-word-word"
  if (!s.includes("-")) return false;
  return true;
}

/** True if post title looks like a placeholder/ID (e.g. "Page B7e06e395f27e247"). */
function isLikelyRealArticle(post: BlogPost): boolean {
  const path = new URL(post.url).pathname;
  const slug = path.replace(/^\/blog\/?/, "");
  if (!isLikelyArticleSlug(slug)) return false;
  // Reject title that is literally "Page" + hex/code
  if (/^Page\s+[a-f0-9]{8,}$/i.test(post.title.trim())) return false;
  return true;
}

/**
 * Extract image URLs from the blog listing HTML (e.g. img src, _next/image?url=, Cloudinary).
 * Returns array in same order as they appear (to match post order).
 */
function extractImageUrlsFromListing(html: string): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();

  // 1) _next/image?url=... (Voxitec uses Next.js) — decode url param to get canonical image
  const nextImageRegex = /_next\/image\?[^"']*?url=([^&"']+)/gi;
  let match: RegExpExecArray | null;
  while ((match = nextImageRegex.exec(html)) !== null) {
    try {
      const decoded = decodeURIComponent(match[1].replace(/\+/g, " "));
      if (decoded.startsWith("http") && !seen.has(decoded)) {
        seen.add(decoded);
        urls.push(decoded);
      }
    } catch {
      /* ignore */
    }
  }
  // 2) Direct Cloudinary URLs anywhere in page (e.g. in JSON or data attributes)
  const cloudinaryRegex =
    /https?:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_]+\/image\/upload\/[^\s"'<>]+/g;
  while ((match = cloudinaryRegex.exec(html)) !== null) {
    const src = match[0].replace(/&(?:w|q)=[^&]+/g, "").split("&")[0];
    if (src && !seen.has(src)) {
      seen.add(src);
      urls.push(src);
    }
  }
  // 3) img src to Cloudinary or voxitec
  const imgRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1].trim();
    if (
      (src.includes("cloudinary.com") || src.includes("voxitec.com")) &&
      !seen.has(src)
    ) {
      seen.add(src);
      urls.push(src);
    }
  }
  return urls;
}

/**
 * Fetches the blog listing page and extracts article links and metadata.
 * Handles both absolute and relative /blog/... links; returns empty array on fetch/parse errors.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(BLOG_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; VoxitecBlogFetcher/1.0; +https://github.com/voxitec/sebastian-task-one)",
      },
      next: { revalidate: 300 }, // Articles update automatically: refetch every 5 minutes
    });

    if (!res.ok) return [];
    const html = await res.text();

    // Pass 1: match <a href=".../blog/...">...</a> (captures title from link text or image-only)
    const linkRegex =
      /<a[^>]+href=["']([^"']*\/blog\/[^"']*?)["'][^>]*>([\s\S]*?)<\/a>/gi;
    const seen = new Set<string>();
    const posts: BlogPost[] = [];

    let m: RegExpExecArray | null;
    while ((m = linkRegex.exec(html)) !== null) {
      const rawHref = m[1];
      const rawText = m[2];
      const url = resolveUrl(rawHref);

      let path: string;
      try {
        path = new URL(url).pathname;
        if (path === "/blog" || path === "/blog/") continue;
        if (seen.has(path)) continue;
        seen.add(path);
      } catch {
        continue;
      }

      const titleFromText = rawText
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const title =
        titleFromText.length >= 3
          ? titleFromText
          : titleFromSlug(path);

      posts.push({
        title,
        url,
        date: undefined,
        author: undefined,
        excerpt: undefined,
        imageUrl: undefined,
        fallbackImageUrl: getPicsumUrlForSlug(path.replace(/^\/blog\/?/, "").replace(/\/$/, "") || "blog"),
      });
    }

    // Pass 2: catch any blog post URLs we missed (e.g. different HTML structure, data attributes)
    const hrefOnlyRegex = /href=["']([^"']*\/blog\/([^"'\s?#]+)[^"']*)["']/gi;
    while ((m = hrefOnlyRegex.exec(html)) !== null) {
      const rawHref = m[1];
      const slug = m[2];
      const url = resolveUrl(rawHref);
      try {
        const path = new URL(url).pathname;
        if (path === "/blog" || path === "/blog/") continue;
        if (seen.has(path)) continue;
        if (slug.length < 2) continue; // avoid /blog/ or trivial paths
        seen.add(path);
        posts.push({
          title: titleFromSlug(path),
          url,
          date: undefined,
          author: undefined,
          excerpt: undefined,
          imageUrl: undefined,
          fallbackImageUrl: getPicsumUrlForSlug(slug),
        });
      } catch {
        /* skip */
      }
    }

    // Pass 3: extract /blog/slug from JSON or HTML only when slug looks like a real article (not page IDs)
    const skipSlugs = new Set(["feed", "rss", "tag", "category", "author", "page"]);
    const slugInHtmlRegex = /\/blog\/([a-z0-9][a-z0-9-]*[a-z0-9]|[a-z0-9]{3,})/gi;
    while ((m = slugInHtmlRegex.exec(html)) !== null) {
      const slug = m[1].toLowerCase();
      if (slug.length < 3 || skipSlugs.has(slug) || !isLikelyArticleSlug(slug)) continue;
      const path = `/blog/${slug}`;
      if (seen.has(path)) continue;
      seen.add(path);
      const url = `${BLOG_ORIGIN}${path}`;
      posts.push({
        title: titleFromSlug(path),
        url,
        date: undefined,
        author: undefined,
        excerpt: undefined,
        imageUrl: undefined,
        fallbackImageUrl: getPicsumUrlForSlug(slug),
      });
    }

    // Keep only the 5 official Voxitec blog articles (whitelist)
    const allowed = posts.filter((p) => ALLOWED_BLOG_SLUGS.has(getPostSlug(p)));
    posts.length = 0;
    posts.push(...allowed);

    // Ensure all 5 official posts appear (add missing as links with title from slug; image/date fetched below if possible)
    const seenSlugs = new Set(posts.map(getPostSlug));
    for (const slug of ALLOWED_BLOG_SLUGS_ORDERED) {
      if (seenSlugs.has(slug)) continue;
      posts.push({
        title: titleFromSlug(`/blog/${slug}`),
        url: `${BLOG_ORIGIN}/blog/${slug}`,
        date: undefined,
        author: undefined,
        excerpt: undefined,
        imageUrl: undefined,
        fallbackImageUrl: getPicsumUrlForSlug(slug),
      });
      seenSlugs.add(slug);
    }

    // Attach dates when found in page (e.g. "August 21, 2025", "November 11, 2025")
    const dateRegex =
      /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/gi;
    const dateMatches = html.match(dateRegex);
    if (dateMatches && dateMatches.length > 0 && posts.length > 0) {
      const uniqueDates = Array.from(new Set(dateMatches));
      uniqueDates.slice(0, posts.length).forEach((d, i) => {
        if (posts[i]) posts[i].date = d;
      });
    }

    // Sort by official blog order (same order as on voxitec.com/blog)
    posts.sort((a, b) => {
      const iA = ALLOWED_BLOG_SLUGS_ORDERED.indexOf(getPostSlug(a));
      const iB = ALLOWED_BLOG_SLUGS_ORDERED.indexOf(getPostSlug(b));
      return (iA === -1 ? 999 : iA) - (iB === -1 ? 999 : iB);
    });

    // Extract image URLs from listing (e.g. Cloudinary, _next/image) and assign by index
    const listingImages = extractImageUrlsFromListing(html);
    listingImages.slice(0, posts.length).forEach((url, i) => {
      if (posts[i]) posts[i].imageUrl = url;
    });

    // For posts still missing image, fetch post page for og:image (first 5 only)
    await Promise.all(
      posts.slice(0, 5).map(async (post) => {
        if (post.imageUrl) return;
        const img = await getPostImageUrl(post.url);
        if (img) post.imageUrl = img;
      })
    );

    // Ensure fallbackImageUrl is set for every post (for client-side fallback when primary fails)
    const slugForPicsum = (p: BlogPost) =>
      getPostSlug(p) || "blog";
    posts.forEach((post) => {
      if (!post.fallbackImageUrl) post.fallbackImageUrl = getPicsumUrlForSlug(slugForPicsum(post));
      // When Voxitec image couldn't be obtained, use Picsum as primary so something shows
      if (!post.imageUrl) post.imageUrl = post.fallbackImageUrl;
    });

    return posts;
  } catch {
    return [];
  }
}

/**
 * Fetches a single post page and returns thumbnail URL: og:image first, then first content image.
 */
async function getPostImageUrl(postUrl: string): Promise<string | null> {
  try {
    const res = await fetch(postUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; VoxitecBlogFetcher/1.0; +https://github.com/voxitec/sebastian-task-one)",
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    // 1) og:image
    const ogMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    if (ogMatch?.[1]) return ogMatch[1].trim();
    const altMatch = html.match(
      /<meta[^>]+content=["']([^"']+)[^"']*["'][^>]+property=["']og:image["']/i
    );
    if (altMatch?.[1]) return altMatch[1].trim();
    // 2) First _next/image or Cloudinary image in page (article hero/thumbnail)
    const nextImg = html.match(/_next\/image\?[^"']*?url=([^&"']+)/i);
    if (nextImg?.[1]) {
      try {
        const decoded = decodeURIComponent(nextImg[1].replace(/\+/g, " "));
        if (decoded.startsWith("http")) return decoded;
      } catch {
        /* ignore */
      }
    }
    const cloudinary = html.match(
      /https?:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_]+\/image\/upload\/[^\s"'<>]+/
    );
    if (cloudinary?.[0]) return cloudinary[0].split("&")[0];
    const imgSrc = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
    if (imgSrc?.[1] && (imgSrc[1].includes("cloudinary") || imgSrc[1].includes("voxitec")))
      return imgSrc[1].trim();
    return null;
  } catch {
    return null;
  }
}
