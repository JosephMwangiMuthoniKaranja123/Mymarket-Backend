import express from "express";
import { loginuser } from "../controllers/authcontroller.js";

const router=express.Router();

router.post("/login",loginuser);
export default router;