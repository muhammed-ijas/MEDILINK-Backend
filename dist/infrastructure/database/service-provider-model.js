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
const spSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: false,
    },
    district: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: '',
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    openingTime: {
        type: String,
        default: "09:00",
        required: true,
    },
    closingTime: {
        type: String,
        default: "17:00",
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true,
    },
    serviceType: {
        type: String,
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    departments: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Department'
        }],
    firstDocumentImage: {
        type: String
    },
    secondDocumentImage: {
        type: String
    },
    ratings: [ratingSchema], //for ratings 
    wallet: [
        {
            appointmentId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Appointment",
            },
            date: {
                type: Date,
            },
            amount: {
                type: Number,
            },
        },
    ],
});
const SPModel = mongoose_1.default.model("SP", spSchema);
spSchema.index({ location: '2dsphere' });
exports.default = SPModel;
