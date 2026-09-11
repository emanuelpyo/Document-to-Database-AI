import { generateSQL } from "./generate-sql.js";

const question = "Berapa karyawan yang bekerja di IT?";

console.log("Question:");
console.log(question);

try {
  const sql = await generateSQL(question);

  console.log("\n=== GENERATED SQL ===");
  console.log(sql);
} catch (error) {
  console.error("\nSQL Generation Error:");
  console.error(error);
}