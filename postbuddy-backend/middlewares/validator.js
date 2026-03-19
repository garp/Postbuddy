import { responseHandler } from "../utils/responseHandler.js";

const defaults = {
    'abortEarly': false,
    'allowUnknown': true, 
    'stripUnknown': true
};

export default function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, defaults);
        if (error) {
            return responseHandler(error, res, error.message, 422);
        }
        req.value = value;
        next();
    }
};


