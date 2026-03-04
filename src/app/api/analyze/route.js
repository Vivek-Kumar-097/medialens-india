// app/api/analyze/route.js

export async function POST(request) {
  const { headlines, topic } = await request.json();

  if (!headlines?.length) {
    return Response.json({ error: "No headlines provided" }, { status: 400 });
  }

  // Build text block for each source
  const sourcesText = headlines
  .map(
    (h) =>
      `SOURCE_ID: ${h.source.id}
SOURCE_NAME: ${h.source.name}
COUNTRY: ${h.source.country}
OWNERSHIP: ${h.source.ownership}
KNOWN_BIAS: ${h.source.bias_label}
ARTICLES:
${h.articles
  .map(
    (a, i) =>
      `  ${i + 1}. HEADLINE: "${a.title}"
     DESCRIPTION: "${a.description || "No description"}"`
  )
  .join("\n")}`
  )
  .join("\n\n---\n\n");

  const prompt = `You are a neutral Indian media analyst with deep knowledge of Indian politics and journalism.
  
  Analyze these Indian news source headlines about the topic: "${topic}"
  
  ${sourcesText}
  
  Return ONLY valid JSON. No explanation. No markdown. Just the JSON object.
  
  {
    "topic": "${topic}",
    "summary": "2 sentence overview of how Indian media is covering this topic",
    "consensus": [
      "one fact all sources agree on",
      "another fact all sources agree on",
      "a third agreed fact"
    ],
    "key_difference": "The single biggest framing difference between sources in one sentence",
    "sources": [
      {
        "id": "MUST be the exact SOURCE_ID value from the input above",
        "name": "source name",
        "country": "🇮🇳",
        "ownership": "owner name",
        "dimensions": {
          "emotional_intensity": 45,
          "attribution_bias": 60,
          "humanitarian_framing": 30,
          "national_framing": 70,
          "factual_density": 65
        },
        "overall_bias_score": 55,
        "political_lean": "Pro-BJP or Pro-Opposition or Centre or Neutral",
        "top_headline": "paste their most representative headline here",
        "loaded_words": ["word1", "word2", "word3"],
        "missing_context": "what important context this outlet left out",
        "one_line_verdict": "plain English one sentence verdict on this outlet's coverage"
      }
    ],
    "most_neutral": "id of most neutral source",
    "most_biased": "id of most biased source",
    "confidence_score": 75
  }
  
  Scoring rules:
  - overall_bias_score: 0-20 = very neutral, 21-40 = mild bias, 41-60 = noticeable, 61-80 = strong, 81-100 = extreme
  - emotional_intensity: how charged/emotional the language is
  - attribution_bias: how much blame/credit is assigned to one side
  - humanitarian_framing: focus on human suffering and impact
  - national_framing: patriotic or nationalist language
  - factual_density: how much concrete facts vs opinion
  - confidence_score: your confidence in this analysis based on how much content you had to work with
  
  Be specific. "Uses word 'regime'" is good. "Shows bias" is useless.
  Stay strictly neutral yourself. Analyze language only.`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          max_tokens: 3000,
          response_format: { type: "json_object" },
        }),
      }
    );

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      console.error("Groq response:", JSON.stringify(data));
      return Response.json(
        { error: "Groq returned empty response", raw: data },
        { status: 500 }
      );
    }

    const text = data.choices[0].message.content;

    const result = JSON.parse(text);

    // Attach colors back (Groq doesn't know colors)
    // Match by name instead of id (Groq returns name not id)
    result.sources = result.sources.map((s) => {
      const original = headlines.find(
        (h) =>
          h.source.name.toLowerCase() === s.name.toLowerCase() ||
          h.source.id.toLowerCase() === s.id?.toLowerCase()
      );
      return {
        ...s,
        id: original?.source.id || s.id, // fix id
        color: original?.source.color || "#6B7280", // fix color
        country: "🇮🇳", // fix flag
      };
    });

    return Response.json(result);
  } catch (err) {
    console.error("Analyze error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
