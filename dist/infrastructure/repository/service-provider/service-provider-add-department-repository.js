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
class SPRepository {
    //saving provider details to database
    addDepartment(spId, departmentName, avgTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the department already exists for the given service provider
                const existingDepartment = yield department_model_1.default.findOne({
                    name: departmentName,
                    serviceProvider: spId,
                });
                if (existingDepartment) {
                    return { status: false, message: "Department already added" }; // Return a clear message
                }
                else {
                    // Create a new department
                    const department = new department_model_1.default({
                        name: departmentName,
                        serviceProvider: spId,
                    });
                    department.avgTime = avgTime;
                    yield department.save();
                    // Update the service provider with the new department
                    yield service_provider_model_1.default.findByIdAndUpdate(spId, { $push: { departments: department._id } }, { new: true });
                    return { status: true, message: "Department added successfully" }; // Successful addition
                }
            }
            catch (error) {
                console.error("Error in addDepartment:", error);
                throw new Error("Failed to add department");
            }
        });
    }
    getAllDoctorDetailsInsideADepartment(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const department = yield department_model_1.default.findById(departmentId)
                    .populate('doctors');
                if (!department) {
                    throw new Error('Department not found');
                }
                return department.doctors;
            }
            catch (error) {
                console.error('Error in addPrescriptionToAppointment:', error);
                throw error;
            }
        });
    }
    getDoctorSlotsDetails(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield doctor_model_1.default.findById(doctorId)
                    .populate({
                    path: 'availableDates.timeSlots.user',
                    model: 'User',
                    select: 'name email',
                })
                    .exec();
                return (doctor === null || doctor === void 0 ? void 0 : doctor.availableDates) || [];
            }
            catch (error) {
                console.error('Error in getDoctorSlotsDetails:', error);
                throw error;
            }
        });
    }
}
exports.default = SPRepository;
