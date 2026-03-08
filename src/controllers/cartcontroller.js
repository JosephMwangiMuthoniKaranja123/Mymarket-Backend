import * as Cart from "../models/cart.js";

export const addCart=async (req,res)=>{
    try{
    const {listings_id,quantity}=req.body;
    const user_id=req.user.id;
    await Cart.addtocart(user_id,listings_id,quantity);
    res.json({message:"added to cart"});
}
catch (err){
    res.status(500).json({error:err.message});
}
};
export const getCartbyuserid=async (req,res)=>{
    try {
        const user_id=req.user.id;
        const cart=await Cart.getcartbyuserid(user_id);
        return res.json(cart);
        
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
};
export const deleteCart= async (req,res)=>{
    try {
        const id=req.params.id;
        await Cart.deletecart(id);
        res.json({message:"cart removed"})
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};
