import "dotenv/config";
import { DataAPIClient } from "@datastax/astra-db-ts";

const client = new DataAPIClient(process.env.ASTRA_DB_TOKEN);
const db = client.db(process.env.ASTRA_DB_ENDPOINT);

const collection = db.collection("ht_document");

const text = "Docker digunakan untuk menjalankan aplikasi dalam container.";

// 1. Generate embedding lewat 9Router
const response = await fetch("http://localhost:20128/v1/embeddings", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.NINE_ROUTER_API_KEY}`
  },
  body: JSON.stringify({
    model: "gemini/gemini-embedding-001",
    input: text
  })
});

const data = await response.json();

if (!response.ok) {
  console.error(data);
  process.exit(1);
}

const vector = data.data[0].embedding;

console.log("Embedding dimension:", vector.length);

// 2. Simpan document + vector ke Astra
const result = await collection.insertOne({
  title: "Docker",
  content: text,
  $vector: vector
});

console.log("Document berhasil disimpan:");
console.log(result);