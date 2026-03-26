import { db } from "../config/db.js";

export const createservice= async (service)=>{
    const {username,description,userid,profilepicurl}=service;

    const sql=`INSERT INTO services (username,userid,description,profilepicurl)
    VALUES (?,?,?,?)`;
    const [results]= await db.execute(sql,[username,userid,description,profilepicurl]);
    return results;
    
};
export const getservicebyid=async (id)=>{
    const sql=`SELECT * FROM services WHERE id=?`;
    const [rows]= await db.execute(sql,[id]);
    return rows;
}