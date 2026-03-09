import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function connectWithRetry(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true  // ✅ allow multiple statements
      });
      return connection;
    } catch (err) {
      console.log(`Connection failed, retrying in ${delay/1000}s... (${i+1}/${retries})`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error("Unable to connect to the database after multiple retries");
}

async function importDatabase() {
  try {
    const connection = await connectWithRetry();
    console.log("✅ Connected to the database");

    const folderPath = path.join(__dirname, "config", "schema.sql");
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".sql")).sort();

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      let sql = fs.readFileSync(filePath, "utf8");

      // Remove MySQL dump-specific comments that cause syntax errors
      sql = sql.replace(/\/\*![\s\S]*?\*\//g, "");

      await connection.query(sql);
      console.log(`✅ Imported ${file}`);
    }

    await connection.end();
    console.log("✅ All SQL files imported successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Failed to import database:", err.message);
    process.exit(1);
  }
}

importDatabase();