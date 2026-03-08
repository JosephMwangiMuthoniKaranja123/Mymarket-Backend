import { addCart,getCartbyuserid,deleteCart } from "../controllers/cartcontroller.js";
import { verifytoken } from "../middleware/auths.js";
import express from 'express';

const router=express.Router();

router.post("/",verifytoken,addCart);
router.get("/",verifytoken,getCartbyuserid);
router.delete("/:id",verifytoken,deleteCart);

export default router;