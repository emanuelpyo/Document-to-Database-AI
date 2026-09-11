import "dotenv/config";

const NINE_ROUTER_URL = "http://localhost:20128/v1/chat/completions";

const MODELS = [
  "gemini/gemini-3.7-flash",
  "gemini/gemini-3.6-flash",
  "gemini/gemini-3.5-flash-lite"
];

export async function generateSQL(question) {
  const schema = `
Table: employees

Columns:
- id: SERIAL PRIMARY KEY
- name: VARCHAR(100)
- email: VARCHAR(150)
- department: VARCHAR(100)
- salary: NUMERIC(12,2)
`;

  const prompt = `
You are a PostgreSQL SQL generator.

Your task is to convert the user's question into a PostgreSQL SQL query.

Database schema:
${schema}

Rules:
- Return ONLY the SQL query.
- Do not use markdown.
- Do not explain the query.
- Only use tables and columns that exist in the schema.
- Generate a valid PostgreSQL query.

User question:
${question}
`;

  let lastError;

  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);

      const response = await fetch(NINE_ROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NINE_ROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.log(
          `Model ${model} failed: ${response.status}`
        );

        lastError = new Error(
          `${model}: ${response.status} ${errorText}`
        );

        continue;
      }

      const data = await response.json();

      const sql = data?.choices?.[0]?.message?.content?.trim();

      if (!sql) {
        throw new Error(`Model ${model} returned empty SQL`);
      }

      console.log(`Model berhasil: ${model}`);

      return sql;

    } catch (error) {
      console.log(`Model ${model} error`);
      lastError = error;
    }
  }

  throw new Error(
    `Semua model gagal.\n${lastError?.message || "Unknown error"}`
  );
}