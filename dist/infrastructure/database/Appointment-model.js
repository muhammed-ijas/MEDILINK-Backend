"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const medicationSchema = new mongoose_1.Schema({
    medication: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    route: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String, required: true },
    refills: { type: Number, default: 0 },
});
// Define the appointment schema
const appointmentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceProvider: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'SP',
        required: true
    },
    department: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    doctor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    bookingDate: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    patientAge: {
        type: Number,
        required: true,
    },
    patientEmail: {
        type: String,
        required: true,
    },
    patientPhone: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bookingStatus: {
        type: String,
        enum: ['pending', 'Approved', 'rejected', 'completed', 'cancelled'],
        default: 'pending',
    },
    qrCode: {
        type: String,
    },
    prescription: [medicationSchema],
});
const AppointmentModel = mongoose_1.default.model('Appointment', appointmentSchema);
exports.default = AppointmentModel;
