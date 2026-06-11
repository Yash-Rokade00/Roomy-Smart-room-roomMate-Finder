import express from "express";
import { tokenAuthentication } from "../Middlewares/userDetailsValidation.js";
import { getUserDetails } from "../Controller/getUserController.js";

const router = express.Router();

router.post("/getUser", tokenAuthentication, getUserDetails);

export default router;
