import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const filePath = "./documents/Employee_Handbook.pdf";

const data = new Uint8Array(fs.readFileSync(filePath));

const pdf = await pdfjsLib.getDocument({
  data
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

console.log("PDF berhasil dibaca");
console.log("Jumlah halaman:", pdf.numPages);
console.log("Jumlah karakter:", text.length);

console.log("\n=== ISI DOCUMENT ===\n");
console.log(text);