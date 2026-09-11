import "dotenv/config";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { splitText } from "./chunk-text.js";

// ========================================
// 1. Read PDF
// ========================================

const filePath = "./documents/Employee_Handbook.pdf";

const fileData = new Uint8Array(
  fs.readFileSync(filePath)
);

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

console.log("PDF berhasil dibaca");
console.log("Jumlah karakter:", text.length);


// ========================================
// 2. Split Text
// ========================================

const chunks = splitText(text, 1000, 200);

console.log("Jumlah chunks:", chunks.length);


// ========================================
// 3. Connect Astra
// ========================================

const client = new DataAPIClient(
  process.env.ASTRA_DB_TOKEN
);

const db = client.db(
  process.env.ASTRA_DB_ENDPOINT
);

const collection = db.collection("ht_document");

console.log("Astra DB connected");


// ========================================
// 4. Process setiap chunk
// ========================================

for (let i = 0; i < chunks.length; i++) {

  const chunk = chunks[i];

  console.log(`\nProcessing chunk ${i + 1}...`);


  // ------------------------------------
  // Create embedding
  // ------------------------------------

  const response = await fetch(
    "http://localhost:20128/v1/embeddings",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NINE_ROUTER_API_KEY}`
      },

      body: JSON.stringify({
        model: "gemini/gemini-embedding-001",
        input: chunk
      })
    }
  );


  const data = await response.json();


  if (!response.ok) {
    console.error("Embedding gagal:");
    console.error(data);
    process.exit(1);
  }


  const vector = data.data[0].embedding;


  console.log(
    "Vector dimension:",
    vector.length
  );


  // ------------------------------------
  // Store ke Astra
  // ------------------------------------

  const result = await collection.insertOne({

    document: "Employee_Handbook.pdf",

    chunk_index: i,

    content: chunk,

    $vector: vector

  });


  console.log(
    "Chunk berhasil disimpan:",
    result.insertedId
  );
}


console.log("\n================================");
console.log("Document ingestion selesai");
console.log("================================");