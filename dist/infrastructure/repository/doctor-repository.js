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
const doctor_model_1 = __importDefault(require("../database/doctor-model"));
class DoctorRepository {
    findPaginated(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield doctor_model_1.default.find({
                    name: new RegExp(search, 'i'), // Case-insensitive search
                    $or: [
                        { isDeleted: { $exists: false } }, // Doctors without the isDeleted field
                        { isDeleted: false } // Doctors with isDeleted set to false
                    ]
                })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('department');
            }
            catch (error) {
                throw error;
            }
        });
    }
    count(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield doctor_model_1.default.countDocuments({
                    name: new RegExp(search, 'i'), // Case-insensitive search
                    $or: [
                        { isDeleted: { $exists: false } }, // Doctors without the isDeleted field
                        { isDeleted: false } // Doctors with isDeleted set to false
                    ]
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findDoctorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield doctor_model_1.default.findById({ _id: id }).populate('department');
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = DoctorRepository;
