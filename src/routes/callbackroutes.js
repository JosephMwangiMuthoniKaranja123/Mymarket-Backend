import express from "express";
import { callback } from "../controllers/mpesacallbackcontroller.js";

const router= express.Router();

router.post("/mpesa/callback",callback);
export default router;