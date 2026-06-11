import pool from "../Config/dbConnection.js";

export const setRoomRStatus = async (req, res) => {
    console.log(req.body);
    try {
        const { email, roomRequiredStatus } = req.body;

        const UpdateRRStatusQuery =
            "UPDATE userDetails SET roomRequiresStatus=? WHERE email=?";

        const result = pool.query(UpdateRRStatusQuery, [
            roomRequiredStatus,
            email,
        ]);

        if ((await result).length !== 0) {
            return res.status(200).json({
                success: true,
                message: "room required status is changed successfully",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "room required Status changing error",
        });
    }
};
