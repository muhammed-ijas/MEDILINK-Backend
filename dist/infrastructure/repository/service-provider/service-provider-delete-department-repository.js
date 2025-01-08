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
const service_provider_model_1 = __importDefault(require("../../database/service-provider-model"));
const department_model_1 = __importDefault(require("../../database/department-model"));
const doctor_model_1 = __importDefault(require("../../database/doctor-model"));
class SPRepository {
    //saving provider details to database
    deleteDepartment(spId, departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const department = yield department_model_1.default.findOne({
                    _id: departmentId,
                    serviceProvider: spId,
                });
                const result = yield department_model_1.default.deleteOne({
                    _id: departmentId,
                    serviceProvider: spId,
                });
                yield service_provider_model_1.default.updateMany({ departments: departmentId }, { $pull: { departments: departmentId } });
                if (result.deletedCount > 0) {
                    const doctorsDeleted = yield doctor_model_1.default.deleteMany({
                        _id: { $in: (department === null || department === void 0 ? void 0 : department.doctors) || [] },
                    });
                    if (doctorsDeleted.deletedCount > 0) {
                        return { success: true, message: "Department and associated doctors deleted successfully", };
                    }
                    else {
                        return { success: true, message: "Department deleted, but no associated doctors found or deleted", };
                    }
                }
                else {
                    return { success: false, message: "Failed to delete the department" };
                }
            }
            catch (error) {
                console.log("Error in deleteDepartment:", error);
                return {
                    success: false,
                    message: "An error occurred while deleting the department",
                };
            }
        });
    }
}
exports.default = SPRepository;
