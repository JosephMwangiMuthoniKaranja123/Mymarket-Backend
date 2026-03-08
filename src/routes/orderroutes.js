import express from "express";
import { keyinorders,Listorders,changeorderstatus,ordersbyid } from "../controllers/orderscontroller.js";
import { verifytoken } from "../middleware/auths.js";
import { authorize } from "../middleware/authorize.js";

const router= express.Router();
router.post("/",verifytoken,keyinorders);
router.get("/",verifytoken,Listorders);
router.get("/:id",verifytoken,ordersbyid);
router.put("/:id/status",verifytoken,authorize("admin"),changeorderstatus);

export default router;