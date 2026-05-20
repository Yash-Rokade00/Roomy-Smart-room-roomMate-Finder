import express from "express";
import { fetchPerticularUser } from "../Controller/userDetailsController.js";
import { tokenAuthentication } from "../Middlewares/userDetailsValidation.js";
import { upload } from "../Middlewares/multer.js";
import { setRoomRStatus } from "../Controller/roomRequiredStatusController.js";

const router = express.Router();

router.post(
    "/updation",
    tokenAuthentication,
    upload.single("ProfileImage"),
    fetchPerticularUser,
);

router.post("/RRStatus", setRoomRStatus);

export default router;
