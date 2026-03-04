// app/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const QUICK_TOPICS = [
  '🗳️ Elections',
  '💰 Budget 2026',
  '🇮🇳🇵🇰 India Pakistan',
  '📉 Economy',
  '⚖️ Supreme Court',
  '🌾 Farmers'
];

export default function Home() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleAnalyze(t?: string) {
    const query = t || topic;
    if (!query.trim()) return;
    setLoading(true);
    router.push(`/analyze?topic=${encodeURIComponent(query.trim())}`);
  }

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-4xl font-bold text-white mb-3">
            MediaLens India
          </h1>
          <p className="text-gray-400 text-lg">
            See how Indian news channels cover the same story differently
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Powered by AI • 6 sources • 100% free
          </p>
        </div>

        {/* Search Box */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
            placeholder="Type any topic — Modi, Budget, Kashmir..."
            className="flex-1 bg-gray-900 border border-gray-700 text-white
                       rounded-xl px-4 py-3 text-lg outline-none
                       focus:border-blue-500 transition-colors
                       placeholder:text-gray-600"
          />
          <button
            onClick={() => handleAnalyze()}
            disabled={loading || !topic.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700
                       disabled:cursor-not-allowed text-white font-semibold
                       px-6 py-3 rounded-xl transition-colors text-lg"
          >
            {loading ? '...' : 'Analyze'}
          </button>
        </div>

        {/* Quick Topics */}
        <div className="mb-12">
          <p className="text-gray-600 text-sm mb-3 text-center">
            or try a quick topic
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {QUICK_TOPICS.map(t => (
              <button
                key={t}
                onClick={() => handleAnalyze(t.split(' ').slice(1).join(' '))}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300
                           px-4 py-2 rounded-full text-sm transition-colors
                           border border-gray-700 hover:border-gray-500"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '📡', title: 'Fetches live headlines', desc: 'From 6 Indian news sources right now' },
            { icon: '🤖', title: 'AI analyzes bias', desc: 'Detects framing, tone, loaded language' },
            { icon: '📊', title: 'You see the truth', desc: 'Side-by-side comparison of all outlets' }
          ].map(item => (
            <div key={item.title} className="bg-gray-900 rounded-xl p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="text-white text-sm font-semibold">{item.title}</h3>
              <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}