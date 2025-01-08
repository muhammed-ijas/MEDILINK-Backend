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
class ChatUseCase {
    constructor(ChatRepository) {
        this.ChatRepository = ChatRepository;
    }
    getProvidersList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providers = yield this.ChatRepository.findProvidersByUserId(userId);
                return providers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Send a new message
    sendMessage(senderId, receiverId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.ChatRepository.saveMessage(senderId, receiverId, message);
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get messages between two users
    getMessages(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.ChatRepository.getMessages(senderId, receiverId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    SPgetUsersList(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providers = yield this.ChatRepository.findUsersByProviderId(providerId);
                return providers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Send a new message
    SPsendMessage(senderId, receiverId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.ChatRepository.saveMessage(senderId, receiverId, message);
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get messages between two users
    SPgetMessages(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.ChatRepository.getMessages(senderId, receiverId);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = ChatUseCase;
