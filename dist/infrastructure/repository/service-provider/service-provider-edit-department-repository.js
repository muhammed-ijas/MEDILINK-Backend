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
const department_model_1 = __importDefault(require("../../database/department-model"));
const doctor_model_1 = __importDefault(require("../../database/doctor-model"));
const moment_1 = __importDefault(require("moment"));
class SPRepository {
    //saving provider details to database
    editDepartment(spId, departmentId, name, doctors // Use the defined interface here
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update the department details
                const updatedDepartment = yield department_model_1.default.findByIdAndUpdate(departmentId, { name }, { new: true });
                if (!updatedDepartment) {
                    throw new Error("Department not found");
                }
                // Helper function to generate time slots for a single day
                function generateTimeSlots(from, to) {
                    const slots = [];
                    let current = (0, moment_1.default)(from, "HH:mm");
                    const end = (0, moment_1.default)(to, "HH:mm");
                    while (current < end) {
                        const next = (0, moment_1.default)(current).add(updatedDepartment.avgTime, "minutes");
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
                // Helper function to generate available dates and their time slots
                function generateAvailableDates(dateFrom, dateEnd, availableFrom, availableTo) {
                    const dates = [];
                    // Convert Date to string if needed
                    const startDate = (0, moment_1.default)(dateFrom instanceof Date ? dateFrom.toISOString() : dateFrom, "YYYY-MM-DD");
                    const endDate = (0, moment_1.default)(dateEnd instanceof Date ? dateEnd.toISOString() : dateEnd, "YYYY-MM-DD");
                    let currentDate = startDate;
                    while (currentDate <= endDate) {
                        const timeSlots = generateTimeSlots(availableFrom, availableTo);
                        dates.push({
                            date: currentDate.toDate(),
                            timeSlots,
                        });
                        currentDate = currentDate.add(1, "days");
                    }
                    return dates;
                }
                // Create a list of new doctors (those without _id)
                const newDoctors = doctors.filter((doctor) => !doctor._id);
                // Save new doctors and collect their IDs
                const addedDoctorsPromises = newDoctors.map((doctor) => __awaiter(this, void 0, void 0, function* () {
                    const availableDates = generateAvailableDates(doctor.dateFrom, doctor.dateEnd, doctor.availableFrom, doctor.availableTo);
                    return new doctor_model_1.default(Object.assign(Object.assign({}, doctor), { department: departmentId, availableDates })).save();
                }));
                const addedDoctors = yield Promise.all(addedDoctorsPromises);
                // Collect the IDs of the new doctors
                const newDoctorIds = addedDoctors.map((doctor) => doctor._id);
                // Existing doctor IDs for update and removal
                const existingDoctorIds = updatedDepartment.doctors.map((doc) => doc.toString());
                // Process existing doctors
                const existingDoctors = doctors.filter((doctor) => doctor._id);
                for (const doctor of existingDoctors) {
                    // Check if available dates or slots were edited
                    const availableDates = generateAvailableDates(doctor.dateFrom, doctor.dateEnd, doctor.availableFrom, doctor.availableTo);
                    // Update the doctor with new available dates and time slots
                    yield doctor_model_1.default.findByIdAndUpdate(doctor._id, Object.assign(Object.assign({}, doctor), { department: departmentId, // Ensure the department field is updated as well
                        availableDates }), { new: true });
                }
                // Collect IDs of doctors to be removed
                const doctorIdsToRemove = existingDoctorIds.filter((id) => !doctors.some((doctor) => doctor._id && doctor._id.toString() === id));
                // IDs of doctors that should stay
                const doctorIdsToStay = existingDoctorIds.filter((id) => doctors.some((doctor) => doctor._id && doctor._id.toString() === id));
                // Remove doctors that are no longer in the list
                yield doctor_model_1.default.deleteMany({ _id: { $in: doctorIdsToRemove } }).exec();
                // Update the department's doctors field with new and existing doctor IDs
                const allDoctorIds = [...doctorIdsToStay, ...newDoctorIds];
                yield department_model_1.default.findByIdAndUpdate(departmentId, {
                    $set: { doctors: allDoctorIds },
                }).exec();
                // Fetch the updated department with populated doctors
                const departmentWithDoctors = yield department_model_1.default.findById(departmentId)
                    .populate("doctors")
                    .exec();
                return { department: departmentWithDoctors, doctors: [...addedDoctors], };
            }
            catch (error) {
                console.error("Error in editDepartment:", error);
                return null;
            }
        });
    }
}
exports.default = SPRepository;
