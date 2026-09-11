import { testPostgres } from "./postgres.js";

try {
  await testPostgres();
} catch (error) {
  console.error("PostgreSQL Error:");
  console.error(error);
}