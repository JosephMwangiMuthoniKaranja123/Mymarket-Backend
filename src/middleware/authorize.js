export const authorize=(...allowedroles)=>{
    return(req,res,next)=>{
        if(!allowedroles.includes(req.user.role)){
      res.status(500).json({message:"you are not allowed to perform this action"})

    }
    next();
}
}