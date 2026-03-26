// src/alterColumn.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function alterTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
  const sql=`ALTER TABLE services
  DROP column username`;
  
  await connection.execute(sql);
    console.log("table altered");
  } catch (err) {
    console.error("❌ Failed to alter table:",err);
  } finally {
    await connection.end();
  }
}

// Run the script
alterTable();