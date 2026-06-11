import cloudinary from "../Config/cloudinaryConnect.js";
import pool from "../Config/dbConnection.js";

export const fetchPerticularUser = async (req, res) => {
    console.log(req.body);
    //console.log(req.user.userId);
    try {
        const user_id = req.user.userId;

        const {
            name,
            age,
            gender,
            email,
            contactNo,
            address,
            profession,
            description,
        } = req.body;

        const file = req.file;
        console.log(file);

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const imageToCloudRes = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: "profileImages",
        });
        console.log("response :- ", imageToCloudRes);

        const insertUserDetailQuery =
            "INSERT INTO userDetails(address, age, gender,profession, profession_description,profile_image_name, user_id,profile_image_uri,email,contactNo,userName)VALUES(?,?,?,?,?,?,?,?,?,?,?) ";

        const [result] = await pool.query(insertUserDetailQuery, [
            address,
            age,
            gender,
            profession,
            description,
            imageToCloudRes.original_filename,
            user_id,
            imageToCloudRes.secure_url,
            email,
            contactNo,
            name,
        ]);

        const profileCompletionDetailsQuery =
            "UPDATE registration SET profileCompleted=1 WHERE registration_id=?";

        const [profileSetResult] = await pool.query(
            profileCompletionDetailsQuery,
            [user_id],
        );

        return res.status(200).json({
            success: true,
            message: "User Details saved successfully",
            pofileImageUrl: imageToCloudRes.secure_url,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "server error" + err,
        });
    }
    // const email = req.user.email;
    // const id = req.user.user_id;

    // const fetchQuery = "SELECT * FROM userDetails where email=? && userId=?";

    // const [result] = await pool.query(fetchQuery, [email, id]);

    // if (result.length == 0) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Not found",
    //     });
    // }

    // return res
    //     .status(200)
    //     .json({ success: true, message: "user Found" }, result);
};
