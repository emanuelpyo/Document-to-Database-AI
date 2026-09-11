import { generateSQL } from "./generate-sql.js";
import { executeQuery } from "./execute-query.js";

const question = "Berapa karyawan yang bekerja di IT?";

console.log("Question:");
console.log(question);

let sql;

try {
  sql = await generateSQL(question);
} catch (error) {
  console.error("\nSQL Generation Error:");
  console.error(error.message);
  process.exit(1);
}

console.log("\n=== GENERATED SQL ===");
console.log(sql);

const isReadOnly = sql.trim().toUpperCase().startsWith("SELECT");

if (!isReadOnly) {
  console.error("\nValidation FAILED: SQL is not a SELECT statement. Execution aborted.");
  process.exit(1);
}

console.log("\nValidation PASSED: SQL is read-only.");

let rows;

try {
  rows = await executeQuery(sql);
} catch (error) {
  console.error("\nQuery Execution Error:");
  console.error(error.message);
  process.exit(1);
}

console.log("\n=== QUERY RESULT ===");
console.log(rows);

process.exit(0);
