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
class ChatController {
    constructor(chatUseCase) {
        this.chatUseCase = chatUseCase;
    }
    getProvidersList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body; // Extract userId from request body
                const result = yield this.chatUseCase.getProvidersList(userId);
                return res.status(200).json(result); // Send back the providers list
            }
            catch (error) {
                next(error); // Handle error
            }
        });
    }
    // Handle sending a new message
    sendMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderId = req.body.userId;
            const receiverId = req.body.providerId;
            const message = req.body.message;
            try {
                const newMessage = yield this.chatUseCase.sendMessage(senderId, receiverId, message);
                return res.status(201).json(newMessage);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderId = req.body.userId;
            const receiverId = req.body.providerId;
            try {
                const messages = yield this.chatUseCase.getMessages(senderId, receiverId);
                return res.status(200).json(messages);
            }
            catch (error) {
                next(error);
            }
        });
    }
    SPgetUsersList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId } = req.body; // Extract userId from request body
                const result = yield this.chatUseCase.SPgetUsersList(providerId);
                return res.status(200).json(result); // Send back the providers list
            }
            catch (error) {
                next(error); // Handle error
            }
        });
    }
    // Handle sending a new message
    SPsendMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderId = req.body.providerId;
            const receiverId = req.body.userId;
            const message = req.body.message;
            try {
                const newMessage = yield this.chatUseCase.SPsendMessage(senderId, receiverId, message);
                return res.status(201).json(newMessage);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Handle retrieving messages between two users
    SPgetMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderId = req.body.providerId;
            const receiverId = req.body.userId;
            try {
                const messages = yield this.chatUseCase.SPgetMessages(senderId, receiverId);
                return res.status(200).json(messages);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = ChatController;
