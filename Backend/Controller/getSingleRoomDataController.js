import pool from "../Config/dbConnection.js";

export const singleRoomData = async (req, res) => {
    //console.log(req.body);
    try {
        const { roomId } = req.body;
        const dataQuery = "SELECT * FROM roomDetails where roomId=?";
        const dataResult = await pool.query(dataQuery, [roomId]);
        const imagesQuery =
            "SELECT roomId, roomCode, imagePath, imageId from roomImages where roomId=?";
        //const joinQuery ="select * from roomDetails Left JOIN (select roomId, imagePath,roomCode from roomImages)as images on roomDetails.roomId= images.roomId;";
        const imagesData = await pool.query(imagesQuery, [roomId]);
        //console.log("data result : ", dataResult[0][0]);
        //console.log("images data  : ", imagesData[0]);
        if (!dataResult && !imagesData) {
            return res.status(403).json({
                success: false,
                message: "invalid roomId cant find a data",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Single room Data fetch Successfully",
            roomDetails: dataResult[0][0],
            roomImages: imagesData[0],
        });
    } catch (err) {
        console.log("single room data err: ", err);
        return res.status(500).json({
            success: false,
            message: "error while fetching single room data " + err,
        });
    }
};
