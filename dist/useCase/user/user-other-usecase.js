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
class UserUseCase {
    constructor(UserRepository, generateEmail, SPRepository, SPAppointmentRepository, SPCreatePaymentRepository, SPWalletRepository, SPEditAppointmentRepository) {
        this.UserRepository = UserRepository;
        this.generateEmail = generateEmail;
        this.SPRepository = SPRepository;
        this.SPAppointmentRepository = SPAppointmentRepository;
        this.SPCreatePaymentRepository = SPCreatePaymentRepository;
        this.SPWalletRepository = SPWalletRepository;
        this.SPEditAppointmentRepository = SPEditAppointmentRepository;
    }
    checkExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield this.UserRepository.findByEmail(email);
            if (userExist) {
                return {
                    status: 400,
                    data: {
                        status: false,
                        message: "User already exists",
                    },
                };
            }
            else {
                return {
                    status: 200,
                    data: {
                        status: true,
                        message: "User does not exist",
                    },
                };
            }
        });
    }
    getProfile(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this.UserRepository.findById(Id);
            let data = {
                _id: profile === null || profile === void 0 ? void 0 : profile._id,
                name: profile === null || profile === void 0 ? void 0 : profile.name,
                email: profile === null || profile === void 0 ? void 0 : profile.email,
                phone: profile === null || profile === void 0 ? void 0 : profile.phone,
                isBlocked: profile === null || profile === void 0 ? void 0 : profile.isBlocked,
            };
            return {
                status: 200,
                data: data,
            };
        });
    }
    editProfile(Id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this.UserRepository.editProfile(Id, data);
            if (profile) {
                const data = yield this.UserRepository.findById(Id);
                const profileData = {
                    _id: data === null || data === void 0 ? void 0 : data._id,
                    name: data === null || data === void 0 ? void 0 : data.name,
                    email: data === null || data === void 0 ? void 0 : data.email,
                    phone: data === null || data === void 0 ? void 0 : data.phone,
                    isBlocked: data === null || data === void 0 ? void 0 : data.isBlocked,
                };
                return {
                    status: 200,
                    data: {
                        message: "Profile updated successfully",
                        user: profileData,
                    },
                };
            }
            else {
                return {
                    status: 400,
                    message: "Failed to update the data Please try again",
                };
            }
        });
    }
    getFullAppointmentList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointments = yield this.SPAppointmentRepository.findAppointmentsByUserId(userId);
                return appointments;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createPaymentSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.SPCreatePaymentRepository.createPaymentSession(data);
        });
    }
    confirmWalletPayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.SPWalletRepository.confirmWalletPayment(data);
        });
    }
    updateBookingStatus(bookingId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.SPEditAppointmentRepository.updateBookingStatus(bookingId, status);
            }
            catch (error) {
                throw new Error("Error updating booking status");
            }
        });
    }
    findTheappointmentForqrcodeById(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.SPAppointmentRepository.findAppointmentById(bookingId);
            }
            catch (error) {
                throw new Error("ot get");
            }
        });
    }
    cancelAppointment(id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the appointment by ID
            const appointment = yield this.SPAppointmentRepository.findAppointmentById(id);
            if (!appointment) {
                throw new Error("Appointment not found");
            }
            if (appointment.bookingStatus === "cancelled") {
                throw new Error("Already cancelled");
            }
            // Update appointment status to 'cancelled'
            yield this.SPEditAppointmentRepository.updateAppointmentStatus(id, "cancelled");
            // Update the time slot status to 'not occupied'
            yield this.SPAppointmentRepository.updateTimeSlotStatus(appointment.doctor, appointment.bookingDate, appointment.timeSlot, "not occupied");
            // Send cancellation email
            this.generateEmail.sendCancellation(appointment.patientEmail, reason);
            return {
                status: 200,
                data: {
                    status: true,
                    message: "Appointment cancelled, time slot released, and notification sent to the patient",
                },
            };
        });
    }
    addReview(appointmentId, rating, review) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.UserRepository.addReview(appointmentId, rating, review);
            }
            catch (error) {
                throw new Error('Error adding review');
            }
        });
    }
    getAllEmergencyNumbers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const EmergencyNumbers = yield this.UserRepository.findAllEmergencyNumber();
                return EmergencyNumbers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getWalletDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const WalletDetails = yield this.UserRepository.getWalletDetails(userId);
                return WalletDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    isWalletHaveMoney(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const WalletDetails = yield this.UserRepository.isWalletHaveMoney(userId);
                return WalletDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserUseCase;
