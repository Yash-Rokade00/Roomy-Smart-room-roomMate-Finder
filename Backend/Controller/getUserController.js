import pool from "../Config/dbConnection.js";

export const getUserDetails = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Email from request body:", email);

        const query = "SELECT * FROM userDetails WHERE email = ?";

        const [result] = await pool.query(query, [email]);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        console.log("Query result:", result[0]);

        return res.status(200).json({
            success: true,
            user: result[0],
        });
    } catch (err) {
        console.error("Error fetching user details:", err);
        return res.status(500).json({
            success: false,
            message: "Database error",
        });
    }
};
