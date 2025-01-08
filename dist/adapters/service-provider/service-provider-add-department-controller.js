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
class spController {
    constructor(spUseCase) {
        this.spUseCase = spUseCase;
    }
    addDoctorToDepartment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { spId, department, doctors } = req.body;
                const update = yield this.spUseCase.addDoctorToDepartment(spId, department, doctors);
                if (update) {
                    return res.status(update.status).json(update.message);
                }
                else {
                    return res.status(400).json({ message: "Update failed" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    addDepartment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { spId, department, avgTime } = req.body;
                const update = yield this.spUseCase.addDepartment(spId, department, avgTime);
                if (update) {
                    return res.status(update.status).json({ message: update.message });
                }
                else {
                    return res.status(400).json({ message: "Update failed" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllServiceDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { spId } = req.params;
                const services = yield this.spUseCase.getAllServiceDetails(spId);
                if (services) {
                    return res.status(200).json(services);
                }
                else {
                    return res.status(404).json({ message: "Services not found" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    editDepartment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const spId = req.body.spId;
                const departmentId = req.body.data.departmentId;
                const name = req.body.data.name;
                const doctors = req.body.data.doctors;
                const updateResult = yield this.spUseCase.editDepartment(spId, departmentId, name, doctors);
                if (updateResult) {
                    return res.status(updateResult.status).json(updateResult);
                }
                else {
                    return res.status(400).json({ message: "Update failed" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteDepartment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { spId, departmentId } = req.body;
                const response = yield this.spUseCase.deleteDepartment(spId, departmentId);
                if (response.success) {
                    return res.status(200).json({ message: response.message });
                }
                else {
                    return res.status(400).json({ message: response.message });
                }
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
                const doctorDetails = yield this.spUseCase.getDoctorDetails(id);
                return res.status(200).json(doctorDetails);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateDoctorDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorData = req.body;
                const result = yield this.spUseCase.updateDoctorDetails(doctorData);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllDoctorDetailsInsideADepartment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { departmentId } = req.body;
                const result = yield this.spUseCase.getAllDoctorDetailsInsideADepartment(departmentId);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDoctorSlotsDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { doctorId } = req.body;
                const result = yield this.spUseCase.getDoctorSlotsDetails(doctorId);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    isDoctorHaveSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { doctorId } = req.body;
                const result = yield this.spUseCase.isDoctorHaveSlots(doctorId);
                return res.status(200).json({ result });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { doctorId } = req.body;
                yield this.spUseCase.deleteDoctor(doctorId); // Call the use case to delete the doctor
                return res.status(204).send(); // Send a No Content status on success
            }
            catch (error) {
                next(error); // Pass error to the error handler
            }
        });
    }
}
exports.default = spController;
