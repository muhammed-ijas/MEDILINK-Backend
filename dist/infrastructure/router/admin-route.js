"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = __importDefault(require("../../adapters/admin/admin-controller"));
const admin_usecase_1 = __importDefault(require("../../useCase/admin/admin-usecase"));
const admin_repository_1 = __importDefault(require("../repository/admin/admin-repository"));
const error_handle_1 = __importDefault(require("../middleware/error-handle"));
const send_email_1 = __importDefault(require("../services/send-email"));
const sendOtp = new send_email_1.default();
//repositories
const adminRepository = new admin_repository_1.default();
// usecases
const adminUseCase = new admin_usecase_1.default(adminRepository, sendOtp);
const adminController = new admin_controller_1.default(adminUseCase);
const route = express_1.default.Router();
route.get('/getUnVerifiedServices', (req, res, next) => adminController.getUnVerifiedServices(req, res, next));
route.get('/getVerifiedServices', (req, res, next) => adminController.getVerifiedServices(req, res, next));
route.get('/getUsers', (req, res, next) => adminController.getUsers(req, res, next));
route.post('/approvedService', (req, res, next) => adminController.approvedService(req, res, next));
route.post('/blockUser', (req, res, next) => adminController.blockUser(req, res, next));
route.post('/unblockUser', (req, res, next) => adminController.unblockUser(req, res, next));
route.use(error_handle_1.default);
exports.default = route;
