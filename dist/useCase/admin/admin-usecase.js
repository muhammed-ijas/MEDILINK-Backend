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
class adminUseCase {
    constructor(AdminRepo, generateMail) {
        this.AdminRepository = AdminRepo;
        this.generateMail = generateMail;
    }
    getUnverifiedServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.AdminRepository.getUnVerifiedServices();
            return result; // Ensure this returns the correct value
        });
    }
    getAllServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.AdminRepository.getAllServices();
            return result; // Ensure this returns the correct value
        });
    }
    getVerifiedServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.AdminRepository.getVerifiedServices();
            return result; // Ensure this returns the correct value
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.AdminRepository.getUsers();
            return result; // Ensure this returns the correct value
        });
    }
    approvedService(serviceProviderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.AdminRepository.approvedService(serviceProviderId);
            if (result) {
                const serviceProvider = yield this.AdminRepository.getServiceProviderById(serviceProviderId);
                if (serviceProvider) {
                    this.generateMail.sendApproval(serviceProvider.email, serviceProvider.name);
                }
            }
            return result;
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.AdminRepository.updateUserBlockStatus(userId, true);
        });
    }
    unblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.AdminRepository.updateUserBlockStatus(userId, false);
        });
    }
}
exports.default = adminUseCase;
