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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class SPUseCase {
    constructor(SPRepository, SPAppointmentRepository, generateEmail, SPEditAppointmentRepository, SPEmergencyRepository, SPPrescriptionRepository) {
        this.SPRepository = SPRepository;
        this.SPAppointmentRepository = SPAppointmentRepository;
        this.generateEmail = generateEmail;
        this.SPEditAppointmentRepository = SPEditAppointmentRepository;
        this.SPEmergencyRepository = SPEmergencyRepository;
        this.SPPrescriptionRepository = SPPrescriptionRepository;
    }
    getFullAppointmentList(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointments = yield this.SPAppointmentRepository.findAppointmentsBySPId(spId);
                return appointments;
            }
            catch (error) {
                throw error;
            }
        });
    }
    approveAppointment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointment = yield this.SPEditAppointmentRepository.approveAppointment(id);
            if (!appointment)
                throw new mongoose_1.Error("Appointment not found or already approved");
            return appointment;
        });
    }
    completeAppointment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointment = yield this.SPEditAppointmentRepository.completeAppointment(id);
            if (!appointment)
                throw new mongoose_1.Error("Appointment not found or already completed");
            return appointment;
        });
    }
    cancelAppointment(id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointment = yield this.SPAppointmentRepository.findAppointmentById(id);
            if (!appointment) {
                throw new mongoose_1.Error("Appointment not found");
            }
            if (appointment.bookingStatus === "cancelled") {
                throw new mongoose_1.Error("Already cancelled");
            }
            yield this.SPEditAppointmentRepository.updateAppointmentStatus(id, "cancelled");
            // Update the time slot status to 'not occupied'
            yield this.SPAppointmentRepository.updateTimeSlotStatus(appointment.doctor, appointment.bookingDate, appointment.timeSlot, "not occupied");
            this.generateEmail.sendCancellation(appointment.patientEmail, reason);
            return {
                status: 200,
                data: {
                    status: true,
                    message: "Appointment cancelled and notification sent to the patient",
                },
            };
        });
    }
    getEmergencyNumber(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const EmergencyNumbers = yield this.SPEmergencyRepository.findEmergencyNumber(spId);
                return EmergencyNumbers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateEmergencyNumber(spId, emergencyNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const EmergencyNumbers = yield this.SPEmergencyRepository.updateEmergencyNumber(spId, emergencyNumber);
                return EmergencyNumbers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteEmergencyNumber(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SPEmergencyRepository.deleteEmergencyNumber(spId);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAppointmentDetails(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointments = yield this.SPAppointmentRepository.getAppointmentDetails(spId);
                return appointments;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addPrescriptionToAppointment(appointmentId, prescription) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SPPrescriptionRepository.addPrescriptionToAppointment(appointmentId, prescription);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPrescription(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SPPrescriptionRepository.getPrescription(appointmentId);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRecentAppointments(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointments = yield this.SPAppointmentRepository.findAppointmentsAppointmentId(appointmentId);
                return appointments;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = SPUseCase;
