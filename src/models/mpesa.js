import axios from "axios";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

// Load environment variables
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const shortcode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASSKEY;

// Generate OAuth access token
const getAccessToken = async () => {
  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error.response?.data || error.message);
    throw error;
  }
};

// STK Push function
export const stkpush = async (phone, amount) => {
  try {
    // Use async/await correctly for access token
    const accessToken = await getAccessToken();

    // Correct timestamp and password
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

    // Use sandbox test number if testing
    const testPhone = phone.startsWith("2547") ? phone : "254708374149";

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 10,
        PartyA: 254708374154,
        PartyB: shortcode,
        PhoneNumber: testPhone,
        CallBackURL: "https://mymarket-backend-production.up.railway.app/api/mpesa/callback",
        AccountReference: "Marketplace",
        TransactionDesc: "Order payment"
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("MPESA RESPONSE:", response.data);
    return response.data;

  } catch (error) {
    // Log the exact M-Pesa sandbox error
    console.error("MPESA ERROR:", error.response?.data || error.message);
    throw error;
  }
};




