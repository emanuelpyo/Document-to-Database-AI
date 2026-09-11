import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { splitText } from "./chunk-text.js";

const filePath = "./documents/Employee_Handbook.pdf";

// Read PDF
const fileData = new Uint8Array(fs.readFileSync(filePath));

const pdf = await pdfjsLib.getDocument({
  data: fileData
}).promise;

let text = "";

for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();

  const pageText = content.items
    .map((item) => item.str)
    .join(" ");

  text += pageText + "\n";
}

// Split Text
const chunks = splitText(text, 1000, 200);

console.log("Document berhasil dibaca");
console.log("Jumlah karakter:", text.length);
console.log("Jumlah chunks:", chunks.length);

chunks.forEach((chunk, index) => {
  console.log(`\n=== CHUNK ${index + 1} ===`);
  console.log(chunk);
});