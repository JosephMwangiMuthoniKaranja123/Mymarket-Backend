// src/alterColumn.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function alterImageUrlColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const tableName = "listings_images"; 
    const sql = `
      ALTER TABLE ${tableName}
      MODIFY COLUMN image_url VARCHAR(1000) NOT NULL;
    `;

    await connection.execute(sql);
    console.log(`✅ Column 'image_url' in table '${tableName}' successfully altered to VARCHAR(1000).`);
  } catch (err) {
    console.error("❌ Failed to alter column:", err);
  } finally {
    await connection.end();
  }
}

// Run the script
alterImageUrlColumn();