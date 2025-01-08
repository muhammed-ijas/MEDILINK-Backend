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
const Appointment_model_1 = __importDefault(require("../../database/Appointment-model"));
class SPRepository {
    findAppointmentsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointments = yield Appointment_model_1.default.find({ user: userId })
                    .populate("serviceProvider", "name , profileImage")
                    .populate("doctor", "name")
                    .populate("department", "name")
                    .sort({ createdAt: -1 })
                    .exec();
                return appointments;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAppointmentsBySPId(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointments = yield Appointment_model_1.default.find({
                    serviceProvider: spId,
                })
                    .populate("serviceProvider", "name profileImage")
                    .populate("doctor", "name")
                    .populate("department", "name")
                    .sort({ createdAt: -1 })
                    .exec();
                return appointments;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAppointmentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Appointment_model_1.default.findById(id);
        });
    }
    saveAppointment(appointment) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield appointment.save(); // This will update the existing appointment
        });
    }
    updateTimeSlotStatus(doctorId, bookingDate, timeSlotValue, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the doctor by ID
                const doctor = yield doctor_model_1.default.findById(doctorId).exec();
                if (!doctor)
                    throw new Error("Doctor not found");
                // Find the correct date and time slot
                const availableDate = doctor.availableDates.find((date) => date.date.toISOString().split("T")[0] ===
                    bookingDate.toISOString().split("T")[0]);
                if (!availableDate)
                    throw new Error("No available date found");
                const timeSlot = availableDate.timeSlots.find((slot) => slot.slot === timeSlotValue);
                if (!timeSlot)
                    throw new Error("No matching time slot found");
                // Update the time slot status to 'not occupied'
                if (timeSlot.status === "occupied") {
                    timeSlot.status = status; // Update status to 'not occupied'
                    timeSlot.user = null; // Remove the user from the time slot
                }
                yield doctor.save();
                return { message: "Time slot status updated successfully" };
            }
            catch (error) {
                throw new Error("Error updating time slot status");
            }
        });
    }
    getAppointmentDetails(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointments = yield Appointment_model_1.default.find({ doctor: spId })
                    .populate("serviceProvider", "name profileImage")
                    .populate("doctor", "name")
                    .populate("department", "name")
                    .sort({ createdAt: -1 })
                    .exec();
                return appointments;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAppointmentsAppointmentId(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointments = yield Appointment_model_1.default.find({ _id: appointmentId });
                if (appointments.length === 0) {
                    throw new Error("Appointment not found");
                }
                const appointment = appointments[0];
                const userId = appointment.user._id;
                const recentAppointments = yield Appointment_model_1.default.find({ user: userId })
                    .populate("serviceProvider", "name profileImage")
                    .populate("doctor", "name")
                    .populate("department", "name")
                    .sort({ createdAt: -1 })
                    .exec();
                return recentAppointments;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = SPRepository;
