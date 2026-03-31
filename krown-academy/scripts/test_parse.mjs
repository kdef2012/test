import fs from 'fs';
import pdfParse from 'pdf-parse';
const buf = fs.readFileSync("C:/Users/kdnelson/Downloads/Krown_Academy_Complete_Package/krown-academy-nextjs/krown-academy/curriculum_pacing_guides/NC 8th Grade Math Unpacking Rev June 2022 (2).pdf");
try {
  const data = await pdfParse(buf);
  console.log("SUCCESS:", data.text.substring(0, 100));
} catch (e) {
  console.error("FAIL:", e);
}
