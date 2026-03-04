// The problem — points might be undefined or empty array
// Add a guard:

export default function ConsensusBox({ points, keyDifference }) {
  if (!points?.length && !keyDifference) return null;

  return (
    <div className="mb-6 space-y-3">
      {points?.length > 0 && (
        <div className="bg-green-950/50 border border-green-900/50 rounded-2xl p-5">
          <h2 className="text-green-400 font-semibold mb-3">
            ✅ What All Sources Agree On
          </h2>
          <ul className="space-y-2">
            {points.map((point, i) => (
              <li key={i} className="flex gap-3 text-green-100 text-sm">
                <span className="text-green-500 font-bold shrink-0">{i + 1}.</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {keyDifference && (
        <div className="bg-orange-950/50 border border-orange-900/50 rounded-2xl p-5">
          <h2 className="text-orange-400 font-semibold mb-2">
            ⚡ Biggest Framing Difference
          </h2>
          <p className="text-orange-100 text-sm">{keyDifference}</p>
        </div>
      )}
    </div>
  );
}