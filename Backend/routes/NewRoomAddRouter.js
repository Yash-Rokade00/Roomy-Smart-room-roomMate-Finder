import express from "express";
import { addNewRoom } from "../Controller/newRoomAddController.js";
import { upload } from "../Middlewares/multer.js";
import { fetchAllRoomDetails } from "../Controller/roomDetailsFetchController.js";
import { singleRoomData } from "../Controller/getSingleRoomDataController.js";

const router = express.Router();

router.post("/uploadRoomDetails", upload.array("images", 6), addNewRoom);
router.post("/getAllRooms", fetchAllRoomDetails);
router.post("/getSingleRoomData", singleRoomData);

export default router;
