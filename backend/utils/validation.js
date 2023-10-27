const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors.array().forEach(error => errors[error.path] = error.msg);

        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        next(err);
    }
    next();
};

const handleValidationDuplicates = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors.array().forEach(error => errors[error.path] = error.msg);

        const err = Error("User already exists.");
        err.errors = errors;
        err.status = 500;
        err.title = "User already exists.";
        next(err);
    }
    next();
};

module.exports = {
    handleValidationErrors,
    handleValidationDuplicates
};
