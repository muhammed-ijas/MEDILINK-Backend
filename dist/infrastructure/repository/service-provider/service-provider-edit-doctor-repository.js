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
const doctor_model_1 = __importDefault(require("../../database/doctor-model"));
class SPRepository {
    //saving provider details to database
    updateDoctorDetails(doctorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { doctorId, name, specialization, yearsOfExperience, contact, doctorProfileImage, validCertificate } = doctorData;
                // Find doctor by ID and update the details
                const updatedDoctor = yield doctor_model_1.default.findByIdAndUpdate(doctorId, // Filter by doctor ID
                {
                    name,
                    specialization,
                    yearsOfExperience,
                    contact,
                    doctorProfileImage,
                    validCertificate
                }, { new: true, useFindAndModify: false } // Return the updated document
                );
                if (!updatedDoctor) {
                    throw new Error('Doctor not found');
                }
                return updatedDoctor;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = SPRepository;
