import express from "express";
import { checkout } from "../controllers/checkoutcontroller.js";
import { verifytoken } from "../middleware/auths.js";

const router=express.Router();

router.post("/",verifytoken,checkout);

export default router;
