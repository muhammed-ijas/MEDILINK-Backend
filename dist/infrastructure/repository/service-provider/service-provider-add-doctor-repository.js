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
const moment_1 = __importDefault(require("moment"));
class SPRepository {
    //saving provider details to database
    addDoctorToDepartment(spId, departmentId, doctors) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the department already exists for the given service provider
                const existingDepartment = yield department_model_1.default.findOne({
                    _id: departmentId,
                    serviceProvider: spId,
                });
                const avgTime = existingDepartment.avgTime;
                // Function to generate time slots for a single day
                function generateTimeSlots(from, to) {
                    const slots = [];
                    let current = (0, moment_1.default)(from, "HH:mm");
                    const end = (0, moment_1.default)(to, "HH:mm");
                    while (current < end) {
                        const next = (0, moment_1.default)(current).add(existingDepartment.avgTime, "minutes");
                        if (next > end)
                            break;
                        slots.push({
                            slot: `${current.format("HH:mm")} - ${next.format("HH:mm")}`,
                            status: "not occupied",
                        });
                        current = next;
                    }
                    return slots;
                }
                function generateAvailableDates(dateFrom, dateEnd, availableFrom, availableTo) {
                    const dates = [];
                    const startDate = (0, moment_1.default)(dateFrom, "YYYY-MM-DD");
                    const endDate = (0, moment_1.default)(dateEnd, "YYYY-MM-DD");
                    let currentDate = startDate;
                    // Loop through each date in the range and generate time slots
                    while (currentDate <= endDate) {
                        const timeSlots = generateTimeSlots(availableFrom, availableTo);
                        dates.push({
                            date: currentDate.toDate(),
                            timeSlots,
                        });
                        currentDate = currentDate.add(1, "days"); // Move to the next day
                    }
                    return dates;
                }
                const createDoctor = (doctor, departmentId) => __awaiter(this, void 0, void 0, function* () {
                    // Generate available dates with time slots for each doctor
                    const availableDates = generateAvailableDates(doctor.dateFrom, doctor.dateEnd, doctor.availableFrom, doctor.availableTo);
                    return new doctor_model_1.default(Object.assign(Object.assign({}, doctor), { department: departmentId, availableDates })).save();
                });
                if (existingDepartment) {
                    // Add doctors to the existing department
                    const doctorDocs = yield Promise.all(doctors.map((doctor) => createDoctor(doctor, existingDepartment._id)));
                    // Update the existing department with the new doctors
                    existingDepartment.doctors.push(...doctorDocs.map((doc) => doc._id));
                    yield existingDepartment.save();
                    return true;
                }
                else {
                    // Create a new department
                    const department = new department_model_1.default({
                        _id: departmentId,
                        serviceProvider: spId,
                    });
                    yield department.save();
                    // Add doctors to the new department
                    const doctorDocs = yield Promise.all(doctors.map((doctor) => createDoctor(doctor, department._id)));
                    department.doctors = doctorDocs.map((doc) => doc._id);
                    department.avgTime = avgTime;
                    yield department.save();
                    // Update the service provider with the new department
                    yield service_provider_model_1.default.findByIdAndUpdate(spId, { $push: { departments: department._id } }, { new: true });
                    return true;
                }
            }
            catch (error) {
                console.error("Error in addDepartment:", error);
                return false;
            }
        });
    }
}
exports.default = SPRepository;
