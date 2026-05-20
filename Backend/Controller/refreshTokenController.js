import jwt from "jsonwebtoken";

export const refreshTokenController = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token is required",
        });
    }
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, result) => {
        if (err) {
            return res
                .status(403)
                .json({ success: false, message: "Invalid refresh Token" });
        }

        const newAccessToken = jwt.sign(
            { userId: result.registrationId },
            process.env.REFRESH_SECRET,
            { expiresIn: "1h" },
        );

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken,
        });
    });
};
