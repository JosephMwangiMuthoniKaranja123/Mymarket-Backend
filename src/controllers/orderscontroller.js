import { error } from "node:console";
import * as Orders from "../models/orders.js";
import { db } from "../config/db.js";
import { getproductbyid } from "../models/updateproduct.js";

export const keyinorders= async (req,res)=>{
   const connection= await db.getConnection();
    try{
        await connection.beginTransaction();

        const buyer_id=req.user.id;
        const{total_price}=req.body;
      
       
        await Orders.createorder(connection, {buyer_id,total_price});
        await connection.commit();
        res.status(201).json({message:"order created"});
    }
    catch(err)
    {
        await connection.rollback();
        res.status(500).json({error:err.message});
    }
    finally{
        connection.release();
    }
}
export const Listorders=async (req,res)=>{
    try{
         
        const orders= await Orders.listordersbyid(req.user.id);
        res.json(orders);
    }
    catch (err){
        res.status(500).json({error:err.message});
    }
}
export const changeorderstatus= async (req,res)=>{
    try{
        const id=req.params.id;
        const {status}=req.body;
        const isallowed=['pending','paid','shipped','delivered'];

        if(!isallowed.includes(status)) {
            return res.status(400).json({message:"invalid status!"});
        }
        await Orders.updateorderstatus(id,status);
        return res.status(201).json({message:"status updated successfully"});
    }
    catch (error){
        return res.status(500).json({message:error.message});
    }
}
export const ordersbyid=async (req,res)=>{
    const orderid= req.params.id;
    try {
        const order= await Orders.listorderbyorderid(orderid);
        res.json(order);
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
};