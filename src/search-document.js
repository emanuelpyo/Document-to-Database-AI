import "dotenv/config";
import { DataAPIClient } from "@datastax/astra-db-ts";

const question = "Berapa jam kerja karyawan?";

console.log("Pertanyaan:");
console.log(question);

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
      input: question
    })
  }
);


const data = await response.json();


if (!response.ok) {
  console.error("Embedding pertanyaan gagal:");
  console.error(data);
  process.exit(1);
}


const queryVector = data.data[0].embedding;

console.log("\nQuery vector dimension:");
console.log(queryVector.length);

const client = new DataAPIClient(
  process.env.ASTRA_DB_TOKEN
);

const db = client.db(
  process.env.ASTRA_DB_ENDPOINT
);

const collection = db.collection("ht_document");

console.log("\nAstra DB connected");

const cursor = collection.find(
  {},

  {
    sort: {
      $vector: queryVector
    },

    limit: 3,

    includeSimilarity: true
  }
);


const results = await cursor.toArray();

console.log("\n=== SEARCH RESULTS ===");

results.forEach((result, index) => {

  console.log(`\nResult ${index + 1}`);

  console.log("Similarity:", result.$similarity);

  console.log("Document:", result.document);

  console.log("Chunk index:", result.chunk_index);

  console.log("Content:");
  console.log(result.content);
});
