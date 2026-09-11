import "dotenv/config";

const response = await fetch("http://localhost:20128/v1/embeddings", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.NINE_ROUTER_API_KEY}`
  },
  body: JSON.stringify({
    model: "gemini/gemini-embedding-001",
    input: "Docker digunakan untuk menjalankan aplikasi dalam container."
  })
});

const data = await response.json();

console.log(JSON.stringify(data, null, 2));

if (data.data?.[0]?.embedding) {
  console.log("Embedding dimension:", data.data[0].embedding.length);
}