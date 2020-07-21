"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resError = (statusCode, message) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};
exports.default = resError;
