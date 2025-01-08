"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTToken {
    generateToken(userId, role) {
        const SECRETKEY = process.env.JWT_SECRET_KEY;
        if (SECRETKEY) {
            const token = jsonwebtoken_1.default.sign({ userId, role }, SECRETKEY, {
                expiresIn: '30d'
            });
            return token;
        }
        throw new Error('JWT key is not defined!');
    }
}
exports.default = JWTToken;
