import { db } from "../config/db.js";

export const addtocart=async (user_id,listings_id,quantity)=>{
    const sql=`INSERT INTO cart(user_id,listings_id,quantity)
    VALUES(?,?,?)
    ON DUPLICATE KEY UPDATE quantity=quantity + VALUES(quantity)`;
    return db.execute(sql,[user_id,listings_id,quantity]);    
};

export const getcartbyuserid=async (user_id)=>{
    const sql=`SELECT c.id, c.user_id,c.quantity,l.title AS name,l.price AS price,l.image AS image
    FROM cart c
    JOIN listings l ON c.listings_id=l.id
    WHERE c.user_id=?`;
    const [rows]= await db.execute(sql,[user_id]);
    return rows;
};
export const deletecart=async (id)=>{
    const sql=`DELETE FROM cart WHERE id=?`;
    return db.execute(sql,[id]);
};