import "dotenv/config";
import { DataAPIClient } from "@datastax/astra-db-ts";

// ========================================
// RAG FUNCTION
// ========================================

export async function rag(question) {

  // ========================================
  // 1. Embedding Question
  // ========================================

  const embeddingResponse = await fetch(
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

  const embeddingData = await embeddingResponse.json();

  if (!embeddingResponse.ok) {
    throw new Error(
      `Embedding gagal: ${JSON.stringify(embeddingData)}`
    );
  }

  const queryVector = embeddingData.data[0].embedding;


  // ========================================
  // 2. Connect Astra
  // ========================================

  const client = new DataAPIClient(
    process.env.ASTRA_DB_TOKEN
  );

  const db = client.db(
    process.env.ASTRA_DB_ENDPOINT
  );

  const collection = db.collection("ht_document");


  // ========================================
  // 3. Vector Search
  // ========================================

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


  // ========================================
  // 4. Ambil Context
  // ========================================

  if (results.length === 0) {
    return "Informasi tersebut tidak ditemukan dalam dokumen.";
  }

  const context = results
    .map((result) => result.content)
    .join("\n\n");


  // ========================================
  // 5. Buat Prompt RAG
  // ========================================

  const prompt = `
Kamu adalah AI assistant untuk menjawab pertanyaan berdasarkan dokumen perusahaan.

Gunakan HANYA informasi yang terdapat pada CONTEXT.

Jika jawaban tidak ditemukan dalam CONTEXT, katakan bahwa informasi tersebut tidak ditemukan dalam dokumen.

CONTEXT:
${context}

QUESTION:
${question}

Jawab dengan singkat dan jelas dalam bahasa Indonesia.
`;


  // ========================================
  // 6. Kirim ke Gemini melalui 9Router
  // ========================================

  const chatResponse = await fetch(
    "http://localhost:20128/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NINE_ROUTER_API_KEY}`
      },

      body: JSON.stringify({
        model: "gemini/gemini-3.7-flash",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.2,
        stream: false
      })
    }
  );

  const chatData = await chatResponse.json();

  if (!chatResponse.ok) {
    throw new Error(
      `Gemini gagal: ${JSON.stringify(chatData)}`
    );
  }


  // ========================================
  // 7. Return Answer
  // ========================================

  return chatData.choices[0].message.content;
}