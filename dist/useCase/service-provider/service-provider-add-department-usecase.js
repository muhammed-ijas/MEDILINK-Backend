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
const mongoose_1 = require("mongoose");
class SPUseCase {
    constructor(SPAddDepartmentRepository, SPRepository, SPAddDoctorRepository, SPEditDepartmentRepository, SPDeleteDepartmentRepository, SPEditDoctorRepository, SPDeleteDoctorRepository) {
        this.SPAddDepartmentRepository = SPAddDepartmentRepository;
        this.SPRepository = SPRepository;
        this.SPAddDoctorRepository = SPAddDoctorRepository;
        this.SPEditDepartmentRepository = SPEditDepartmentRepository;
        this.SPDeleteDepartmentRepository = SPDeleteDepartmentRepository;
        this.SPEditDoctorRepository = SPEditDoctorRepository;
        this.SPDeleteDoctorRepository = SPDeleteDoctorRepository;
    }
    addDoctorToDepartment(spId, department, doctors) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("from usecase ,", spId, department, doctors);
                // Call the repository to perform the operation
                const result = yield this.SPAddDoctorRepository.addDoctorToDepartment(spId, department, doctors);
                if (result) {
                    return {
                        status: 200,
                        message: "Doctors added successfully",
                    };
                }
                else {
                    return {
                        status: 400,
                        message: "Failed to add   doctors",
                    };
                }
            }
            catch (error) {
                throw new mongoose_1.Error("An error occurred while adding the doctors");
            }
        });
    }
    addDepartment(spId, departmentName, avgTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the repository to perform the operation
                const result = yield this.SPAddDepartmentRepository.addDepartment(spId, departmentName, avgTime);
                if (result.status) {
                    return {
                        status: 200,
                        message: result.message, // "Department added successfully"
                    };
                }
                else {
                    return {
                        status: 201,
                        message: result.message,
                    };
                }
            }
            catch (error) {
                throw new mongoose_1.Error("An error occurred while adding the department");
            }
        });
    }
    editDepartment(spId, departmentId, name, doctors) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedDepartment = yield this.SPEditDepartmentRepository.editDepartment(spId, departmentId, name, doctors);
                if (updatedDepartment) {
                    return {
                        status: 200,
                        message: "Department updated successfully",
                        data: updatedDepartment,
                    };
                }
                else {
                    throw new mongoose_1.Error("Department update failed");
                }
            }
            catch (error) {
                throw new mongoose_1.Error("An error occurred while updating the department");
            }
        });
    }
    deleteDepartment(spId, departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield this.SPDeleteDepartmentRepository.deleteDepartment(spId, departmentId);
                return deleted || { success: false, message: "Unknown error" };
            }
            catch (error) {
                console.log("Error in deleteDepartment use case:", error);
                return {
                    success: false,
                    message: "An error occurred while deleting the department",
                };
            }
        });
    }
    getDoctorDetails(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorDetails = yield this.SPRepository.findDoctorById(doctorId);
                return doctorDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateDoctorDetails(doctorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SPEditDoctorRepository.updateDoctorDetails(doctorData);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllDoctorDetailsInsideADepartment(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SPAddDepartmentRepository.getAllDoctorDetailsInsideADepartment(departmentId);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDoctorSlotsDetails(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SPAddDepartmentRepository.getDoctorSlotsDetails(doctorId);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    isDoctorHaveSlots(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SPRepository.isDoctorHaveSlots(doctorId);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllServiceDetails(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const services = yield this.SPRepository.getAllServiceDetails(spId);
                if (services) {
                    return services;
                }
                else {
                    throw new mongoose_1.Error("Services not found");
                }
            }
            catch (error) {
                throw new mongoose_1.Error("An error occurred while fetching the services");
            }
        });
    }
    // usecases/spUseCase.ts or similar file
    deleteDoctor(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // You might want to add additional checks here if necessary
                yield this.SPDeleteDoctorRepository.deleteDoctor(doctorId); // Call repository method to delete doctor
            }
            catch (error) {
                throw error; // Re-throw the error for handling in the controller
            }
        });
    }
}
exports.default = SPUseCase;
