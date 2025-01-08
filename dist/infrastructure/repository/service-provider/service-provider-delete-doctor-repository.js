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
const send_email_1 = __importDefault(require("../../services/send-email"));
const Appointment_model_1 = __importDefault(require("../../database/Appointment-model"));
class SPRepository {
    //saving provider details to database
    deleteDoctor(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find the doctor
                const doctor = yield doctor_model_1.default.findById(doctorId);
                if (!doctor) {
                    throw new Error("Doctor not found");
                }
                //remove the doctor from  department model
                yield department_model_1.default.findByIdAndUpdate(doctor.department, { $pull: { doctors: doctorId } }, { new: true });
                // Step 3: Check the doctor's time slots and cancel appointments if necessary
                const currentDate = new Date();
                const canceledAppointments = []; // Explicitly define the type as string[]
                for (const availableDate of doctor.availableDates) {
                    for (const timeSlot of availableDate.timeSlots) {
                        // If the time slot is occupied
                        if (timeSlot.status === 'occupied' && timeSlot.user) {
                            const appointments = yield Appointment_model_1.default.updateMany({
                                user: timeSlot.user,
                                doctor: doctorId,
                                bookingDate: { $gte: currentDate }, // Only update future appointments
                                bookingStatus: { $ne: 'cancelled' } // Exclude already cancelled appointments
                            }, { $set: { bookingStatus: 'cancelled' } } // Update status to cancelled
                            );
                            // Collect user email for notifications
                            if (appointments.modifiedCount > 0) {
                                const userEmail = timeSlot.user.email; // Ensure timeSlot.user has an email property
                                canceledAppointments.push(userEmail); // No need to cast to string
                            }
                        }
                    }
                }
                // Step 5: Delete the doctor
                yield doctor_model_1.default.findByIdAndUpdate(doctorId, { isDeleted: true });
                // Step 6: Send cancellation emails
                const emailService = new send_email_1.default(); // Create an instance of your email service
                canceledAppointments.forEach(email => {
                    emailService.sendCancellation(email, 'The doctor you had an appointment with has been deleted.');
                });
                return { message: "Doctor deleted successfully and cancellation emails sent." };
            }
            catch (error) {
                console.error('Error in deleteDoctor:', error);
                throw error;
            }
        });
    }
}
exports.default = SPRepository;
