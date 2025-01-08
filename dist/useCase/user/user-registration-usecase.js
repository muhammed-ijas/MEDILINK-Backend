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
class UserRegisterUsecase {
    constructor(UserRepository, encryptPassword, jwtToken, generateOtp, generateEmail) {
        this.UserRepository = UserRepository;
        this.EncryptPassword = encryptPassword;
        this.JwtToken = jwtToken;
        this.generateOtp = generateOtp;
        this.generateEmail = generateEmail;
    }
    checkExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield this.UserRepository.findByEmail(email);
            if (userExist) {
                return {
                    status: 400,
                    data: {
                        status: false,
                        message: "User already exists",
                    },
                };
            }
            else {
                return {
                    status: 200,
                    data: {
                        status: true,
                        message: "User does not exist",
                    },
                };
            }
        });
    }
    signup(email, name, phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = this.generateOtp.createOtp();
            const hashedPassword = yield this.EncryptPassword.encryptPassword(password);
            yield this.UserRepository.saveOtp(email, otp, name, phone, hashedPassword);
            this.generateEmail.sendMail(email, otp);
            return {
                status: 200,
                data: {
                    status: true,
                    message: "Verification otp sent to your email",
                },
            };
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const sEmail = String(email);
            const otpRecord = yield this.UserRepository.findOtpByEmail(sEmail);
            let data = {
                name: otpRecord.name,
                email: otpRecord.email,
                phone: otpRecord.phone,
                password: otpRecord.password,
            };
            const now = new Date().getTime();
            const otpGeneratedAt = new Date(otpRecord.otpGeneratedAt).getTime();
            const otpExpiration = 2 * 60 * 1000;
            if (now - otpGeneratedAt > otpExpiration) {
                yield this.UserRepository.deleteOtpByEmail(email);
                return { status: 400, message: "OTP has expired" };
            }
            if (otpRecord.otp !== otp) {
                return { status: 400, message: "Invalid OTP" };
            }
            yield this.UserRepository.deleteOtpByEmail(email);
            return { status: 200, message: "OTP verified successfully", data: data };
        });
    }
    verifyOtpUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user === null || user === void 0 ? void 0 : user.fromGoogle) {
                const hashedPassword = yield this.EncryptPassword.encryptPassword(user.password);
                const newUser = Object.assign(Object.assign({}, user), { password: hashedPassword });
                const userData = yield this.UserRepository.save(newUser);
                let data = {
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    isBlocked: userData.isBlocked,
                    isAdmin: userData.isAdmin,
                };
                const token = this.JwtToken.generateToken(userData._id, "user");
                return {
                    status: 200,
                    data: data,
                    token,
                };
            }
            const newUser = Object.assign({}, user);
            const userData = yield this.UserRepository.save(newUser);
            let data = {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                isBlocked: userData.isBlocked,
                isAdmin: userData.isAdmin,
            };
            yield this.UserRepository.deleteOtpByEmail(data.email);
            const token = this.JwtToken.generateToken(userData._id, "user");
            return {
                status: 200,
                data: data,
                message: "OTP verified successfully",
                token,
            };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserRepository.findByEmail(email);
            let token = "";
            if (user) {
                let data = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    isBlocked: user.isBlocked,
                    isAdmin: user.isAdmin,
                };
                if (user.isBlocked) {
                    return {
                        status: 403,
                        data: {
                            status: false,
                            message: "You have been blocked by admin!",
                            token: "",
                        },
                    };
                }
                const passwordMatch = yield this.EncryptPassword.compare(password, user.password);
                if (passwordMatch) {
                    token = this.JwtToken.generateToken(user._id, "user");
                    return {
                        status: 200,
                        data: {
                            status: true,
                            message: data,
                            token,
                        },
                    };
                }
                else {
                    return {
                        status: 400,
                        data: {
                            status: false,
                            message: "Invalid email or password",
                            token: "",
                        },
                    };
                }
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        message: "Invalid email or password",
                        token: "",
                    },
                };
            }
        });
    }
    resendOtp(email, name, phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = this.generateOtp.createOtp();
            const hashedPassword = yield this.EncryptPassword.encryptPassword(password);
            yield this.UserRepository.saveOtp(email, otp, name, phone, hashedPassword);
            this.generateEmail.sendMail(email, otp);
            return { status: 200, message: "Otp has been sent to your email" };
        });
    }
    resetPassword(password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield this.EncryptPassword.encryptPassword(password);
            const changePassword = yield this.UserRepository.changePassword(email, hashedPassword);
            if (changePassword) {
                return {
                    status: 200,
                    message: "Password changed successfully",
                };
            }
            else {
                return {
                    status: 400,
                    message: "Failed please try again !",
                };
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let userExist = yield this.UserRepository.findByEmail(email);
            if (userExist) {
                const otp = this.generateOtp.createOtp();
                yield this.UserRepository.saveOtp(email, otp);
                this.generateEmail.sendMail(email, otp);
                return {
                    status: 200,
                    data: {
                        status: true,
                        message: "Verification otp sent to your Email",
                        email: userExist.email,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    data: {
                        status: false,
                        message: "Email not registered!",
                    },
                };
            }
        });
    }
    resentOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = this.generateOtp.createOtp();
            yield this.UserRepository.saveOtp(email, otp);
            this.generateEmail.sendMail(email, otp);
            return { status: 200, message: "Otp has been sent to your email" };
        });
    }
    updatePassword(Id, newpassword, oldPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentPasswordHash = yield this.UserRepository.findPasswordById(Id);
            if (!currentPasswordHash) {
                return {
                    status: 404,
                    message: "User not found",
                };
            }
            const isPasswordValid = yield this.EncryptPassword.comparePassword(oldPassword, currentPasswordHash);
            if (!isPasswordValid) {
                return {
                    status: 201,
                    message: "Current password is incorrect",
                };
            }
            const hashedPassword = yield this.EncryptPassword.encryptPassword(newpassword);
            const changePassword = yield this.UserRepository.chnagePasswordById(Id, hashedPassword);
            if (changePassword) {
                return {
                    status: 200,
                    message: "Password changed successfully",
                };
            }
            else {
                return {
                    status: 400,
                    message: "Failed please try again !",
                };
            }
        });
    }
}
exports.default = UserRegisterUsecase;
