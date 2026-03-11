// src/dbimport.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // load .env

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MySQL
async function connect() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });
}

async function importSQLFiles() {
  const connection = await connect();

  try {
    // Temporarily disable foreign key checks
    await connection.query("SET FOREIGN_KEY_CHECKS=0;");

    const folderPath = path.join(__dirname, "database","schema.sql");

    // Check folder exists
    if (!fs.existsSync(folderPath)) {
      console.error("❌ Database folder not found:", folderPath);
      process.exit(1);
    }

    // Read only .sql files (ignore directories)
    let files = fs
      .readdirSync(folderPath)
      .filter(
        (f) =>
          f.endsWith(".sql") &&
          fs.lstatSync(path.join(folderPath, f)).isFile()
      )
      .sort();

    // Optional: reverse order if needed for dependent tables
    files = files.reverse();

    for (const file of files) {
      console.log(`📂 Importing ${file}...`);
      let sql = fs.readFileSync(path.join(folderPath, file), "utf8");

      // Remove versioned MySQL comments (/*! ... */)
      sql = sql.replace(/\/\*![\s\S]*?\*\//g, "");

      // Remove -- line comments
      sql = sql.replace(/^--.*$/gm, "");

      // Split statements by semicolon and execute individually
      const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length);

      for (const stmt of statements) {
        await connection.execute(stmt); // use execute instead of query for safety
      }

      console.log(`✅ Imported ${file}`);
         
    }

    // Re-enable foreign key checks
    await connection.query("SET FOREIGN_KEY_CHECKS=1;");
    console.log("🎉 All SQL files imported successfully!");
    const [rows] = await connection.execute("SELECT DATABASE() AS db_name;");
    console.log("Currently connected to database:", rows[0].db_name);
    const [tables] = await connection.execute("SHOW TABLES;");
console.log("Tables in this database:", tables);
  } catch (err) {
    console.error("❌ Failed to import database:", err);
  } finally {
    await connection.end();
  }
}

// Run the import
importSQLFiles();