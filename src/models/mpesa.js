import axios from "axios";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

const consumerkey=process.env.CONSUMER_KEY;
const consumersecret=process.env.CONSUMER_SECRET;
const shortcode=process.env.MPESA_SHORTCODE;
const passkey=process.env.MPESA_PASSKEY;

const getaccessToken= async ()=>{
    const auth= Buffer.from(`${consumerkey}:${consumersecret}`).toString("base64");
    const response= await axios.get( "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
            headers:{
                Authorization:`Basic ${auth}`
            }
        }
    );
    return response.data.access_token;
};

export const stkpush= async (phone,amount)=>{
    const accesstoken=getaccessToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password=Buffer.from(shortcode+passkey+timestamp).toString("base64");

    const response= await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: "https://yourbackend.com/mpesa/callback",
      AccountReference: "Marketplace",
      TransactionDesc: "Order payment"
    },
    {
      headers: {
        Authorization: `Bearer ${accesstoken}`
      }
    }
  );

  return response.data;
};



