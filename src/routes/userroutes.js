import express from "express";
import { registeruser,listusers } from "../controllers/usercontroller.js";

const router=express.Router();
router.post("/register",registeruser);
router.get("/",listusers);

export default router;