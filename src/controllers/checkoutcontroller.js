import { db } from "../config/db.js";
import { stkpush } from "../models/mpesa.js";

export const checkout = async (req, res) => {
    const user_id = req.user.id;
    const { paymentmethod, phonenumber } = req.body;
    const connection = await db.getConnection();

    try {
        const [cartItems] = await connection.execute(
            `SELECT c.listings_id, c.quantity, l.price AS price
             FROM cart c
             JOIN listings l ON c.listings_id = l.id
             WHERE c.user_id = ?`,
            [user_id]
        );

        if (cartItems.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        const total_price = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

        await connection.beginTransaction();

        // Create order with pending status
        const [orderResult] = await connection.execute(
            `INSERT INTO purchases (buyer_id, total_price, payment_method, payment_status)
             VALUES (?, ?, ?, ?)`,
            [user_id, total_price, paymentmethod, paymentmethod === 'mpesa' ? 'pending' : 'paid']
        );

        const orderid = orderResult.insertId;

        // Insert order items
        for (let item of cartItems) {
            await connection.execute(
                `INSERT INTO order_items (order_id, listings_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [orderid, item.listings_id, item.quantity, item.price]
            );
        }

        // Only send STK Push if payment method is mpesa
        let response;
        if (paymentmethod === "mpesa") {
            response = await stkpush(phonenumber, total_price);

            // Save CheckoutRequestID for callback processing
            await connection.execute(
                `UPDATE purchases SET checkout_id = ? WHERE id = ?`,
                [response.CheckoutRequestID, orderid]
            );

            await connection.commit();
            return res.json({
                message: "M-Pesa prompt sent to phone",
                data: response,
                orderId: orderid
            });
        }

        // For other payment methods, commit and clean cart
        await connection.execute(`DELETE FROM cart WHERE user_id = ?`, [user_id]);
        await connection.commit();

        return res.json({ message: "Order placed successfully", orderId: orderid });

    } catch (error) {
        await connection.rollback();
        console.error("Checkout error:", error);
        return res.status(500).json( { message: "Checkout failed",
      error: error.message,
      mysql_error: error.sqlMessage || null,
      code: error.code || null});
    } finally {
        await connection.release();
    }
};