import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, "../uploads");
    },
    filename: (req, file, cd) => {
        cd(null, Date.now() + "-" + file.originalname);
    },
});

export const upload = multer({ storage });
