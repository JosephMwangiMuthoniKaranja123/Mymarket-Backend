import * as Product from "../models/products.js";
import { db } from "../config/db.js";


export const addproduct=async(req,res)=>{
    const connection= await db.getConnection();
    try{
        await connection.beginTransaction();
        const {title,price,description,category_id,stock}=req.body;
        const primaryimage=`/uploads/${req.files[0].filename}`;
        const seller_id=req.user.id;
      const result= await Product.createproduct(connection,{seller_id,title,price,description,primaryimage,category_id,stock});
     
       
      if (!req.files || req.files.length === 0) {
  await connection.rollback();
  return res.status(400).json({ message: "No images uploaded" });
}
   const listings_id=result.insertId;

      for(let i=0;i<req.files.length;i++){
        const file=req.files[i];

        await connection.query(
            "INSERT INTO listing_images (listing_id,image_url,is_primary) VALUES(?,?,?)",
            [listings_id,
            `/uploads/${file.filename}`,
              i ===0 ? true:false  ]
        );
      }

       
        await connection.commit();
       return res.status(201).json({message:"product added successful"});
    }
    catch (err){
       await connection.rollback();
       return res.status(500).json({error:err.message});
    }
    finally{
        connection.release();
    }
}
export const listproducts=async (req,res)=>{
    try{
       const products =await Product.getallproducts();
       return res.json(products);
    }
    catch(err){
       return res.status(500).json({error:err.message});
    }
}
export const getpbycategoryid=async (req,res)=>{
    try {
        const products= await Product.getproductsBycategoryid(req.params.id);
      return  res.json(products);
    } catch (error) {
      return res.status(500).json({error:error.message}) ;
    }
}
export const getproductbyId=async (req,res)=>{
    const listings_id=req.params.id;
    try{
        const products=await Product.getproductbyid(listings_id);
         if (!products) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json(products);
    }
     catch (error) {
      return res.status(500).json({error:error.message}) ;
    }
}
