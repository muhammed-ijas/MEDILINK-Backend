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
class spController {
    constructor(spUseCase) {
        this.spUseCase = spUseCase;
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifySP = yield this.spUseCase.checkExist(req.body.email);
                if (verifySP.data.status == true) {
                    const sendOtp = yield this.spUseCase.signup(req.body.email, req.body.name, req.body.phone, req.body.password, req.body.area, req.body.city, req.body.latitude, req.body.longitude, req.body.state, req.body.pincode, req.body.district);
                    return res.status(sendOtp.status).json(sendOtp.data);
                }
                else {
                    return res.status(verifySP.status).json(verifySP.data);
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
                if (typeof email !== 'string' || typeof otp !== 'number') {
                    return res.status(400).json({ message: "Invalid email or OTP format" });
                }
                // Proceed with verification
                const verify = yield this.spUseCase.verifyOtp(email, otp);
                if (verify.status == 400) {
                    return res.status(verify.status).json({ message: verify.message });
                }
                else if (verify.status == 200) {
                    let save = yield this.spUseCase.verifyOtpSP(verify.data);
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
                const sp = yield this.spUseCase.login(email, password);
                return res.status(sp.status).json(sp.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, password, phone, area, city, latitude, longitude, state, pincode, district, } = req.body;
                let resent = yield this.spUseCase.resendOtp(email, name, phone, password, area, city, latitude, longitude, state, pincode, district);
                if (resent) {
                    return res.status(resent.status).json({ message: resent.message });
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
                let update = yield this.spUseCase.updatePassword(Id, password, oldPassword);
                if (update) {
                    return res.status(update.status).json(update.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = spController;
