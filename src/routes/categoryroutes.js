import { getCategories } from "../controllers/categoriescontroller.js";
import express from "express";
import { verifytoken } from "../middleware/auths.js";

const router=express.Router();

router.get("/",verifytoken,getCategories);
export default router;