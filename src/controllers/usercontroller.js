import { error } from "node:console";
import * as User from "../models/user.js";

export const registeruser=async (req,res)=>{
    try{
        await User.createuser(req.body);
        res.status(201).json({message:"user registered"});
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
};
export const listusers= async (req,res)=>{
    const [users]= await User.returnusers();
    res.json(users);
};