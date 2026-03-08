import { getcategories } from "../models/categories.js";

export const getCategories=async (req,res)=>{
    try{
    const categories= await getcategories();
    res.json(categories);
}
catch (err){
    res.status(500).json({error:err.message});
}};