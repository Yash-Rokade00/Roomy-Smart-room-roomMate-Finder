import cloudinary from "../Config/cloudinaryConnect.js";
import pool from "../Config/dbConnection.js";
import admin from "firebase-admin";
import fs from "fs";

export const addNewRoom = async (req, res) => {
    console.log(req.body);
    // const files = req.files;
    // console.log(files);
    try {
        const files = req.files;
        console.log(files);

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "images are required",
            });
        }
        const {
            roomId,
            OwnerName,
            OwnerContact,
            OwnerEmail,
            MonthlyRent,
            SecurityDeposit,
            RoomType,
            city,
            Locality,
            fullAddress,
            Preferred_tenants,
            requirement,
            Facilities,
            roomDescription,
            userName,
            userEmail,
        } = req.body;

        const insertQuery =
            "INSERT INTO roomDetails(ownerName, ownerContact, MonthlyRent, SecurityDeposit, roomType, city, Locality,FullAddress,Preferred_tenants, requirementsOrRules,roomFacilities,roomDescription,ownerEmail,roomUploaderName, roomUploaderEmail)Values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";

        const [resultRoomDetails] = await pool.query(insertQuery, [
            OwnerName,
            OwnerContact,
            MonthlyRent,
            SecurityDeposit,
            RoomType,
            city,
            Locality,
            fullAddress,
            Preferred_tenants,
            requirement,
            Facilities,
            roomDescription,
            OwnerEmail,
            userName,
            userEmail,
        ]);

        if (resultRoomDetails.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "requires All fields",
            });
        }

        const roomCode = "ROOM" + roomId + resultRoomDetails.insertId;

        const uploadedImages = await Promise.all(
            files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                    resource_type: "auto",
                    folder: "roomImages",
                });

                // delete file from uploads folder
                fs.unlinkSync(file.path);

                return {
                    original_filename: result.original_filename,
                    format: result.format,
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                };
            }),
        );

        const imageInsert =
            "INSERT INTO roomImages(imageName, imageType, imagePath, roomId, roomCode, public_id)VALUES(?,?,?,?,?,?)";

        for (let img of uploadedImages) {
            await pool.query(imageInsert, [
                img.original_filename,
                img.format,
                img.secure_url,
                resultRoomDetails.insertId,
                roomCode,
                img.public_id,
            ]);
        }

        const roomCountQuery =
            "UPDATE registration set roomCount=roomCount+1 where FullName=?";

        const [output] = await pool.query(roomCountQuery, [userName]);

        const [users] = await pool.query(
            "SELECT fcmToken FROM userDetails WHERE fcmToken IS NOT NULL AND userName!=?",
            [userName],
        );

        const tokens = users.map((u) => u.fcmToken).filter(Boolean);
        console.log(tokens);

        const sendNotification = async (tokensArray, message) => {
            if (!Array.isArray(tokensArray) || tokensArray.length === 0) {
                return;
            }
            await admin.messaging().sendEachForMulticast({
                tokens: tokensArray,
                notification: message.notification,
                data: message.data,
            });
        };

        const newRoomMessage = {
            notification: {
                title: "New Room Available",
                body: `A new room is available in ${city}, ${Locality}. Check it out!`,
            },
            data: {
                screen: "SingleRoomDetails",
                roomId: resultRoomDetails.insertId.toString(),
            },
            android: {
                priority: "high",
            },
        };

        await sendNotification(tokens, newRoomMessage);

        const lessPriceRoomMessage = {
            notification: {
                title: "",
                body: "",
            },
            data: {
                screen: "SingleRoomDetails",
                roomId: resultRoomDetails.insertId.toString(),
            },
            android: {
                priority: "high",
            },
        };

        if (MonthlyRent < 10000) {
            lessPriceRoomMessage.notification.title = "Affordable Room Alert";
            lessPriceRoomMessage.notification.body = `A new room under ₹10,000 is available in ${city}, ${Locality}. Don't miss it!`;
            await sendNotification(tokens, lessPriceRoomMessage);
        }

        return res.status(200).json({
            success: true,
            message: "Room Details stored Successfully",
            roomCode: roomCode,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "room Details storing error || server err" + err,
        });
    }
};
