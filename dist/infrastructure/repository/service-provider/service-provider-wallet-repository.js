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
    confirmWalletPayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate required fields
            if (!data.userInfo ||
                !data.doctorId ||
                !data.bookingDate ||
                !data.timeSlot ||
                !data.patientName ||
                !data.patientAge ||
                !data.patientEmail ||
                !data.patientPhone ||
                !data.amount) {
                throw new Error("Missing required fields");
            }
            try {
                // Fetch the doctor based on doctorId
                const doctor = yield doctor_model_1.default.findById(data.doctorId).exec();
                if (!doctor)
                    throw new Error("Doctor not found");
                // Fetch the department based on doctor.department
                const department = yield department_model_1.default.findById(doctor.department).exec();
                if (!department)
                    throw new Error("Department not found");
                // Fetch the service provider based on department.serviceProvider
                const serviceProvider = yield service_provider_model_1.default.findById(department.serviceProvider).exec();
                if (!serviceProvider)
                    throw new Error("Service Provider not found");
                // Create a new appointment with status "pending"
                const appointment = new Appointment_model_1.default({
                    user: data.userInfo._id,
                    serviceProvider: serviceProvider._id,
                    department: department._id,
                    doctor: doctor._id,
                    bookingDate: new Date(data.bookingDate),
                    timeSlot: data.timeSlot,
                    patientName: data.patientName,
                    patientAge: data.patientAge,
                    patientEmail: data.patientEmail,
                    patientPhone: data.patientPhone,
                    amount: 50,
                    paymentStatus: "completed", // Change status to confirmed
                });
                yield appointment.save(); // Save the appointment
                // Update the user's wallet
                const user = yield user_model_1.default.findById(data.userInfo._id).exec();
                if (!user)
                    throw new Error("User not found");
                // Deduct amount from wallet
                user.wallet.push({
                    appointmentId: appointment._id,
                    date: new Date(), // Current date
                    amount: 50, // Use the amount passed from data
                    isPlus: false, // Mark as a deduction
                });
                yield user.save(); // Save the updated user
                // Update doctor's availability
                const availableDate = doctor.availableDates.find((date) => date.date.toISOString().split("T")[0] ===
                    appointment.bookingDate.toISOString().split("T")[0]);
                if (!availableDate)
                    throw new Error("No available date found");
                const timeSlot = availableDate === null || availableDate === void 0 ? void 0 : availableDate.timeSlots.find((slot) => slot.slot === appointment.timeSlot);
                if (!timeSlot)
                    throw new Error("No matching time slot found");
                if (timeSlot.status === "not occupied") {
                    timeSlot.status = "occupied";
                    timeSlot.user = appointment.user;
                }
                yield doctor.save(); // Save updated doctor's availability
                // Generate QR code for appointment details
                const qrCodeContent = `
        MEDILINK Appointment
        
        Service Provider: ${serviceProvider.name}
        Department: ${department.name}
        Doctor: ${doctor.name}
        
        Appointment Date: ${appointment.bookingDate.toLocaleDateString()}
        Time Slot: ${appointment.timeSlot}
        
        Patient Details:
          Name: ${appointment.patientName}
          Age: ${appointment.patientAge}
          Email: ${appointment.patientEmail}
          Phone: ${appointment.patientPhone}
        
        Booking ID: ${appointment._id}
      `.trim();
                const qrCodeData = yield qrcode_1.default.toDataURL(qrCodeContent);
                appointment.qrCode = qrCodeData; // Save QR code in appointment
                yield appointment.save(); // Save appointment with QR code
                return { message: "Appointment created successfully", appointmentId: appointment._id, qrCode: qrCodeData };
            }
            catch (error) {
                console.error('Error in confirmWalletPayment:', error);
                throw new Error("An error occurred while confirming the wallet payment");
            }
        });
    }
}
exports.default = SPRepository;
