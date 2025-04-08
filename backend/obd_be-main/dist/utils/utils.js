"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comp = void 0;
exports.generatePassword = generatePassword;
exports.hashPassword = hashPassword;
exports.sendmail = sendmail;
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = require("../services/emailService"); // A function to send emails
const bcrypt_1 = __importDefault(require("bcrypt"));
const port = 4200;
exports.comp = `https://172.16.90.127:${port}`;
function generatePassword() {
    return __awaiter(this, void 0, void 0, function* () {
        // Generate a secure random password
        const plainPassword = crypto_1.default.randomBytes(8).toString('hex'); // Example: "f3a9b4c1e8d2"
        return plainPassword;
    });
}
function hashPassword(plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(plainPassword, saltRounds);
        return hashedPassword;
    });
}
function sendmail(name, email, plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        // Send the generated password to the user's email
        const emailSubject = 'Your Account Credentials';
        const emailBody = `
          Hello ${name},

          Your account has been created successfully.
          Here are your login details:

          Email: ${email}
          Temporary Password: ${plainPassword}

          Please change your password upon first login.

          Regards,
          Your Company
      `;
        yield (0, emailService_1.sendEmail)(email, emailSubject, emailBody);
    });
}
