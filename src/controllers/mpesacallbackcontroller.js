import { db } from "../config/db.js";

export const callback=async ()=>{
    const connection=db.getConnection();
    try {
          const callback = req.body;
          console.log("M-Pesa callback received:", JSON.stringify(callback));


    const stkCallback = callback.Body.stkCallback;
    const checkoutId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    await connection.beginTransaction();

    if (resultCode === 0) {
      // Payment success
      // Extract relevant info (Receipt, Amount)
      const metadata = stkCallback.CallbackMetadata.Item;
      const mpesaReceipt = metadata.find(i => i.Name === "MpesaReceiptNumber")?.Value || null;
      const amount = metadata.find(i => i.Name === "Amount")?.Value || null;
      const phoneNumber = metadata.find(i => i.Name === "PhoneNumber")?.Value || null;

      // Update order payment status
      const [orders] = await connection.execute(
        "SELECT buyer_id FROM purchases WHERE checkout_id = ?",
        [checkoutId]
      );

      if (orders.length === 0) {
        throw new Error("Order not found for CheckoutRequestID: " + checkoutId);
      }

      const buyerId = orders[0].buyer_id;

      await connection.execute(
        `UPDATE purchases 
         SET payment_status='paid', mpesa_receipt=?, total_price=? 
         WHERE checkout_id=?`,
        [mpesaReceipt, amount, checkoutId]
      );

      // Deduct stock for each item
      const [orderItems] = await connection.execute(
        `SELECT listings_id, quantity FROM order_items WHERE order_id = 
         (SELECT id FROM purchases WHERE checkout_id=?)`,
        [checkoutId]
      );

      for (let item of orderItems) {
        await connection.execute(
          `UPDATE listings SET stock = stock - ? WHERE id = ?`,
          [item.quantity, item.listings_id]
        );
      }

      // Clear user's cart
      await connection.execute(`DELETE FROM cart WHERE user_id = ?`, [buyerId]);

      await connection.commit();

      console.log("Order marked as paid and stock updated for CheckoutRequestID:", checkoutId);
    } else {
      // Payment failed or canceled
      await connection.execute(
        `UPDATE purchases SET payment_status='failed' WHERE checkout_id=?`,
        [checkoutId]
      );
      await connection.commit();

      console.log("Payment failed for CheckoutRequestID:", checkoutId, "Desc:", resultDesc);
    }

    // Always respond 200 to Safaricom
    res.json({ message: "Callback processed successfully" });

  } catch (error) {
    await connection.rollback();
    console.error("Callback processing error:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    await connection.release();
  }
};