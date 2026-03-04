// lib/sources.js — UPDATED with verified working RSS URLs

export const INDIAN_NEWS_SOURCES = [
  // ✅ WORKING — keep these exactly as they are
  {
    id: 'thehindu',
    name: 'The Hindu',
    country: '🇮🇳',
    rss: 'https://www.thehindu.com/feeder/default.rss',
    bias_label: 'Left-Liberal',
    color: '#7C3AED',
    ownership: 'Kasturi & Sons (family owned)'
  },
  {
    id: 'indianexpress',
    name: 'Indian Express',
    country: '🇮🇳',
    rss: 'https://indianexpress.com/feed/',
    bias_label: 'Centre',
    color: '#2563EB',
    ownership: 'Indian Express Group'
  },
  {
    id: 'ndtv',
    name: 'NDTV',
    country: '🇮🇳',
    rss: 'https://feeds.feedburner.com/ndtvnews-top-stories',
    bias_label: 'Centre-Left',
    color: '#DC2626',
    ownership: 'Adani Group (since 2022)'
  },

  // 🔄 REPLACED — fixed URLs below
  {
    id: 'hindustantimes',
    name: 'Hindustan Times',
    country: '🇮🇳',
    rss: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
    bias_label: 'Centre-Right',
    color: '#EF4444',
    ownership: 'HT Media Ltd'
  },
  {
    id: 'indiatoday',
    name: 'India Today',
    country: '🇮🇳',
    rss: 'https://www.indiatoday.in/rss/home', // ← fixed
    bias_label: 'Centre-Right',
    color: '#F59E0B',
    ownership: 'Living Media India'
  },
  {
    id: 'firstpost',
    name: 'Firstpost',             // ← replaced The Wire (broken)
    country: '🇮🇳',
    rss: 'https://www.firstpost.com/commonfeeds/v1/mfp/rss/india.xml',
    bias_label: 'Right / Pro-Government',
    color: '#10B981',
    ownership: 'Network18 (Mukesh Ambani)'
  }
];