import { deleteproduct,getproductbyid } from "../models/updateproduct.js";

export const deleteProduct= async (req,res)=>{
    try{
   const listings_id=req.params.id;
   const [rows]=getproductbyid(listings_id);

   if(!rows.length) res.status(404).json({message:"product does not exist"});

   const product=rows[0];
   if(product.seller_id !==req.user.id) res.status(403).json({message:"You can only delete your product"});
   await deleteproduct(listings_id);
   res.json({message:"Product deleted"});
}
catch(error){
    res.status(500).json({error:error.message});
}
}

