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
class SPUseCase {
    constructor(SPRegistrationRepository, encryptPassword, jwtToken, generateOtp, generateEmail) {
        this.SPRegistrationRepository = SPRegistrationRepository;
        this.EncryptPassword = encryptPassword;
        this.JwtToken = jwtToken;
        this.generateOtp = generateOtp;
        this.generateEmail = generateEmail;
    }
    checkExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield this.SPRegistrationRepository.findByEmail(email);
            if (userExist) {
                return { status: 400, data: { status: false, message: "Already exists", },
                };
            }
            else {
                return { status: 200, data: { status: true, message: "does not exist", },
                };
            }
        });
    }
    signup(email, name, phone, password, area, city, latitude, longitude, state, pincode, district) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = this.generateOtp.createOtp();
            const hashedPassword = yield this.EncryptPassword.encryptPassword(password);
            yield this.SPRegistrationRepository.saveOtp(email, otp, name, phone, hashedPassword, area, city, latitude, longitude, state, pincode, district);
            this.generateEmail.sendMail(email, otp);
            return { status: 200, data: { status: true, message: "Verification otp sent to your email", }, };
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const sEmail = String(email);
            const otpRecord = yield this.SPRegistrationRepository.findOtpByEmail(sEmail);
            let data = {
                name: otpRecord.name,
                email: otpRecord.email,
                phone: otpRecord.phone,
                password: otpRecord.password,
                area: otpRecord.area,
                city: otpRecord.city,
                latitude: otpRecord.latitude,
                longitude: otpRecord.longitude,
                state: otpRecord.state,
                pincode: otpRecord.pincode,
                district: otpRecord.district,
            };
            const now = new Date().getTime();
            const otpGeneratedAt = new Date(otpRecord.otpGeneratedAt).getTime();
            const otpExpiration = 2 * 60 * 1000;
            if (now - otpGeneratedAt > otpExpiration) {
                yield this.SPRegistrationRepository.deleteOtpByEmail(email);
                return { status: 400, message: "OTP has expired" };
            }
            if (otpRecord.otp !== otp) {
                return { status: 400, message: "Invalid OTP" };
            }
            yield this.SPRegistrationRepository.deleteOtpByEmail(email);
            return { status: 200, message: "OTP verified successfully", data: data };
        });
    }
    verifyOtpSP(sp) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = Object.assign({}, sp);
            const spData = yield this.SPRegistrationRepository.save(newUser);
            let data = {
                _id: spData._id,
                name: spData.name,
                email: spData.email,
                phone: spData.phone,
                area: spData.area,
                city: spData.city,
                latitude: spData.latitude,
                longitude: spData.longitude,
                state: spData.state,
                pincode: spData.pincode,
                district: spData.district,
                isVerified: spData.isVerified,
                isBlocked: spData.isBlocked,
            };
            yield this.SPRegistrationRepository.deleteOtpByEmail(data.email);
            const token = this.JwtToken.generateToken(spData._id, "sp");
            return { status: 200, data: data, message: "OTP verified successfully", token, };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const spData = yield this.SPRegistrationRepository.findByEmail(email);
            let token = "";
            if (spData) {
                let data = {
                    _id: spData._id,
                    name: spData.name,
                    email: spData.email,
                    phone: spData.phone,
                    area: spData.area,
                    city: spData.city,
                    latitude: spData.latitude,
                    longitude: spData.longitude,
                    state: spData.state,
                    pincode: spData.pincode,
                    district: spData.district,
                    isVerified: spData.isVerified,
                    isBlocked: spData.isBlocked,
                    firstDocumentImage: spData.firstDocumentImage,
                    secondDocumentImage: spData.secondDocumentImage,
                    serviceType: spData.serviceType,
                };
                const passwordMatch = yield this.EncryptPassword.compare(password, spData.password);
                if (passwordMatch) {
                    token = this.JwtToken.generateToken(spData._id, "user");
                    return { status: 200, data: { status: true, message: data, token, }, };
                }
                else {
                    return { status: 400, data: { status: false, message: "Invalid email or password", token: "", }, };
                }
            }
            else {
                return { status: 400, data: { status: false, message: "Invalid email or password", token: "", }, };
            }
        });
    }
    resendOtp(email, name, phone, password, area, city, latitude, longitude, state, pincode, district) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = this.generateOtp.createOtp();
            const hashedPassword = yield this.EncryptPassword.encryptPassword(password);
            yield this.SPRegistrationRepository.saveOtp(email, otp, name, phone, hashedPassword, area, city, latitude, longitude, state, pincode, district);
            this.generateEmail.sendMail(email, otp);
            return { status: 200, message: "Otp has been sent to your email" };
        });
    }
    getProfile(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this.SPRegistrationRepository.findById(Id);
            let data = {
                _id: profile === null || profile === void 0 ? void 0 : profile._id,
                name: profile === null || profile === void 0 ? void 0 : profile.name,
                email: profile === null || profile === void 0 ? void 0 : profile.email,
                phone: profile === null || profile === void 0 ? void 0 : profile.phone,
                isBlocked: profile === null || profile === void 0 ? void 0 : profile.isBlocked,
                area: profile === null || profile === void 0 ? void 0 : profile.area,
                city: profile === null || profile === void 0 ? void 0 : profile.city,
                state: profile === null || profile === void 0 ? void 0 : profile.state,
                pincode: profile === null || profile === void 0 ? void 0 : profile.pincode,
                district: profile === null || profile === void 0 ? void 0 : profile.district,
                latitude: profile === null || profile === void 0 ? void 0 : profile.latitude,
                longitude: profile === null || profile === void 0 ? void 0 : profile.longitude,
                isVerified: profile === null || profile === void 0 ? void 0 : profile.isVerified,
                closingTime: profile === null || profile === void 0 ? void 0 : profile.closingTime,
                openingTime: profile === null || profile === void 0 ? void 0 : profile.openingTime,
                profileImage: profile === null || profile === void 0 ? void 0 : profile.profileImage,
                serviceType: profile === null || profile === void 0 ? void 0 : profile.serviceType,
                firstDocumentImage: profile === null || profile === void 0 ? void 0 : profile.firstDocumentImage,
                secondDocumentImage: profile === null || profile === void 0 ? void 0 : profile.secondDocumentImage,
                departments: profile === null || profile === void 0 ? void 0 : profile.departments,
            };
            return { status: 200, data: data, };
        });
    }
    updatePassword(Id, newpassword, oldPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentPasswordHash = yield this.SPRegistrationRepository.findPasswordById(Id);
            if (!currentPasswordHash) {
                return { status: 404, message: "User not found", };
            }
            const isPasswordValid = yield this.EncryptPassword.comparePassword(oldPassword, currentPasswordHash);
            if (!isPasswordValid) {
                return { status: 400, message: "Current password is incorrect", };
            }
            const hashedPassword = yield this.EncryptPassword.encryptPassword(newpassword);
            const changePassword = yield this.SPRegistrationRepository.changePasswordById(Id, hashedPassword);
            if (changePassword) {
                return { status: 200, message: "Password changed successfully", };
            }
            else {
                return { status: 400, message: "Failed please try again !", };
            }
        });
    }
}
exports.default = SPUseCase;
