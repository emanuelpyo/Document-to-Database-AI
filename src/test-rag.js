import { rag } from "./rag.js";

const question = "Berapa hari WFO?";

console.log("Question:");
console.log(question);

try {
  const answer = await rag(question);

  console.log("\n=== AI ANSWER ===");
  console.log(answer);

} catch (error) {
  console.error("\nRAG ERROR:");
  console.error(error.message);
}