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
const emergency_model_1 = __importDefault(require("../../database/emergency-model"));
class SPRepository {
    findEmergencyNumber(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const EmergencyNumbers = yield emergency_model_1.default.find({
                    serviceProvider: spId,
                }).populate("serviceProvider", "name profileImage");
                return EmergencyNumbers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateEmergencyNumber(spId, emergencyNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingEmergencyNumber = yield emergency_model_1.default.findOne({
                    serviceProvider: spId,
                });
                if (existingEmergencyNumber) {
                    existingEmergencyNumber.emergencyNumber = emergencyNumber;
                    yield existingEmergencyNumber.save();
                    return existingEmergencyNumber;
                }
                else {
                    const newEmergencyNumber = yield emergency_model_1.default.create({
                        serviceProvider: spId,
                        emergencyNumber: emergencyNumber,
                    });
                    return newEmergencyNumber;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteEmergencyNumber(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedEmergencyNumber = yield emergency_model_1.default.findOneAndDelete({
                    serviceProvider: spId,
                });
                if (!deletedEmergencyNumber) {
                    throw new Error("Emergency number not found for the specified service provider.");
                }
                return deletedEmergencyNumber;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = SPRepository;
