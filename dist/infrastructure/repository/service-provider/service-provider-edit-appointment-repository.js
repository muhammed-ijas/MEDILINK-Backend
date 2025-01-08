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
const user_model_1 = __importDefault(require("../../database/user-model"));
const doctor_model_1 = __importDefault(require("../../database/doctor-model"));
const qrcode_1 = __importDefault(require("qrcode"));
const Appointment_model_1 = __importDefault(require("../../database/Appointment-model"));
class SPRepository {
    updateBookingStatus(bookingId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield Appointment_model_1.default.findById(bookingId).exec();
                if (!booking)
                    throw new Error("Booking not found");
                booking.paymentStatus = status;
                const serviceProvider = yield service_provider_model_1.default.findById(booking.serviceProvider).exec();
                ``;
                const department = yield department_model_1.default.findById(booking.department).exec();
                const doctorr = yield doctor_model_1.default.findById(booking.doctor).exec();
                if (!serviceProvider || !department || !doctorr)
                    throw new Error("Related data not found");
                // Format the QR code content with all the details
                const qrCodeContent = `
      MEDILINK Appointment
      
      Service Provider: ${booking.serviceProvider.name}
      Department: ${booking.department.name}
      Doctor: ${booking.doctor.name}
      
      Appointment Date: ${booking.bookingDate.toLocaleDateString()}
      Time Slot: ${booking.timeSlot}
      
      Patient Details:
        Name: ${booking.patientName}
        Age: ${booking.patientAge}
        Email: ${booking.patientEmail}
        Phone: ${booking.patientPhone}
      
      Booking ID: ${booking._id}
      `.trim();
                const qrCodeData = yield qrcode_1.default.toDataURL(qrCodeContent);
                booking.qrCode = qrCodeData;
                yield booking.save();
                const doctor = yield doctor_model_1.default.findById(booking.doctor).exec();
                if (!doctor)
                    throw new Error("Doctor not found");
                // Find the correct date and time slot
                const availableDate = doctor.availableDates.find((date) => date.date.toISOString().split("T")[0] ===
                    booking.bookingDate.toISOString().split("T")[0]);
                if (!availableDate)
                    throw new Error("No available date found");
                const timeSlot = availableDate === null || availableDate === void 0 ? void 0 : availableDate.timeSlots.find((slot) => slot.slot === booking.timeSlot);
                if (!timeSlot)
                    throw new Error("No matching time slot found");
                if (timeSlot.status === "not occupied") {
                    timeSlot.status = "occupied";
                    timeSlot.user = booking.user;
                }
                yield doctor.save();
                return { message: "Booking and time slot status updated successfully" };
            }
            catch (error) {
                throw new Error("Error updating booking status and time slot");
            }
        });
    }
    approveAppointment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Appointment_model_1.default.findByIdAndUpdate(id, { bookingStatus: "approved" }, { new: true });
        });
    }
    completeAppointment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Appointment_model_1.default.findByIdAndUpdate(id, { bookingStatus: "completed" }, { new: true });
        });
    }
    updateAppointmentStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the appointment to get the user ID
            const appointment = yield Appointment_model_1.default.findById(id).select('user');
            if (!appointment) {
                throw new Error('Appointment not found');
            }
            const userId = appointment.user; // Get the user ID from the appointment
            // Update the appointment status
            const updatedAppointment = yield Appointment_model_1.default.findByIdAndUpdate(id, { bookingStatus: status }, { new: true } // This option returns the updated document
            );
            // If the appointment is cancelled, add 50 to the user's wallet
            if (status === 'cancelled') {
                const walletEntry = {
                    appointmentId: id,
                    date: new Date(), // current date
                    amount: 50, // refund amount
                    isPlus: true,
                };
                // Check if the user already has a wallet
                const userWallet = yield user_model_1.default.findOne({ _id: userId }).select('wallet');
                if (userWallet) {
                    // User has a wallet, add the new wallet entry
                    yield user_model_1.default.updateOne({ _id: userId }, { $push: { wallet: walletEntry } } // Push the new wallet entry
                    );
                }
                else {
                    // User does not have a wallet, create a new one
                    yield user_model_1.default.updateOne({ _id: userId }, { $set: { wallet: [walletEntry] } } // Create a new wallet with the entry
                    );
                }
            }
            return updatedAppointment;
        });
    }
}
exports.default = SPRepository;
