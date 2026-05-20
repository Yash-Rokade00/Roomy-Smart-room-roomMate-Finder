import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./services/firebaseSetup.js";
import AuthRouter from "./routes/AuthRouter.js";
import userDetailSave from "./routes/userDetailsRouter.js";
import getUserRoute from "./routes/getUserDetailsRouter.js";
import addNewRoomRoute from "./routes/NewRoomAddRouter.js";
import roomMateListRoute from "./routes/roomMateSearchRouter.js";
const app = express();
app.use(express.json());
const port = 3030;

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

app.use("/auth", AuthRouter);
app.use("/profile", userDetailSave);
app.use("/user", getUserRoute);
app.use("/room", addNewRoomRoute);
app.use("/roomMate", roomMateListRoute);

app.listen(port, "0.0.0.0", () => {
    console.log("Backend is running on port 3030");
});
