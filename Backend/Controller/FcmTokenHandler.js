import pool from "../Config/dbConnection.js";

export const fcmTokenHandler = async (req, res) => {
    console.log(req.body);
    try {
        const { fcmToken, userEmail } = req.body;
        const updateQuery = "UPDATE userDetails SET fcmToken= ? WHERE email=?";
        const [result] = await pool.query(updateQuery, [fcmToken, userEmail]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "FCM token updated successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error updating FCM token",
        });
    }
};
