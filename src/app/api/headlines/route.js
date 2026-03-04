import { INDIAN_NEWS_SOURCES } from '@/lib/sources';

const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic') || 'India';

  const keywords = topic.toLowerCase().split(' ').filter(k => k.length > 2);

  const results = await Promise.allSettled(
    INDIAN_NEWS_SOURCES.map(async (source) => {

      const res = await fetch(
        `${RSS2JSON}${encodeURIComponent(source.rss)}`,
        {
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(8000) // 8 second timeout per feed
        }
      );

      const data = await res.json();

      // Log each feed status so you can debug
      console.log(`${source.name}: status=${data.status}, items=${data.items?.length || 0}`);

      if (data.status !== 'ok' || !data.items?.length) {
        throw new Error(`Feed failed: ${source.name} — ${data.message || 'unknown error'}`);
      }

      // Try keyword filter first
      let relevant = data.items.filter(item => {
        const text = (item.title + ' ' + (item.description || '')).toLowerCase();
        return keywords.some(kw => text.includes(kw));
      });

      // FALLBACK: if no keyword matches, take top 3 latest articles
      // This ensures every working feed contributes something
      if (relevant.length === 0) {
        relevant = data.items.slice(0, 3);
      }

      return {
        source: {
          id: source.id,
          name: source.name,
          country: source.country,
          bias_label: source.bias_label,
          color: source.color,
          ownership: source.ownership
        },
        articles: relevant.slice(0, 3).map(item => ({
          title: item.title,
          description: (item.description || item.content || '')
            .replace(/<[^>]*>/g, '')
            .slice(0, 250),
          link: item.link,
          pubDate: item.pubDate
        })),
        keywordMatch: relevant.length > 0
      };
    })
  );

  // Separate successes from failures for debugging
  const succeeded = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');

  console.log(`✅ Succeeded: ${succeeded.length}, ❌ Failed: ${failed.length}`);
  failed.forEach(f => console.log('Failed:', f.reason?.message));

  const headlines = succeeded.map(r => r.value);

  return Response.json({
    topic,
    totalSources: headlines.length,
    failedSources: failed.length,
    failedReasons: failed.map(f => f.reason?.message),
    headlines,
    fetchedAt: new Date().toISOString()
  });
}