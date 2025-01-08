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
const service_provider_model_1 = __importDefault(require("../../database/service-provider-model"));
const service_provider_otp_model_1 = __importDefault(require("../../database/service-provider-otp-model"));
class SPRepository {
    //saving provider details to database
    save(sp) {
        return __awaiter(this, void 0, void 0, function* () {
            const newSP = new service_provider_model_1.default(sp);
            const savedSP = yield newSP.save();
            return savedSP;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const spData = yield service_provider_model_1.default.findOne({ email: email });
            return spData;
        });
    }
    findById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const spData = yield service_provider_model_1.default.findById(_id);
            return spData;
        });
    }
    saveOtp(email, otp, name, phone, password, area, city, latitude, longitude, state, pincode, district) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpDoc = new service_provider_otp_model_1.default({
                name: name,
                email: email,
                phone: phone,
                password: password,
                area: area,
                city: city,
                latitude: latitude,
                longitude: longitude,
                state: state,
                pincode: pincode,
                district: district,
                otp: otp,
                otpGeneratedAt: new Date(),
            });
            const savedDoc = yield otpDoc.save();
            return savedDoc;
        });
    }
    findOtpByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpRecord = yield service_provider_otp_model_1.default.findOne({ email })
                    .sort({ otpGeneratedAt: -1 })
                    .exec();
                return otpRecord;
            }
            catch (error) {
                console.error("Error fetching OTP record:", error);
                throw error;
            }
        });
    }
    deleteOtpByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return service_provider_otp_model_1.default.deleteOne({ email });
        });
    }
    findPasswordById(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sp = yield service_provider_model_1.default.findOne({ _id: Id });
                return sp === null || sp === void 0 ? void 0 : sp.password;
            }
            catch (error) {
                throw error;
            }
        });
    }
    changePasswordById(Id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield service_provider_model_1.default.updateOne({ _id: Id }, { $set: { password: password } });
            return result.modifiedCount > 0;
        });
    }
}
exports.default = SPRepository;
