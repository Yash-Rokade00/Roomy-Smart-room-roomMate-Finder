import pool from "../Config/dbConnection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
    try {
        const { name, email, password, contactNo } = req.body;

        console.log("Signup Request:", req.body);

        if (!name || !email || !password || !contactNo) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const query = "SELECT * FROM registration WHERE email=? OR contactNo=?";

        const [result] = await pool.query(query, [email, contactNo]);

        if (result.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery =
            "INSERT INTO registration (FullName,email,Hashpassword,contactNo) VALUES (?,?,?,?)";

        const [insertResult] = await pool.query(insertQuery, [
            name,
            email,
            hashedPassword,
            contactNo,
        ]);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: `ROOMY26${insertResult.insertId}`,
        });
    } catch (err) {
        console.log("Signup Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login Request:", req.body);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const checkQuery = "SELECT * FROM registration WHERE email=?";

        const [result] = await pool.query(checkQuery, [email]);

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email",
            });
        }

        const user = result[0];
        console.log(user);

        const isMatch = await bcrypt.compare(password, user.Hashpassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        const jwtAccessToken = jwt.sign(
            {
                email: user.email,
                userId: user.registration_id,
                name: user.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" },
        );

        const jwtRefreshToken = jwt.sign(
            { userId: user.registration_id },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" },
        );

        return res.status(200).json({
            success: true,
            Accesstoken: jwtAccessToken,
            RefreshToken: jwtRefreshToken,
            message: "Login successful",
            userId: user.registration_id,
            name: user.FullName,
            email: user.email,
            profileCompleted: user.profileCompleted,
            roomCount: user.roomCount,
        });
    } catch (err) {
        console.log("Login Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
