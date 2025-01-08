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
const Appointment_model_1 = __importDefault(require("../../database/Appointment-model"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET, {
    apiVersion: "2024-06-20",
});
class SPRepository {
    createPaymentSession(data) {
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
                    amount: data.amount,
                    paymentStatus: "pending",
                });
                yield appointment.save();
                // Create Stripe Payment Session
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: [
                        {
                            price_data: {
                                currency: "INR",
                                product_data: {
                                    name: "Doctor Appointment",
                                },
                                unit_amount: 50 * 100,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: "payment",
                    success_url: `http://localhost:5173//user/success?bookingId=${appointment._id}`,
                    cancel_url: "http://localhost:5173//user/cancel",
                });
                return session;
            }
            catch (error) {
                console.error("Error in createPaymentSession:", error);
                throw new Error("An error occurred while creating the payment session");
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
}
exports.default = SPRepository;
