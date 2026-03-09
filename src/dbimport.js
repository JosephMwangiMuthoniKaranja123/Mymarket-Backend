// import-db.js
import fs from "fs";
import mysql from "mysql2/promise";

async function importDatabase() {
  try {
    // Create connection using Railway variables
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      port: Number(process.env.MYSQLPORT),  // Convert string to number
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE
    });

    console.log("✅ Connected to the database");

    // Read your SQL file
    let sql = fs.readFileSync("./config/schema.sql", "utf8");

    // Make tables creation safe: ignore if they already exist
    sql = sql.replace(/CREATE TABLE (\w+)/gi, "CREATE TABLE IF NOT EXISTS $1");

    // Execute the SQL commands
    await connection.query(sql);

    console.log("✅ Database imported successfully");

    await connection.end();
    process.exit();
  } catch (err) {
    console.error("❌ Failed to import database:", err.message);
    process.exit(1);
  }
}

// Run the import
importDatabase();