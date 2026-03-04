import { INDIAN_NEWS_SOURCES } from "@/lib/sources";

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

// Parse RSS XML directly (fallback for feeds rss2json blocks)
function parseRSSXML(xml) {
  const items = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

  for (const match of itemMatches) {
    const item = match[1];

    const title =
      item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
      item.match(/<title>(.*?)<\/title>/)?.[1] ||
      "";

    const desc =
      item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
      item.match(/<description>(.*?)<\/description>/)?.[1] ||
      "";

    const link =
      item.match(/<link>(.*?)<\/link>/)?.[1] ||
      item.match(/<guid>(.*?)<\/guid>/)?.[1] ||
      "";

    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";

    if (title) items.push({ title, description: desc, link, pubDate });
  }

  return items;
}

async function fetchFeed(source) {
  // Try rss2json first
  try {
    const res = await fetch(`${RSS2JSON}${encodeURIComponent(source.rss)}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();

    if (data.status === "ok" && data.items?.length) {
      return data.items;
    }
  } catch (e) {
    // rss2json failed, try direct fetch
  }

  // Fallback: fetch RSS directly and parse XML
  const res = await fetch(source.rss, {
    signal: AbortSignal.timeout(8000),
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RSS reader)" },
  });

  const xml = await res.text();
  const items = parseRSSXML(xml);

  if (!items.length) throw new Error(`No items parsed from ${source.name}`);
  return items;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") || "India";
  const keywords = topic
    .toLowerCase()
    .split(" ")
    .filter((k) => k.length > 2);

  const results = await Promise.allSettled(
    INDIAN_NEWS_SOURCES.map(async (source) => {
      const items = await fetchFeed(source);

      console.log(`${source.name}: status=ok, items=${items.length}`);

      let relevant = items.filter((item) => {
        const text = (
          item.title +
          " " +
          (item.description || "")
        ).toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });

      if (relevant.length === 0) {
        // Return top 3 latest articles with a flag
        return {
          source: {
            id: source.id,
            name: source.name,
            country: source.country,
            bias_label: source.bias_label,
            color: source.color,
            ownership: source.ownership,
          },
          articles: items.slice(0, 3).map((item) => ({
            title: item.title,
            description: (item.description || "")
              .replace(/<[^>]*>/g, "")
              .slice(0, 250),
            link: item.link,
            pubDate: item.pubDate,
          })),
          keywordMatch: false, // tells us this source had no direct match
        };
      }

      return {
        source: {
          id: source.id,
          name: source.name,
          country: source.country,
          bias_label: source.bias_label,
          color: source.color,
          ownership: source.ownership,
        },
        articles: relevant.slice(0, 3).map((item) => ({
          title: item.title,
          description: (item.description || "")
            .replace(/<[^>]*>/g, "")
            .slice(0, 250),
          link: item.link,
          pubDate: item.pubDate,
        })),
        keywordMatch: true,
      };
    })
  );

  const succeeded = results.filter((r) => r.status === "fulfilled");
  const failed = results.filter((r) => r.status === "rejected");

  console.log(`✅ Succeeded: ${succeeded.length}, ❌ Failed: ${failed.length}`);
  failed.forEach((f) => console.log("Failed:", f.reason?.message));

  return Response.json({
    topic,
    totalSources: succeeded.length,
    failedSources: failed.length,
    failedReasons: failed.map((f) => f.reason?.message),
    headlines: succeeded.map((r) => r.value),
    fetchedAt: new Date().toISOString(),
  });
}
