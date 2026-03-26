import express from "express";
import { newservice,deleteService,getservice,updateService } from "../controllers/servicecontroller.js";
import { verifytoken } from "../middleware/auths.js";
import upload from "../middleware/uploads.js";

const router=express.Router();
router.post("/",verifytoken,upload.single("profilepic"),newservice);
router.get("/:id",getservice);
router.delete("/:id",verifytoken,deleteService);
router.put("/:id",verifytoken,updateService);

export default router;