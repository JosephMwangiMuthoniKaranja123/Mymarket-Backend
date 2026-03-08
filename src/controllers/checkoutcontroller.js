import { db } from "../config/db.js";

export const checkout=async (req,res)=>{
    const user_id=req.user.id;
    const connection=await db.getConnection();

    await connection.beginTransaction();
    try {
        const [cartItems]= await connection.execute(
            `SELECT c.listings_id,c.quantity, l.price As price
            FROM cart c
            JOIN listings l ON c.listings_id=l.id
            WHERE c.user_id=?`,[user_id]
        );
        if(cartItems.length===0){
            return res.status(404).json({message:"cart is empty"});
        }
        const total_price=cartItems.reduce((sum,item)=>sum+item.quantity*item.price,0);

        const [orderResult]= await connection.execute(
            `INSERT INTO purchases (buyer_id,total_price)
            VALUES(?,?)`,[user_id,total_price]
        );
        const orderid=orderResult.insertId;

        for(let item of cartItems){
            await connection.execute(
                `INSERT INTO order_items (order_id,listings_id,quantity,price) VALUES (?,?,?,?)`,
                [orderid,item.listings_id,item.quantity,item.price]
            );
            await connection.execute(
                `UPDATE listings SET stock=stock-? WHERE id=?`,[item.quantity,item.listings_id]
            );

        }
        await connection.execute(
            `DELETE FROM cart WHERE user_id=?`,[user_id]
        );
        await connection.commit();
        return res.json({message:"order placed successfully"});
        
    } catch (error) {
        res.status(500).json({error:error.message});
        await connection.rollback();
        
    }
    finally{
        await connection.release();
    }
};