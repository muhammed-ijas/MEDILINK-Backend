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
    getDepartments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = "" } = req.query;
                const result = yield this.userUseCase.getDepartments(Number(page), Number(limit), search);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDoctors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = "" } = req.query;
                const result = yield this.userUseCase.getDoctors(Number(page), Number(limit), search);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getHospitals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = "" } = req.query;
                const result = yield this.userUseCase.getHospitals(Number(page), Number(limit), search);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getClinicks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = "" } = req.query;
                const result = yield this.userUseCase.getClinicks(Number(page), Number(limit), search);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAmbulances(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = "" } = req.query;
                const result = yield this.userUseCase.getAmbulances(Number(page), Number(limit), search);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getHomeNurses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, search = "" } = req.query;
                const result = yield this.userUseCase.getHomeNurses(Number(page), Number(limit), search);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getHospitalClinicDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.userUseCase.getHospitalClinicDetails(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDepartmentDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.userUseCase.getDepartmentDetails(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDoctorDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.userUseCase.getDoctorDetails(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDoctorDetailsFromSearchPage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.userUseCase.getDoctorDetailsFromSearchPage(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getHomeNurseDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.userUseCase.getHomeNurseDetails(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAmbulanceDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.userUseCase.getAmbulanceDetails(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = userController;
