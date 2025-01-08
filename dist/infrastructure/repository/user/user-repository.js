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
const user_model_1 = __importDefault(require("../../database/user-model"));
const otp_model_1 = __importDefault(require("../../database/otp-model"));
const Appointment_model_1 = __importDefault(require("../../database/Appointment-model"));
const doctor_model_1 = __importDefault(require("../../database/doctor-model"));
const service_provider_model_1 = __importDefault(require("../../database/service-provider-model"));
const emergency_model_1 = __importDefault(require("../../database/emergency-model"));
class UserRepository {
    //saving user details to database
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new user_model_1.default(user);
            const savedUser = yield newUser.save();
            return savedUser;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield user_model_1.default.findOne({ email: email });
            return userData;
        });
    }
    findById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield user_model_1.default.findById(_id);
            return userData;
        });
    }
    saveOtp(email, otp, name, phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpDoc = new otp_model_1.default({
                name: name,
                email: email,
                phone: phone,
                password: password,
                otp: otp,
                otpGeneratedAt: new Date(),
            });
            const savedDoc = yield otpDoc.save();
            return savedDoc;
        });
    }
    findOtpByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpRecord = yield otp_model_1.default.findOne({ email })
                    .sort({ otpGeneratedAt: -1 })
                    .exec();
                return otpRecord;
            }
            catch (error) {
                console.error("Error fetching OTP record:", error);
                throw error;
            }
        });
    }
    deleteOtpByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return otp_model_1.default.deleteMany({ email });
        });
    }
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_model_1.default.updateOne({
                email: email,
            }, { $set: { password: password } });
            return result.modifiedCount > 0;
        });
    }
    chnagePasswordById(Id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_model_1.default.updateOne({ _id: Id }, { $set: { password: password } });
            return result.modifiedCount > 0;
        });
    }
    editProfile(Id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield user_model_1.default.updateOne({ _id: Id }, { $set: { name: data.name, email: data.email, phone: data.phone } });
            return update.modifiedCount > 0;
        });
    }
    findPasswordById(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ _id: Id });
                return user === null || user === void 0 ? void 0 : user.password;
            }
            catch (error) {
                console.error("Error fetching current password:", error);
                throw error;
            }
        });
    }
    addReview(appointmentId, rating, review) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the appointment and populate relevant fields
                const appointment = yield Appointment_model_1.default.findById(appointmentId)
                    .populate("serviceProvider")
                    .populate("doctor")
                    .populate("user");
                // Check if the appointment exists and is completed
                if (!appointment || appointment.bookingStatus !== "completed") {
                    throw new Error("Appointment must be completed to add a review.");
                }
                const userId = appointment.user._id;
                // Create the new review object
                const newReview = { userId, rating, review, createdAt: new Date(), };
                // Check if the service provider exists
                if (appointment.serviceProvider) {
                    const existingReview = yield service_provider_model_1.default.findOne({
                        _id: appointment.serviceProvider._id,
                        "ratings.userId": userId, // Check if the user already has a review
                    });
                    if (existingReview) {
                        // If the review exists, update it
                        yield service_provider_model_1.default.updateOne({ _id: appointment.serviceProvider._id, "ratings.userId": userId }, {
                            $set: {
                                "ratings.$.rating": rating,
                                "ratings.$.review": review,
                                "ratings.$.createdAt": new Date(),
                            },
                        });
                    }
                    else {
                        // If no review exists, add a new one
                        yield service_provider_model_1.default.findByIdAndUpdate(appointment.serviceProvider._id, {
                            $push: { ratings: newReview },
                        });
                    }
                }
                // Repeat the same logic for doctors
                if (appointment.doctor) {
                    const existingDoctorReview = yield doctor_model_1.default.findOne({
                        _id: appointment.doctor._id,
                        "ratings.userId": userId, // Check if the user already has a review
                    });
                    if (existingDoctorReview) {
                        // If the review exists, update it
                        yield doctor_model_1.default.updateOne({ _id: appointment.doctor._id, "ratings.userId": userId }, {
                            $set: {
                                "ratings.$.rating": rating,
                                "ratings.$.review": review,
                                "ratings.$.createdAt": new Date(),
                            },
                        });
                    }
                    else {
                        yield doctor_model_1.default.findByIdAndUpdate(appointment.doctor._id, {
                            $push: { ratings: newReview },
                        });
                    }
                }
                return { message: "Review added or updated successfully!", review: newReview, };
            }
            catch (error) {
                throw new Error(`Error adding review: ${error}`);
            }
        });
    }
    findAllEmergencyNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const EmergencyNumbers = yield emergency_model_1.default.find({}).populate("serviceProvider", "name profileImage");
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
                // Step 1: Find the user and get the wallet details
                const walletDetails = yield user_model_1.default.findOne({ _id: userId })
                    .populate({
                    path: "wallet.appointmentId", // Populate the appointmentId in the wallet array
                    model: "Appointment", // Specify the Appointment model
                    populate: [
                        {
                            path: "serviceProvider", // Populate the serviceProvider field
                            select: "name profileImage", // Select only the necessary fields
                        },
                        {
                            path: "department", // Populate the department field
                            select: "name", // Select only the name field
                        },
                        {
                            path: "doctor", // Populate the doctor field
                            select: "name", // Select only the name field
                        },
                    ],
                })
                    .select("wallet");
                if (walletDetails && walletDetails.wallet) {
                    walletDetails.wallet.sort((a, b) => {
                        const dateA = new Date(a.date).getTime();
                        const dateB = new Date(b.date).getTime();
                        return dateB - dateA; // Sort in descending order
                    });
                }
                return walletDetails ? walletDetails.wallet : []; // Return an empty array if no wallet details found
            }
            catch (error) {
                throw error;
            }
        });
    }
    isWalletHaveMoney(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch user by userId
                const user = yield user_model_1.default.findById(userId);
                // Check if the user exists
                if (!user) {
                    throw new Error('User not found');
                }
                // Initialize a variable to calculate the total balance
                let totalBalance = 0;
                // Iterate through each wallet entry to calculate the balance
                user.wallet.forEach((transaction) => {
                    if (transaction.isPlus) {
                        totalBalance += transaction.amount; // Add amount if isPlus is true
                    }
                    else {
                        totalBalance -= transaction.amount; // Subtract amount if isPlus is false
                    }
                });
                // Check if the total balance is 50 or more
                if (totalBalance >= 50) {
                    return { hasEnoughMoney: true, balance: totalBalance };
                }
                else {
                    return { hasEnoughMoney: false, balance: totalBalance };
                }
            }
            catch (error) {
                console.error("Error checking wallet balance:", error);
                throw error;
            }
        });
    }
}
exports.default = UserRepository;
