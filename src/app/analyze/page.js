// app/analyze/page.js
"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SourceCard from "@/components/SourceCard";
import BiasRadar from "@/components/BiasRadar";
import ConsensusBox from "@/components/ConsensusBox";

const LOADING_MESSAGES = [
  "📡 Fetching live headlines from 6 sources...",
  "🔍 Reading between the lines...",
  "🤖 AI detecting spin cycles...",
  "⚖️ Counting loaded words...",
  "🧠 Comparing framing patterns...",
  "📊 Calculating bias scores...",
  "✍️ Writing your analysis...",
];

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Modi";

  const [loadingMsg, setLoadingMsg] = useState("📡 Fetching live headlines...");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("Fetching live headlines...");
  const [error, setError] = useState(null);

  useEffect(() => {
    analyze();
  }, [topic]);

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  async function analyze() {
    try {
      setLoading(true);
      setError(null);

      // Step 1
      setStep("📡 Fetching live headlines from 6 sources...");
      const headlinesRes = await fetch(
        `/api/headlines?topic=${encodeURIComponent(topic)}`
      );
      const { headlines } = await headlinesRes.json();

      if (!headlines?.length) {
        throw new Error(
          `No Indian news coverage found for "${topic}" right now. Try: Modi, Kashmir, Economy, or Supreme Court.`
        );
      }

      // Step 2
      setStep(`🤖 AI analyzing ${headlines.length} sources for bias...`);
      const analysisRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headlines, topic }),
      });

      if (!analysisRes.ok) throw new Error("Analysis failed");

      const analysis = await analysisRes.json();
      if (analysis.error) throw new Error(analysis.error);

      setResults(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-6 animate-pulse">🔍</div>
          <p className="text-white text-lg font-medium mb-2">{loadingMsg}</p>
          <p className="text-gray-500 text-sm">
            Analyzing "{topic}" — takes 5-10 seconds
          </p>
          {/* Loading bar */}
          <div className="w-64 bg-gray-800 rounded-full h-1 mt-6 mx-auto overflow-hidden">
            <div className="h-1 bg-blue-500 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-2">Analysis Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            Try Again
          </a>
        </div>
      </div>
    );
  }

  // Match by id OR name (Groq sometimes returns name instead of id)
  const mostNeutral = results.sources?.find(
    (s) =>
      s.id === results.most_neutral ||
      s.name?.toLowerCase() === results.most_neutral?.toLowerCase()
  );
  const mostBiased = results.sources?.find(
    (s) =>
      s.id === results.most_biased ||
      s.name?.toLowerCase() === results.most_biased?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/"
            className="text-gray-500 text-sm hover:text-gray-300 mb-4 block"
          >
            ← Back
          </a>
          <h1 className="text-2xl font-bold text-white mb-1">
            🔍 "{results.topic}"
          </h1>
          <p className="text-gray-400 text-sm">
            {results.sources?.length} sources analyzed • Confidence:{" "}
            {results.confidence_score}% •{" "}
            {new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            IST
          </p>
        </div>

        {/* Summary */}
        <div className="bg-gray-900 rounded-2xl p-5 mb-6 border border-gray-800">
          <p className="text-gray-300 text-sm leading-relaxed">
            {results.summary}
          </p>
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-800">
            <div>
              <p className="text-xs text-gray-500 mb-1">Most Neutral</p>
              <p className="text-green-400 text-sm font-semibold">
                ✅ {mostNeutral?.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Most Biased</p>
              <p className="text-red-400 text-sm font-semibold">
                ⚠️ {mostBiased?.name || "—"}
              </p>
            </div>
          </div>
        </div>

        

        {/* Radar Chart */}
        <BiasRadar sources={results.sources} />

        {/* Consensus */}
        <ConsensusBox
          points={results.consensus}
          keyDifference={results.key_difference}
        />

        {/* Source Cards */}
        <h2 className="text-lg font-semibold mb-4">
          📰 Source-by-Source Analysis
        </h2>
        {results.sources
          ?.sort((a, b) => a.overall_bias_score - b.overall_bias_score)
          .map((source, i) => (
            <SourceCard key={i} source={source} />
          ))}

        {/* Share Button */}
        <div className="mb-4">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `I just analyzed Indian media coverage of "${
                results.topic
              }" 🔍\n\nMost neutral: ${
                mostNeutral?.name || "?"
              }\nMost biased: ${
                mostBiased?.name || "?"
              }\n\nSee the full breakdown 👇\nhttps://medialens-india.vercel.app`
            )}`}
            target="_blank"
            className="block w-full text-center bg-gray-800 hover:bg-gray-700
             border border-gray-700 text-white py-3 rounded-xl
             font-semibold transition-colors mb-3"
          >
            𝕏 Share this analysis
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `Check how Indian media covers "${
                results.topic
              }" differently 🔍\n\nMost neutral: ${
                mostNeutral?.name || "?"
              }\nMost biased: ${
                mostBiased?.name || "?"
              }\n\nhttps://medialens-india.vercel.app`
            )}`}
            target="_blank"
            className="block w-full text-center bg-green-900/50 hover:bg-green-900
             border border-green-800 text-green-300 py-3 rounded-xl
             font-semibold transition-colors"
          >
            💬 Share on WhatsApp
          </a>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-8 border-t border-gray-800">
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-500 text-white
                       px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Analyze Another Topic
          </a>
          <p className="text-gray-600 text-xs mt-4">
            MediaLens India • Free • Open Source
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense>
      <AnalyzeContent />
    </Suspense>
  );
}
