import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function connect() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
}

async function importSQLFiles() {
  const connection = await connect();
  const folderPath = path.join(__dirname, "config", "schema.sql");
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".sql")).sort();

  for (const file of files) {
    let sql = fs.readFileSync(path.join(folderPath, file), "utf8");

    // 1️⃣ Remove MySQL dump version comments
    sql = sql.replace(/\/\*![\s\S]*?\*\//g, "");

    // 2️⃣ Remove -- comments
    sql = sql.replace(/^--.*$/gm, "");

    // 3️⃣ Split statements and execute individually
    const statements = sql
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length);

    for (const stmt of statements) {
      await connection.query(stmt);
    }

    console.log(`✅ Imported ${file}`);
  }

  await connection.end();
  console.log("✅ All SQL files imported successfully");
}

importSQLFiles();