import express from "express";
import cors from "cors";
import userRoutes from "./routes/userroutes.js";
import productRoutes from "./routes/productsroutes.js";
import orderRoutes from "./routes/orderroutes.js";
import authRoutes from "./routes/authroutes.js";
import categoryRoutes from "./routes/categoryroutes.js";
import cartRoutes from "./routes/cartroutes.js";
import checkoutRoutes from "./routes/checkoutroutes.js";
import searchRoutes from "./routes/searchroutes.js";


const app = express();
const PORT=process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/uploads",express.static('uploads'));
app.use("/api/cart",cartRoutes);
app.use("/api/checkout",checkoutRoutes);
app.use("/api/search",searchRoutes);

app.get("/", (req, res) => {
  res.send("Backend API running");
});


app.listen(PORT,()=>{
    console.log(`server running on port: ${PORT}`)});