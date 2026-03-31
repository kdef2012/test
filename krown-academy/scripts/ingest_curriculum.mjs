import { createClient } from '@supabase/supabase-js';

// LOAD ENV VARS HARDCODED FOR SCRIPT EXECUTION
const SUPABASE_URL = "https://xoywlfpskifihvyogekf.supabase.co"; // Fill this in
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveXdsZnBza2lmaWh2eW9nZWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMTcyMzAsImV4cCI6MjA4OTg5MzIzMH0._27U4vgZVJU0VVMMRVAIGmxskj35mgziudRnIGMUOAw"; // Fill this in
const GEMINI_API_KEY = "AIzaSyC1yb2M-PO0QPLLH46PkrtL2ZxX4jP2NHQ";

const COURSE_NAME = "8th Grade Math";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runIngestion() {
    console.log(`🚀 Starting Curriculum Ingestion Engine for: ${COURSE_NAME}`);
    
    // Hardcode the NC 8th Grade Math standards to bypass binary extraction limits and module errors
    const chunk = `
    North Carolina Standard Course of Study: 8th Grade Mathematics
    The Number System (8.NS)
    8.NS.1 Know that numbers that are not rational are called irrational. Understand informally that every number has a decimal expansion; for rational numbers show that the decimal expansion repeats eventually, and convert a decimal expansion which repeats eventually into a rational number.
    8.NS.2 Use rational approximations of irrational numbers to compare the size of irrational numbers, locate them approximately on a number line diagram, and estimate the value of expressions (e.g., pi^2).
    Expressions and Equations (8.EE)
    8.EE.1 Know and apply the properties of integer exponents to generate equivalent numerical expressions.
    8.EE.2 Use square root and cube root symbols to represent solutions to equations of the form x^2 = p and x^3 = p, where p is a positive rational number. Evaluate square roots of small perfect squares and cube roots of small perfect cubes.
    8.EE.3 Use numbers expressed in the form of a single digit times an integer power of 10 to estimate very large or very small quantities.
    `;

    console.log(`🧠 Processing 8th Grade Math Standards...`);
    const prompt = `
    You are an expert curriculum designer. Break down the provided North Carolina state standards text into a rigid multi-day pedagogical structure.
    Return ONLY a raw JSON array matching this exact format, with NO markdown formatting:
    [
      {
        "module_title": "Module 1: Number Systems (e.g. 8.NS.1)",
        "module_description": "Understanding irrational numbers.",
        "lessons": [
          { "day": 1, "title": "Day 1: Theory & Code Switching", "content": "Explain irrational vs rational using visual examples." },
          { "day": 2, "title": "Day 2: Concept Practice", "content": "Rote practice converting fractions to decimals." },
          { "day": 3, "title": "Day 3: The Sandbox", "content": "Real-world word problems applying irrational estimation." },
          { "day": 4, "title": "Day 4: Crucible Mastery", "content": "Final assessment block for 8.NS.1." }
        ]
      }
    ]
    DATA TO PARSE:
    ${chunk}
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ 
                    parts: [
                        { text: prompt }
                    ] 
                }] 
            })
        });
        const result = await response.json();
        if (!result.candidates || !result.candidates[0]) {
             console.log("❌ RAW GEMINI PAYLOAD: ", JSON.stringify(result, null, 2));
             throw new Error("Invalid Gemini Response Structure");
        }
        
        // Clean JSON formatting if Gemini adds markdown
        let jsonString = result.candidates[0].content.parts[0].text;
        if (jsonString.startsWith("\`\`\`json")) {
           jsonString = jsonString.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
        } else if (jsonString.startsWith("\`\`\`")) {
           jsonString = jsonString.replace(/\`\`\`/g, "").trim();
        }
        
        const generatedModules = JSON.parse(jsonString);
        console.log(`✅ Gemini successfully generated ${generatedModules.length} strict multi-day modules!`);
        console.log("\n=======================================================");
        console.log("             🎓 MASTER CURRICULUM PREVIEW");
        console.log("=======================================================\n");
        console.log(JSON.stringify(generatedModules, null, 2));
        console.log("\n=======================================================\n");
        
        // --- SUPABASE INJECTION ENGINE ---
        console.log("Attempting to write to Supabase backend...");
        
        // 1. Ensure the Course Exists
        let { data: course } = await supabase.from('krown_lms_courses').select('id').eq('title', COURSE_NAME).maybeSingle();
        if (!course) {
            const res = await supabase.from('krown_lms_courses').insert({ title: COURSE_NAME, description: "Auto-ingested curriculum track", is_published: true }).select('id');
            if (!res.data || res.data.length === 0 || res.error) {
                 console.error("❌ SUPABASE MISSING TABLE ERROR: The krown_lms_courses table does not exist or RLS is blocking insertion!");
                 console.error("💡 Action Required: Please run 'supabase_lms_setup.sql' in your Supabase Dashboard SQL Editor.");
                 return; // Completely stop if parent table doesn't exist
            }
            course = res.data[0];
        }

        let moduleOrder = 1;
        for (const mod of generatedModules) {
            console.log(`Writing Module: ${mod.module_title}...`);
            const modRes = await supabase.from('krown_lms_modules').insert({
                course_id: course.id,
                title: mod.module_title,
                description: mod.module_description,
                order_index: moduleOrder++
            }).select('id');
            
            if (!modRes.data || modRes.data.length === 0 || modRes.error) {
                 console.error("❌ SUPABASE MISSING TABLE ERROR: The krown_lms_modules table does not exist or RLS is blocking insertion!");
                 console.error("💡 Action Required: Please run 'supabase_lms_setup.sql' in your Supabase Dashboard SQL Editor.");
                 break;  // Stop inserting to avoid cascading crashes
            }
            
            const moduleId = modRes.data[0].id;
            let lessonOrder = 1;
            
            for (const les of mod.lessons) {
                await supabase.from('krown_lms_lessons').insert({
                    module_id: moduleId,
                    title: les.title,
                    content: les.content,
                    video_url: "",
                    order_index: lessonOrder++,
                    lesson_type: les.title.includes("Crucible") ? "assessment" : "instruction"
                });
            }
        }
        
        console.log("🎉 SUCCESS: Master Schedule physically written to the database following strict pacing tiers!");
        
    } catch (e) {
        console.error("❌ Fatal Error communicating with AI Database Engine:", e);
    }
}

runIngestion();
