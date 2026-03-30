import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { grade_level, target_standard, question_type, difficulty, count = 3 } = body;

    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_GENAI_API_KEY is not configured in the server environment (.env.local)." }, { status: 500 });
    }

    const prompt = `
      You are an expert Math and ELA test creator for ${grade_level} grade level.
      Create ${count} highly accurate, standards-aligned questions for the standard code: ${target_standard}.
      Question Type: ${question_type}
      Difficulty: ${difficulty}
      
      Return your response STRICTLY as a raw JSON array matching this exact schema:
      [
        {
          "question_text": "The actual question text here. (No markdown outside the JSON)",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correct_answer": "The exact string of the correct option",
          "difficulty": "${difficulty}",
          "question_type": "${question_type}"
        }
      ]
      Do NOT include any markdown code block formatting like \`\`\`json. Just return the raw array.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash-preview:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
       console.error("Gemini API Error:", data.error);
       return NextResponse.json({ error: `Gemini Error: ${data.error.message || "Quota limit hit"}` }, { status: 500 });
    }

    let generatedText = data.candidates[0]?.content?.parts[0]?.text || "[]";
    
    // Safety sanitization to remove any markdown block formatting Gemini might accidentally include
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

    const questions = JSON.parse(generatedText);
    return NextResponse.json({ questions });

  } catch (err) {
    console.error("Generate Ticket Error:", err);
    return NextResponse.json({ error: "An unexpected server error occurred while contacting the Gemini AI engine." }, { status: 500 });
  }
}
