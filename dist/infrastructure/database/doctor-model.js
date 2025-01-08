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
// Updated TimeSlot schema with a user reference
const timeSlotSchema = new mongoose_1.Schema({
    slot: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['occupied', 'not occupied'],
        default: 'not occupied',
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
            return this.status === 'occupied';
        },
    },
}); // Prevents creating an additional `_id` for each time slot
// Schema for available dates
const availableDateSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: true,
    },
    timeSlots: [timeSlotSchema], // Each date has an array of time slots
});
// Reuse the rating schema
const ratingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
// Doctor schema
const doctorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    availableFrom: {
        type: String,
        required: true,
    },
    availableTo: {
        type: String,
        required: true,
    },
    department: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    dateFrom: {
        type: Date,
        required: true,
    },
    dateEnd: {
        type: Date,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    availableDates: [availableDateSchema], // Array of available dates with time slots
    ratings: [ratingSchema], // Add the ratings array here
    doctorProfileImage: {
        type: String,
        required: true,
    },
    yearsOfExperience: {
        type: String,
        required: true,
    },
    validCertificate: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
});
// Create the Doctor model
const DoctorModel = mongoose_1.default.model("Doctor", doctorSchema);
exports.default = DoctorModel;
