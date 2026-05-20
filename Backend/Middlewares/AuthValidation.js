import joi from "joi";

export const signUpValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(3).max(50).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
        contactNo: joi.string().length(10).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "validation error" + error,
        });
    }
    next();
};

export const loginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(7).max(50).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "validation error",
            success: false,
        });
    }
    next();
};
