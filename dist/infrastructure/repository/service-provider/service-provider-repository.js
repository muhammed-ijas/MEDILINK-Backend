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
const department_model_1 = __importDefault(require("../../database/department-model"));
const doctor_model_1 = __importDefault(require("../../database/doctor-model"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET, {
    apiVersion: "2024-06-20",
});
class SPRepository {
    //saving provider details to database
    getAllServiceDetails(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departments = yield department_model_1.default.find({ serviceProvider: spId })
                    .populate("doctors")
                    .exec();
                return departments;
            }
            catch (error) {
                console.error("Error in getAllServiceDetails:", error);
                return null;
            }
        });
    }
    findHospitalClinicById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_provider_model_1.default.findById({ _id: id }).populate("departments");
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findDepartmentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield department_model_1.default.findById({ _id: id }).populate({
                    path: "doctors",
                    populate: {
                        path: "availableDates", // Populate availableDates with time slots
                    },
                });
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDoctorDetailsFromSearchPage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield doctor_model_1.default.findById(id)
                    .populate({
                    path: "availableDates",
                    populate: {
                        path: "timeSlots",
                    },
                })
                    .populate("department");
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findHomeNurseById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_provider_model_1.default.findById({ _id: id });
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAmbulanceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield service_provider_model_1.default.findById({ _id: id });
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findDoctorById(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield doctor_model_1.default.findById(doctorId);
                return doctor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    isDoctorHaveSlots(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield doctor_model_1.default.findById(doctorId)
                    .populate({
                    path: 'availableDates.timeSlots.user',
                    model: 'User',
                    select: 'name email',
                })
                    .exec();
                // Check if doctor has future available dates
                if (doctor && doctor.availableDates) {
                    const currentDate = new Date();
                    // Check for any future dates
                    const hasFutureDates = doctor.availableDates.some((date) => {
                        return new Date(date.date) > currentDate; // Check if any date is in the future
                    });
                    return hasFutureDates; // Return true if there are future dates, otherwise false
                }
                return false; // Return false if no doctor found or no available dates
            }
            catch (error) {
                console.error('Error in isDoctorHaveSlots:', error);
                throw error;
            }
        });
    }
}
exports.default = SPRepository;
