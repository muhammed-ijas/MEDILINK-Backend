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
const Appointment_model_1 = __importDefault(require("../../database/Appointment-model"));
class SPRepository {
    addPrescriptionToAppointment(appointmentId, prescription) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointment = yield Appointment_model_1.default.findById(appointmentId);
                if (!appointment) {
                    throw new Error('Appointment not found');
                }
                if (appointment.prescription && appointment.prescription.length > 0) {
                    appointment.prescription = prescription.medications; // Replace the old prescription with the new one
                }
                else {
                    appointment.prescription = prescription.medications;
                }
                yield appointment.save();
                return appointment;
            }
            catch (error) {
                console.error('Error in addPrescriptionToAppointment:', error);
                throw error;
            }
        });
    }
    getPrescription(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointment = yield Appointment_model_1.default.findById(appointmentId);
                if (!appointment) {
                    throw new Error('Appointment not found');
                }
                return appointment.prescription;
            }
            catch (error) {
                console.error('Error in addPrescriptionToAppointment:', error);
                throw error;
            }
        });
    }
}
exports.default = SPRepository;
