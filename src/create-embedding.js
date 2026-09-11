import "dotenv/config";

const text = `
Employee Handbook - PT Maju Jaya Digital
Visi Perusahaan
Menjadi perusahaan teknologi terdepan di Asia Tenggara yang berfokus pada inovasi, kolaborasi, dan keberlanjutan.

Jam Kerja
Senin - Jumat, pukul 09.00 - 18.00 WIB
Istirahat 1 jam (fleksibel antara 12.00 - 14.00)
Sistem hybrid: 3 hari WFO, 2 hari WFH

Budaya Kerja
Kolaboratif dan terbuka terhadap ide baru
Berorientasi pada hasil dan solusi
Mengutamakan integritas dan profesionalisme
Work-life balance sebagai prioritas
`;

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
  console.error("Embedding gagal:");
  console.error(data);
  process.exit(1);
}

const vector = data.data[0].embedding;

console.log("Embedding berhasil");
console.log("Model:", data.model);
console.log("Vector dimension:", vector.length);

console.log("\n5 angka pertama:");
console.log(vector.slice(0, 5));