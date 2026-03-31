import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
fs.writeFileSync('C:/Users/kdnelson/Downloads/Krown_Academy_Complete_Package/pdf_debug.json', JSON.stringify(Object.keys(pdfParse), null, 2));
