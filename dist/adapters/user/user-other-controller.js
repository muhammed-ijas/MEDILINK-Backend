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
class userController {
    constructor(userUseCase) {
        this.userUseCase = userUseCase;
    }
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { Id } = req.body;
                let profile = yield this.userUseCase.getProfile(Id);
                return res.status(profile.status).json(profile.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { Id, data } = req.body;
                let profile = yield this.userUseCase.editProfile(Id, data);
                if (profile.status == 200) {
                    return res.status(profile.status).json(profile.data);
                }
                return res.status(profile.status).json(profile.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getFullAppointmentList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.userUseCase.getFullAppointmentList(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createPaymentSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const session = yield this.userUseCase.createPaymentSession(body);
                return res.status(200).json({ id: session.id });
            }
            catch (error) {
                next(error);
            }
        });
    }
    confirmWalletPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { appointmentData } = req.body;
                const Appointment = yield this.userUseCase.confirmWalletPayment(appointmentData);
                return res.status(200).json({ Appointment });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateBookingStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId, status } = req.body;
                const result = yield this.userUseCase.updateBookingStatus(bookingId, status);
                const updatedBooking = yield this.userUseCase.findTheappointmentForqrcodeById(bookingId);
                res.status(200).json({ result, qrCode: updatedBooking.qrCode });
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
                const result = yield this.userUseCase.cancelAppointment(id, reason);
                res.status(200).json({ message: "Appointment cancelled successfully!", result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { rating, review } = req.body;
                const result = yield this.userUseCase.addReview(id, rating, review);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllEmergencyNumbers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userUseCase.getAllEmergencyNumbers();
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getWalletDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.userUseCase.getWalletDetails(id);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    isWalletHaveMoney(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.userUseCase.isWalletHaveMoney(id);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = userController;
