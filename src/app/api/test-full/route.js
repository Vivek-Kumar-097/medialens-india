// app/api/test-full/route.js

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') || 'Modi';
  
    // Step 1: Fetch headlines
    const headlinesRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/headlines?topic=${topic}`
    );
    const { headlines } = await headlinesRes.json();
  
    console.log(`Got ${headlines.length} sources for topic: ${topic}`);
  
    // Step 2: Analyze with Groq
    const analysisRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/analyze`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headlines, topic })
      }
    );
  
    const analysis = await analysisRes.json();
  
    return Response.json(analysis);
  }