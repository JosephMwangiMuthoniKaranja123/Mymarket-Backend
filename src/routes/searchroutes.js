import { searchItem } from "../controllers/searchcontroller.js";
import { verifytoken } from "../middleware/auths.js";
import express from "express";

const router=express.Router();
router.get("/",searchItem);

export default router;