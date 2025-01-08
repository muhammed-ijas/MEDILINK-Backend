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
const user_model_1 = __importDefault(require("../../database/user-model"));
const service_provider_model_1 = __importDefault(require("../../database/service-provider-model"));
class adminRepository {
    getUnVerifiedServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const services = yield service_provider_model_1.default.find({ isVerified: false }).lean();
            return { services };
        });
    }
    getAllServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const services = yield service_provider_model_1.default.find({})
                .populate({
                path: 'departments', // Populate the departments field
                populate: {
                    path: 'doctors', // Populate the doctors field inside each department
                    model: 'Doctor' // Specify the model name
                }
            })
                .lean();
            return { services };
        });
    }
    getVerifiedServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const services = yield service_provider_model_1.default.find({ isVerified: true })
                .populate({
                path: 'departments', // Populate the departments field
                populate: {
                    path: 'doctors', // Populate the doctors field inside each department
                    model: 'Doctor' // Specify the model name
                }
            })
                .lean();
            return { services };
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.default.find({ isAdmin: false })
                .lean();
            return { users };
        });
    }
    approvedService(serviceProviderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield service_provider_model_1.default.updateOne({ _id: serviceProviderId }, { $set: { isVerified: true } });
            return result;
        });
    }
    getServiceProviderById(serviceProviderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = yield service_provider_model_1.default.findOne({ _id: serviceProviderId });
            return service;
        });
    }
    updateUserBlockStatus(userId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findByIdAndUpdate(userId, { isBlocked });
        });
    }
}
exports.default = adminRepository;
