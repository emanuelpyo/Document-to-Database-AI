import "dotenv/config";
import { DataAPIClient } from "@datastax/astra-db-ts";

const client = new DataAPIClient(
  process.env.ASTRA_DB_TOKEN
);

const db = client.db(
  process.env.ASTRA_DB_ENDPOINT
);

const collection = db.collection("documents");

await collection.insertOne({
  title: "Docker",
  content: "Docker digunakan untuk menjalankan aplikasi dalam container."
});

console.log("Document berhasil disimpan");

const documents = await collection.find({}).toArray();

console.log(documents);