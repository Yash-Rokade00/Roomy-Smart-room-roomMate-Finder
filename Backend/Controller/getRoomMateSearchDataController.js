import pool from "../Config/dbConnection.js";

export const getRoomMateList = async (req, res) => {
    try {
        const {
            email,
            roomRequiredStatus,
            search = "",
            page = 1,
            limit = 10,
        } = req.body;

        const offset = (page - 1) * limit;

        let query = `
            SELECT *
            FROM userDetails
            WHERE roomRequiresStatus = ?
        `;

        let params = [roomRequiredStatus];

        //  SEARCH FILTER
        if (search && search.trim() !== "") {
            query += `
                AND (
                    address LIKE ?
                    OR profession LIKE ?
                )
            `;
            params.push(`%${search}%`, `%${search}%`);
        }

        // PAGINATION
        query += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [result] = await pool.query(query, params);

        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                List: [],
                message: "No users found",
            });
        }

        return res.status(200).json({
            success: true,
            List: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
};
