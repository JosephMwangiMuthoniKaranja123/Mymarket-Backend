import express from "express";
import { addproduct,listproducts,getpbycategoryid,getproductbyId } from "../controllers/productcontroller.js";
import { verifytoken } from "../middleware/auths.js";
import { authorize } from "../middleware/authorize.js";
import { update } from "../controllers/updateproductcontroller.js";
import { deleteProduct } from "../controllers/deleteproductcontroller.js";
import upload from "../middleware/uploads.js";
 
const router=express.Router();
router.post("/",verifytoken,authorize("admin","seller","buyer"),upload.array("images",10),addproduct);
router.get("/",verifytoken,listproducts);
router.put("/:id",verifytoken,authorize("admin","seller"),update);
router.delete("/:id",verifytoken,authorize("admin","seller"),deleteProduct);
router.get("/:id",verifytoken,getpbycategoryid);
router.get("/productbyid/:id",verifytoken,getproductbyId);

export default router;