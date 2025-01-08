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
const chat_model_1 = __importDefault(require("../database/chat-model"));
const Appointment_model_1 = __importDefault(require("../database/Appointment-model"));
class ChatRepository {
    findProvidersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch appointments for the user
                const appointments = yield Appointment_model_1.default.find({ user: userId })
                    .populate('serviceProvider'); // Populate the serviceProvider field to get provider details
                // Extract unique providers from the appointments
                const providers = appointments.map(appointment => appointment.serviceProvider);
                // Remove duplicates (optional)
                const uniqueProviders = [...new Map(providers.map(provider => [provider._id, provider])).values()];
                return uniqueProviders;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findUsersByProviderId(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch appointments for the provider
                const appointments = yield Appointment_model_1.default.find({ serviceProvider: providerId })
                    .populate('user'); // Populate the user field to get user details
                // Extract unique users from the appointments
                const users = appointments.map(appointment => appointment.user);
                // Remove duplicates (optional)
                const uniqueUsers = [...new Map(users.map(user => [user._id, user])).values()];
                return uniqueUsers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // To save a new message
    saveMessage(senderId, receiverId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = new chat_model_1.default({ senderId, receiverId, message });
                yield newMessage.save();
                return newMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // To get all messages between two users
    getMessages(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield chat_model_1.default.find({
                    $or: [
                        { senderId, receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ]
                }).sort({ timestamp: 1 }); // Sort messages by timestamp (oldest first)
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = ChatRepository;
