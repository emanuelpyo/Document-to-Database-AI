import express from "express";
import { rag } from "./rag.js";

const app = express();

app.use(express.json());

app.post("/ask", async (req, res) => {

  console.log("\nRequest masuk ke /ask");
  console.log("Question:", req.body.question);

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: "Question wajib diisi."
    });
  }

  try {

    console.log("Menjalankan RAG...");

    const answer = await rag(question);

    console.log("RAG selesai");

    res.json({
      question,
      answer
    });

  } catch (error) {

    console.error("RAG Error:", error);

    res.status(500).json({
      error: error.massage
    });

  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
