import { createservice,getservicebyid,deleteservice,updateservice } from "../models/services.js";

export const newservice=async (req,res)=>{
    try{
    const userid=req.user.id;
    const {description}=req.body;
    const profilepicurl=req.file.path;
    const result=await createservice(userid,description,profilepicurl);
    return res.status(201).json({message:"service added successfully"});
    }
    catch (err){
        return res.status(500).json({error:err.message});

    }
};
export const getservice=async(req,res)=>{
    try {
        const id= req.params.id;
        const service= await getservicebyid(id);
        if (!service){
            return res.status(404).json({message:"service not found"});
        }
        return res.json(service);
    } catch (err) {
        return res.status(500).json({error:err.message});
    }
};
export const deleteService=async (req,res)=>{
    try {
        const id= req.params.id;
        const results= await deleteservice(id);
        return res.status(201).json({message:"service deleted successfully"});
    } catch (error) {
         return res.status(500).json({error:error.message}); 
    }
};
export const updateService=async (req,res)=>{
   try {
     const id= req.params.id;
     const userid=req.user.id;
     const {description}=req.body;
     const {profilepicurl}=req.file.path;
     const results=await updateservice(id,userid,description,profilepicurl);
     return res.status(201).json({message:"service updated"});
    
   } catch (error) {
        return res.status(500).json({error:error.message}); 
   }
}