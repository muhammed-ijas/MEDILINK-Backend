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
class SPRepository {
    //saving provider details to database
    findPaginatedHospitals(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield service_provider_model_1.default.find({
                    isVerified: true,
                    serviceType: "hospital",
                    name: new RegExp(search, "i"),
                })
                    .skip((page - 1) * limit)
                    .limit(limit);
            }
            catch (error) {
                throw error;
            }
        });
    }
    countHospitals(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield service_provider_model_1.default.countDocuments({
                    isVerified: true,
                    serviceType: "hospital",
                    name: new RegExp(search, "i"),
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findPaginatedClinicks(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield service_provider_model_1.default.find({
                    isVerified: true,
                    serviceType: "clinic",
                    name: new RegExp(search, "i"),
                })
                    .skip((page - 1) * limit)
                    .limit(limit);
            }
            catch (error) {
                throw error;
            }
        });
    }
    countClinicks(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield service_provider_model_1.default.countDocuments({
                    isVerified: true,
                    serviceType: "clinic",
                    name: new RegExp(search, "i"),
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findPaginatedAmbulances(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield service_provider_model_1.default.find({
                    isVerified: true,
                    serviceType: "ambulance",
                    name: new RegExp(search, "i"),
                })
                    .skip((page - 1) * limit)
                    .limit(limit);
            }
            catch (error) {
                throw error;
            }
        });
    }
    countAmbulances(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield service_provider_model_1.default.countDocuments({
                    isVerified: true,
                    serviceType: "ambulance",
                    name: new RegExp(search, "i"),
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findPaginatedHomeNurses(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield service_provider_model_1.default.find({
                    isVerified: true,
                    serviceType: "homeNurse",
                    name: new RegExp(search, "i"),
                })
                    .skip((page - 1) * limit)
                    .limit(limit);
            }
            catch (error) {
                throw error;
            }
        });
    }
    countHomeNurses(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield service_provider_model_1.default.countDocuments({
                    isVerified: true,
                    serviceType: "homeNurse",
                    name: new RegExp(search, "i"),
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = SPRepository;
