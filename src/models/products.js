import {db} from "../config/db.js";

export const createproduct = async (connection,product)=>{
   const {title,price,seller_id,description,primaryimage,category_id,stock}=product;

   const sql= `INSERT INTO listings(seller_id,title,description,price,stock,image,category_id)
   VALUES (?, ?, ?,?,?,?,?)`;
   const [result] = await connection.execute(sql,[seller_id,title,description,price,stock,primaryimage,category_id]);
   return result;
};


export const getallproducts= async ()=>{
    const sql= `SELECT l.id,l.title,l.price,l.image , u.username AS seller


    FROM listings l
    JOIN users u ON l.seller_id=u.id
   `;
    
    const [rows]=await db.execute(sql);
    return rows;
};
export const getproductsBycategoryid=async (id)=>{
    const sql=`SELECT l.id,l.title,l.price,l.image, u.username AS seller FROM listings l
     
     JOIN users u ON l.seller_id=u.id
        WHERE category_id=? `;
    const [rows]=await db.execute(sql,[id]);
    return rows;
};
export const getproductbyid= async (productid)=>{
    const listings_id=productid;
    const sql=` SELECT 
      l.id AS listing_id,
      l.title,
      l.description,
      l.price,
      l.image AS primary_image,
      l.category_id,
      l.stock,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', li.id,
          'image_url', li.image_url,
          'is_primary', li.is_primary
        )
      ) AS images
    FROM listings l
     JOIN listing_images li ON l.id = li.listing_id
    WHERE l.id = ?
    GROUP BY l.id`;
    const [rows]= await db.execute(sql,[listings_id]);
    return rows[0];
};

