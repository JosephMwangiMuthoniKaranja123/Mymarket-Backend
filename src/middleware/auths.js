import jwt from "jsonwebtoken";

const JWT_SECRET=process.env.JWT_SECRET;

export const verifytoken=async (req,res,next)=>{
    const authheader=req.headers["authorization"];
    if(!authheader) res.status(401).json({message:"No token provided"});
    const token=authheader.split(" ")[1];
    if(!token) res.status(401).json({message:"Invalid Token"});

    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(err){
        res.status(400).json({error:err.message});
        }
    }
