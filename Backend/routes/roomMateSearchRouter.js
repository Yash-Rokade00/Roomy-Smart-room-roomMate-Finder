import express from "express";
import { getRoomMateList } from "../Controller/getRoomMateSearchDataController.js";

const router = express.Router();

router.post("/searchList", getRoomMateList);

export default router;
