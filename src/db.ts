import { promises as fs } from "fs";
import { Client } from "pg";

async function getDbClient(dbUrl: string) {
  const client = new Client(dbUrl);
  await client.connect();
  return client;
}

async function runSqlFile(db: Client, filePath: string) {
  const sqlBuffer = await fs.readFile(filePath);
  const sqlContents = sqlBuffer.toString();
  return await db.query(sqlContents);
}

export { getDbClient, runSqlFile };
