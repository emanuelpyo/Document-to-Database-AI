import { executeQuery } from "./execute-query.js";

const sql = `
  SELECT *
  FROM employees;
`;

try {
  const result = await executeQuery(sql);

  console.log("Query berhasil");
  console.log(result);
} catch (error) {
  console.error("Query Error:");
  console.error(error);
}