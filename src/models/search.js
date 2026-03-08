import { db } from "../config/db.js";

export const search= async (query)=>{
    const sql=`SELECT * FROM listings
    WHERE title LIKE ? OR description LIKE ?`;
    const searchitem= `%${query}%`;

    const [rows]= await db.execute(sql,[searchitem,searchitem]);
    return rows;

} ;