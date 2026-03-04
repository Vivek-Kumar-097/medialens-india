// app/api/test/route.js
export async function GET() {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'Say "Groq is working" only.' }],
          max_tokens: 20
        })
      }
    );
  
    const data = await response.json();
    return Response.json({
      message: data.choices[0].message.content,
      model: data.model
    });
  }