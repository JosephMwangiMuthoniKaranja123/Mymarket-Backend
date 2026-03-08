import {db} from "../config/db.js";
import bcrypt, { hash } from "bcryptjs";

export const createuser=async (user)=>{
    const{username,email,password}=user;
    const hashedpassword= await bcrypt.hash(password,5);
    const sql=`INSERT INTO users(username,email,password)
    VALUES(?,?,?)`;
 return db.execute(sql,[username,email,hashedpassword]);
};
 export const returnusers=async (email)=>{
    const sql=`SELECT *FROM users WHERE email=?`;
    const [rows]= await db.execute(sql,[email]);
    return rows[0];
 };