import { updateproduct,getproductbyid } from "../models/updateproduct.js";

export const update= async (req,res)=>{
    try{
    const listings_id=req.params.id;
    const {title,price,image,description,category_id}=req.body;
    

    const rows= await getproductbyid(listings_id);
    if(!rows.length)return res.status(404).json({message:"product does not exist"});

    const product=rows[0];

    if(product.seller_id!==req.user.id) return res.status(403).json({message:"You can only update your own product"});
    await updateproduct({listings_id,title,price,image,description,category_id});
    
   return res.status(200).json({message:"Product updated successfully"});
    



}
catch(error){
    res.status(500).json({error:error.message});
}
}

