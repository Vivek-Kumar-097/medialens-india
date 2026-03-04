// components/SourceCard.jsx
export default function SourceCard({ source }) {
    const score = source.overall_bias_score;
  
    const scoreColor =
      score < 30 ? 'text-green-400' :
      score < 55 ? 'text-yellow-400' : 'text-red-400';
  
    const barColor =
      score < 30 ? '#10B981' :
      score < 55 ? '#F59E0B' : '#EF4444';
  
    const scoreLabel =
      score < 30 ? 'Low Bias' :
      score < 55 ? 'Moderate' : 'High Bias';
  
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
  
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{source.country}</span>
              <h3 className="text-white font-bold">{source.name}</h3>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">
              {source.ownership} • {source.political_lean}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${scoreColor}`}>
              {score}
            </div>
            <div className={`text-xs ${scoreColor}`}>{scoreLabel}</div>
          </div>
        </div>
  
        {/* Bias bar */}
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${score}%`, backgroundColor: barColor }}
          />
        </div>
  
        {/* Top headline */}
        <div className="bg-gray-800 rounded-xl p-3 mb-4">
          <p className="text-gray-400 text-xs mb-1">Top Headline</p>
          <p className="text-white text-sm">"{source.top_headline}"</p>
        </div>
  
        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-800 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-1">Sentiment</p>
            <p className="text-white text-sm">{source.political_lean}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-1">Confidence</p>
            <p className="text-white text-sm">
              {source.dimensions?.factual_density || 'N/A'}% factual
            </p>
          </div>
        </div>
  
        {/* Loaded words */}
        {source.loaded_words?.length > 0 && (
          <div className="mb-3">
            <p className="text-gray-400 text-xs mb-2">⚠️ Loaded Language</p>
            <div className="flex flex-wrap gap-2">
              {source.loaded_words.map((word, i) => (
                <span key={i}
                  className="bg-red-900/40 text-red-300 text-xs px-2 py-1 rounded-full border border-red-900/50">
                  "{word}"
                </span>
              ))}
            </div>
          </div>
        )}
  
        {/* Missing context */}
        {source.missing_context && (
          <div className="mb-3">
            <p className="text-gray-400 text-xs mb-1">🕳️ Missing Context</p>
            <p className="text-gray-300 text-sm">{source.missing_context}</p>
          </div>
        )}
  
        {/* Verdict */}
        <div className="pt-3 border-t border-gray-800">
          <p className="text-gray-400 text-sm italic">
            "{source.one_line_verdict}"
          </p>
        </div>
  
      </div>
    );
  }