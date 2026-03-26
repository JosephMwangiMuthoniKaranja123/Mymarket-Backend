// src/alterColumn.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function addTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
  const sql=`CREATE TABLE services (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
   username VARCHAR(50),
 userid INT,
description VARCHAR(200),
profilepicurl VARCHAR(200),
FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
 )`;

    await connection.execute(sql);
    console.log("table altered");
  } catch (err) {
    console.error("❌ Failed to alter table:",err);
  } finally {
    await connection.end();
  }
}

// Run the script
addTable();