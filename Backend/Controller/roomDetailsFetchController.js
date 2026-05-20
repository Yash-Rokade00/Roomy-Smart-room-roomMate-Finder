import pool from "../Config/dbConnection.js";

export const fetchAllRoomDetails = async (req, res) => {
    try {
        const {
            search = "",
            searchByType,
            searchByPrice,
            page = 1,
            limit = 10,
        } = req.body;
        console.log(searchByType, searchByPrice);

        const offset = (page - 1) * limit;

        // 🧠 Base query
        let query = `
      SELECT 
        r.roomId,
        r.MonthlyRent,
        r.roomType,
        r.Locality,
        r.city,
        r.roomFacilities,
        MIN(i.imagePath) AS image
      FROM roomDetails r
      LEFT JOIN roomImages i 
        ON r.roomId = i.roomId
      WHERE 1=1
    `;

        const type = searchByType?.trim();
        const price = searchByPrice?.trim();
        let values = [];

        //  SEARCH (Locality)
        if (search) {
            query += ` AND LOWER(r.Locality) LIKE ?`;
            values.push(`%${search.toLowerCase()}%`);
        }

        //  ROOM TYPE
        if (type && type !== "All") {
            query += ` AND r.roomType = ?`;
            values.push(type);
        }

        //PRICE FILTER
        if (price == "10000") {
            query += ` AND r.MonthlyRent <= 10000`;
        } else if (price == "10000-15000") {
            query += ` AND r.MonthlyRent > 10000 AND r.MonthlyRent <= 15000`;
        } else if (price == "15000") {
            query += ` AND r.MonthlyRent > 15000`;
        }

        // 📌 GROUP BY (important for image)
        query += ` GROUP BY r.roomId`;

        // 📄 PAGINATION
        query += ` LIMIT ? OFFSET ?`;
        values.push(parseInt(limit), parseInt(offset));

        const [result] = await pool.query(query, values);
        console.log("send to back:", result);

        return res.status(200).json({
            success: true,
            message: "Rooms fetched successfully",
            rooms: result,
        });
    } catch (err) {
        console.log("Fetching error:", err);

        return res.status(500).json({
            success: false,
            message: "Room details fetching error",
        });
    }
};
