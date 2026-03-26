import { db } from "../config/db.js";

export const createservice= async (service)=>{
    const {description,userid,profilepicurl}=service;

    const sql=`INSERT INTO services (userid,description,profilepicurl)
    VALUES (?,?,?)`;
    const [results]= await db.execute(sql,[userid,description,profilepicurl]);
    return results;
    
};
export const getservicebyid=async (id)=>{
    const sql=`SELECT 
    s.id,u.username AS name,s.description,s.profilepicurl,s.usersid
    FROM services s
    JOIN users u ON s.usersid=u.id
     WHERE s.id=?`;
    const [rows]= await db.execute(sql,[id]);
    return rows;
};
export const deleteservice= async (id)=>{
    const sql=` DELETE FROM services WHERE id=?`;
    const [result]= db.execute(sql,[id]);
    return result;
};
export const updateservice=async (service)=>{
    const {description,userid,profilepicurl,id}=service;
    const sql= `UPDATE services 
    SET userid=?, description=?,profilepicurl=?
    WHERE id=?`;
    const [results]=db.execute(sql,[userid,description,profilepicurl,id]);
    return results;
};