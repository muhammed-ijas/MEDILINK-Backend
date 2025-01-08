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
class adminController {
    constructor(AdminUsecase) {
        this.AdminUseCase = AdminUsecase;
    }
    getUnVerifiedServices(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminUseCase.getUnverifiedServices();
                return res.status(200).json(response); // Make sure to send the response back to the client
            }
            catch (error) {
                next(error); // Handle errors appropriately
            }
        });
    }
    getAllServices(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminUseCase.getAllServices();
                return res.status(200).json(response); // Make sure to send the response back to the client
            }
            catch (error) {
                next(error); // Handle errors appropriately
            }
        });
    }
    getVerifiedServices(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminUseCase.getVerifiedServices();
                return res.status(200).json(response); // Make sure to send the response back to the client
            }
            catch (error) {
                next(error); // Handle errors appropriately
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminUseCase.getUsers();
                return res.status(200).json(response); // Make sure to send the response back to the client
            }
            catch (error) {
                next(error); // Handle errors appropriately
            }
        });
    }
    approvedService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                if (!id) {
                    return res.status(400).json({ message: 'Service provider ID is required' });
                }
                const response = yield this.AdminUseCase.approvedService(id);
                return res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    blockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                yield this.AdminUseCase.blockUser(userId);
                res.status(200).json({ message: 'User blocked successfully' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    unblockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                yield this.AdminUseCase.unblockUser(userId);
                res.status(200).json({ message: 'User unblocked successfully' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = adminController;
