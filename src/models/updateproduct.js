import { db } from "../config/db.js";

export const updateproduct=async (product)=>{
    const {listings_id,title,price,description,image,category_id}=product;
    const sql =`UPDATE listings
    SET   title=?, price=? ,description=?,image=?,category_id=? WHERE id=?`;
    const [result]= await db.execute(sql,[title,price,description,image,category_id,listings_id]);
    return result;
};
export const getproductbyid= async (productid)=>{
    const listings_id=productid;
    const sql=`SELECT * FROM listings WHERE id=?`;
    const [rows]= await db.execute(sql,[listings_id]);
    return rows;
};
export const deleteproduct= async (productid)=>{
    const listings_id=productid;
    const sql=`DELETE FROM listings WHERE id=?`;
    const result= await db.execute(sql,[listings_id]);
    return result;
};
