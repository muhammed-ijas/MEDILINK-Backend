"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class sendOtp {
    constructor() {
        console.log("Initializing Nodemailer transporter...");
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "muhammedijas793@gmail.com",
                pass: process.env.MAILER,
            },
        });
        console.log("Nodemailer transporter initialized.", process.env.MAILER);
    }
    sendMail(email, otp) {
        console.log("came here sendmail inside services / sendMail");
        const mailOptions = {
            from: "muhammedijas793@gmail.com",
            to: email,
            subject: "MEDILINK Email Verification",
            text: `${email},your verification code is: ${otp}`,
        };
        this.transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log("err  from send mail  :", err);
            }
            else {
                console.log("verification code sent successfully");
            }
        });
    }
    sendConfirmation(email) {
        const mailOptions = {
            from: "muhammedijas793@gmail.com",
            to: email,
            subject: "Your service provider Request Has Been Approved",
            text: `We are pleased to inform you that your request to become a service provider of our company has been approved. Congratulations!`,
        };
        this.transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Confirmation email sent successfully");
            }
        });
    }
    sendRejection(email, reason) {
        const mailOptions = {
            from: "muhammedijas793@gmail.com",
            to: email,
            subject: "Your  Request Has Been Rejected",
            text: `${reason}`,
        };
        this.transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Confirmation email sent successfully");
            }
        });
    }
    // Function to send appointment cancellation email
    sendCancellation(email, reason) {
        const mailOptions = {
            from: "muhammedijas793@gmail.com",
            to: email,
            subject: "Appointment Cancellation",
            text: `Your appointment has been cancelled . Reason: ${reason}`,
        };
        this.transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log("Error sending cancellation email:", err);
            }
            else {
                console.log("Cancellation email sent successfully");
            }
        });
    }
    sendApproval(email, name) {
        const mailOptions = {
            from: "muhammedijas793@gmail.com",
            to: email,
            subject: "MEDILINK Service Approval Notification",
            text: `Dear ${name},\n\nYour service has been successfully approved and verified by Medilink. You can now start listing your services on the platform.\n\nBest regards,\nMedilink Team`,
        };
        this.transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log("Error sending approval email:", err);
            }
            else {
                console.log("Approval email sent successfully");
            }
        });
    }
}
exports.default = sendOtp;
