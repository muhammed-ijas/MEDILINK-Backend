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
class spController {
    constructor(spUseCase) {
        this.spUseCase = spUseCase;
    }
    getFullAppointmentList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.spUseCase.getFullAppointmentList(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    approveAppointment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.spUseCase.approveAppointment(id);
                res.status(200).json({ message: 'Appointment approved successfully!', result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    completeAppointment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.spUseCase.completeAppointment(id);
                res.status(200).json({ message: 'Appointment completed successfully!', result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    cancelAppointment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { reason } = req.body;
                const result = yield this.spUseCase.cancelAppointment(id, reason);
                res.status(200).json({ message: 'Appointment cancelled successfully!', result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getEmergencyNumber(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.spUseCase.getEmergencyNumber(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateEmergencyNumber(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, emergencyNumber } = req.body;
                const result = yield this.spUseCase.updateEmergencyNumber(id, emergencyNumber);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteEmergencyNumber(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const result = yield this.spUseCase.deleteEmergencyNumber(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAppointmentDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.spUseCase.getAppointmentDetails(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addPrescriptionToAppointment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { appointmentId, prescription } = req.body;
                const result = yield this.spUseCase.addPrescriptionToAppointment(appointmentId, prescription);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPrescription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { appointmentId } = req.body;
                const result = yield this.spUseCase.getPrescription(appointmentId);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getRecentAppointments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { appointmentId } = req.params;
                const result = yield this.spUseCase.getRecentAppointments(appointmentId);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = spController;
