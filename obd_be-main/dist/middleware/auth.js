"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Temporary development token (replace with actual JWT for testing)
const TEMP_DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJuYW1lIjoiTmljayBGdXJ5Iiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzQyNzQ2NjU1LCJleHAiOjE3NDMzNTE0NTV9.rsLi8R2oeX4EsWdp2h3Nm0WvwrztEtmLvC2Yo2GkYiQ";
const auth = (req, res, next) => {
    var _a;
    // Get token from header or query param
    const tokenFromHeader = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const tokenFromQuery = req.query.token;
    // Use hardcoded token in development if none provided
    const isDev = process.env.NODE_ENV !== 'production';
    const authToken = tokenFromHeader || tokenFromQuery || (isDev ? TEMP_DEV_TOKEN : null);
    // // Debugging
    console.log('Auth Token:', authToken);
    if (!authToken) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
exports.default = auth;
