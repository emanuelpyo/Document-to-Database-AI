import "dotenv/config";

console.log("1. Program mulai");

const controller = new AbortController();

setTimeout(() => {
  console.log("TIMEOUT: 30 detik");
  controller.abort();
}, 30000);

console.log("2. Akan request ke: http://localhost:20128/v1/chat/completions");

try {
  const response = await fetch(
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
            content: "Jawab singkat: apa itu Docker?"
          }
        ],
        stream: false
      }),
      signal: controller.signal
    }
  );

  console.log("3. Request selesai");
  console.log("HTTP Status:", response.status);

  const text = await response.text();

  console.log("4. Response:");
  console.log(text);

} catch (error) {
  console.log("ERROR:");
  console.log(error.name);
  console.log(error.message);
}