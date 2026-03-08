import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { returnusers } from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET;

export const loginuser= async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await returnusers(email);
        if(!user) return res.status(400).json({message:"user not found!"});
        const ismatch= await bcrypt.compare(password,user.password);
        if(!ismatch) return res.status(401).json({message:"invalid password!!"});

        //generate jwt
        const token= jwt.sign(
            {id:user.id,username:user.username,email:user.email,role:user.role},
            JWT_SECRET,
            {expiresIn: "1h"}
        );
        res.json({message:"Login successful",token});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

