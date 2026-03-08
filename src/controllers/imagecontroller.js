import { saveimages,getimages } from "../models/images.js";

export const saveImages= async (req,res)=>{
    const {listings_id,is_primary}=req.body;
    const image_url=`/uploads/${req.file.filename}`;
    try{
    await saveimages({listings_id,image_url,is_primary});
    return res.json({message:"image saved successful"});
}
catch (err){
   return res.status(500).json({error:err.message});
}
};

export const getImagesbylid=async (req,res)=>{
    const {listings_id}=req.body;
    try {
        const images= await getimages(listings_id);
       return res.json(images);
    } catch (error) {
        return  res.status(500).json({error:error.message});
    }
};