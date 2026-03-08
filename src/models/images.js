import { db } from "../config/db.js";

export const saveimages= async(image)=>{
    const{listings_id,image_url,is_primary}=image;
    const sql=`INSERT INTO listing_images (listings_id,image_url,is_primary)
    VALUES(?,?,?)`;
    return db.execute(sql,[listings_id,image_url,is_primary]);
};
export const getimages=async(listings_id)=>{
    const sql=`SELECT * FROM listing_images WHERE listings_id=?`;
    const [rows]=await db.execute(sql,[listings_id]);
    return rows;
};