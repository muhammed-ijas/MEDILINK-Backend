"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = __importDefault(require("../../adapters/chatController"));
const chat_usecase_1 = __importDefault(require("../../useCase/chat-usecase"));
const chat_repository_1 = __importDefault(require("../repository/chat-repository"));
const error_handle_1 = __importDefault(require("../middleware/error-handle"));
// Repositories
const chatRepository = new chat_repository_1.default();
// Use cases
const chatUsecase = new chat_usecase_1.default(chatRepository);
// Controller
const chatController = new chatController_1.default(chatUsecase);
const route = express_1.default.Router();
// Error handling middleware
route.use(error_handle_1.default);
//users side
route.post('/getProvidersList', (req, res, next) => chatController.getProvidersList(req, res, next));
route.post('/sendMessage', (req, res, next) => chatController.sendMessage(req, res, next));
route.post('/getMessages', (req, res, next) => chatController.getMessages(req, res, next));
//providers side
route.post('/SPgetUsersList', (req, res, next) => chatController.SPgetUsersList(req, res, next));
route.post('/SPgetMessages', (req, res, next) => chatController.SPgetMessages(req, res, next));
route.post('/SPsendMessage', (req, res, next) => chatController.SPsendMessage(req, res, next));
exports.default = route;
