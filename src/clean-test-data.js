import "dotenv/config";
import { DataAPIClient } from "@datastax/astra-db-ts";

const client = new DataAPIClient(
  process.env.ASTRA_DB_TOKEN
);

const db = client.db(
  process.env.ASTRA_DB_ENDPOINT
);

const collection = db.collection("ht_document");

const result = await collection.deleteMany({
  title: "Docker"
});

console.log("Data dummy Docker berhasil dihapus");
console.log(result);