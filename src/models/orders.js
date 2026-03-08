import {db} from "../config/db.js";

export const createorder= async (connection,order)=>{
    const {buyer_id,total_price}=order;
    const sql=`INSERT INTO purchases
    (buyer_id,total_price)
    VALUES(?,?)`;
    return connection.execute(sql,[buyer_id,total_price]);
}
export const listordersbyid= async (buyerid)=>{
    const sql=`SELECT 
    p.id,
    u.username AS buyer,
    l.image AS image,
    l.title AS product,
    l.description AS description,
    oi.quantity AS quantity,
    oi.price As price,
    p.status,
    p.purchased_at,
    p.total_price
    FROM purchases p 
    JOIN users u ON p.buyer_id=u.id
    JOIN order_items oi ON p.id=oi.order_id
    JOIN listings l ON oi.listings_id=l.id
    
    WHERE p.buyer_id=?
    ORDER BY p.purchased_at DESC `;
    

    const[rows]=await db.execute(sql,[buyerid]);
    
    return rows;
}
export const updateorderstatus= async (orderid,orderstatus)=>{
    const sql=`UPDATE purchases SET status=? WHERE id=?`;
    const [result]=await db.execute(sql,[orderstatus,orderid]);
    return result;
};
export const listorderbyorderid= async (orderid)=>{
    const sql=`SELECT 
    p.id,
    u.username AS buyer,
    l.image AS image,
    l.title AS product,
    l.description AS description,
    oi.quantity AS quantity,
    oi.price As price,
    p.status,
    p.purchased_at,
    p.total_price
    FROM purchases p 
    JOIN users u ON p.buyer_id=u.id
    JOIN order_items oi ON p.id=oi.order_id
    JOIN listings l ON oi.listings_id=l.id
    
    WHERE p.id=?`;
    const [rows]=await db.execute(sql,[orderid]);
    return rows;
}