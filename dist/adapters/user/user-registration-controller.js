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
Object.defineProperty(exports, "__esModule", { value: true });
class userController {
    constructor(userUseCase) {
        this.userUseCase = userUseCase;
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyUser = yield this.userUseCase.checkExist(req.body.email);
                if (verifyUser.data.status == true && req.body.fromGoogle) {
                    const user = yield this.userUseCase.verifyOtpUser(req.body);
                    return res.status(user.status).json(user);
                }
                if (verifyUser.data.status == true) {
                    const sendOtp = yield this.userUseCase.signup(req.body.email, req.body.name, req.body.phone, req.body.password);
                    return res.status(sendOtp.status).json(sendOtp.data);
                }
                else {
                    return res.status(verifyUser.status).json(verifyUser.data);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp: otpObj, email: emailObj } = req.body;
                const otp = (otpObj === null || otpObj === void 0 ? void 0 : otpObj.otp) || otpObj;
                const email = (emailObj === null || emailObj === void 0 ? void 0 : emailObj.email) || emailObj;
                if (typeof email !== "string" || typeof otp !== "number") {
                    return res.status(400).json({ message: "Invalid email or OTP format" });
                }
                const verify = yield this.userUseCase.verifyOtp(email, otp);
                if (verify.status == 400) {
                    return res.status(verify.status).json({ message: verify.message });
                }
                else if (verify.status == 200) {
                    let save = yield this.userUseCase.verifyOtpUser(verify.data);
                    if (save) {
                        return res.status(save.status).json(save);
                    }
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.userUseCase.login(email, password);
                return res.status(user.status).json(user.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, password, phone } = req.body;
                let resent = yield this.userUseCase.resendOtp(email, name, phone, password);
                if (resent) {
                    return res.status(resent.status).json({ message: resent.message });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotVerifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, email } = req.body;
                let verify = yield this.userUseCase.verifyOtp(email, otp);
                if (verify.status == 400) {
                    return res.status(verify.status).json({ message: verify.message });
                }
                else if (verify.status == 200) {
                    return res.status(verify.status).json(verify.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, email } = req.body;
                const changePassword = yield this.userUseCase.resetPassword(password, email);
                return res.status(changePassword.status).json(changePassword.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.userUseCase.forgotPassword(email);
                if (user.status == 200) {
                    return res.status(user.status).json(user.data);
                }
                else {
                    return res.status(user.status).json(user.data);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    resentOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                let resend = yield this.userUseCase.resentOtp(email);
                if (resend) {
                    return res.status(resend.status).json({ message: resend.message });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { Id, password, oldPassword } = req.body;
                let update = yield this.userUseCase.updatePassword(Id, password, oldPassword);
                return res.status(update.status).json(update);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = userController;
