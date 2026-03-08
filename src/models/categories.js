import { db } from "../config/db.js";

export const getcategories=async ()=>{
    const sql=`SELECT * FROM categories `;
    const [rows]= await db.execute(sql);
    return rows;
};
