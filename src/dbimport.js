import fs from "fs";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const sql = fs.readFileSync("./config/schema.sql", "utf8");

await connection.query(sql);

console.log("Database imported successfully");
process.exit();