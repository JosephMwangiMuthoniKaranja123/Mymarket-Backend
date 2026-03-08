import { search } from "../models/search.js";

export const searchItem= async(req,res)=>{
    const {q}= req.query;
    try {
        const results= await search(q);
        res.json(results);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }

};