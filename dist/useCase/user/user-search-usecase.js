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
class UserSearchUsecase {
    constructor(DepartmentRepository, DoctorRepository, SPRepository, SPSearchRepository) {
        this.DepartmentRepository = DepartmentRepository;
        this.DoctorRepository = DoctorRepository;
        this.SPRepository = SPRepository;
        this.SPSearchRepository = SPSearchRepository;
    }
    getDepartments(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departments = yield this.DepartmentRepository.findPaginated(page, limit, search);
                const totalDepartments = yield this.DepartmentRepository.count(search);
                const totalPages = Math.ceil(totalDepartments / limit);
                return {
                    items: departments,
                    totalPages,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDoctors(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctors = yield this.DoctorRepository.findPaginated(page, limit, search);
                const totalDoctors = yield this.DoctorRepository.count(search);
                const totalPages = Math.ceil(totalDoctors / limit);
                return {
                    items: doctors,
                    totalPages,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getHospitals(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hospitals = yield this.SPSearchRepository.findPaginatedHospitals(page, limit, search);
                const totalHospitals = yield this.SPSearchRepository.countHospitals(search);
                const totalPages = Math.ceil(totalHospitals / limit);
                return {
                    items: hospitals,
                    totalPages,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getClinicks(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clinicks = yield this.SPSearchRepository.findPaginatedClinicks(page, limit, search);
                const totalClinicks = yield this.SPSearchRepository.countClinicks(search);
                const totalPages = Math.ceil(totalClinicks / limit);
                return {
                    items: clinicks,
                    totalPages,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAmbulances(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ambulances = yield this.SPSearchRepository.findPaginatedAmbulances(page, limit, search);
                const totalAmbulances = yield this.SPSearchRepository.countAmbulances(search);
                const totalPages = Math.ceil(totalAmbulances / limit);
                return {
                    items: ambulances,
                    totalPages,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getHomeNurses(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const homeNurses = yield this.SPSearchRepository.findPaginatedHomeNurses(page, limit, search);
                const totalHomeNurses = yield this.SPSearchRepository.countHomeNurses(search);
                const totalPages = Math.ceil(totalHomeNurses / limit);
                return {
                    items: homeNurses,
                    totalPages,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getHospitalClinicDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hospitalDetails = yield this.SPRepository.findHospitalClinicById(id);
                if (!hospitalDetails) {
                    throw new Error("Hospital/Clinic not found");
                }
                return hospitalDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDepartmentDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departmentDetails = yield this.SPRepository.findDepartmentById(id);
                if (!departmentDetails) {
                    throw new Error("Ddepartment not found");
                }
                return departmentDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDoctorDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorDetails = yield this.DoctorRepository.findDoctorById(id);
                if (!doctorDetails) {
                    throw new Error("Doctor not found");
                }
                return doctorDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDoctorDetailsFromSearchPage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorDetails = yield this.SPRepository.getDoctorDetailsFromSearchPage(id);
                if (!doctorDetails) {
                    throw new Error("Doctor not found");
                }
                return doctorDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getHomeNurseDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const homeNurseDetails = yield this.SPRepository.findHomeNurseById(id);
                if (!homeNurseDetails) {
                    throw new Error("Ddepartment not found");
                }
                return homeNurseDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAmbulanceDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ambulanceDetails = yield this.SPRepository.findAmbulanceById(id);
                if (!ambulanceDetails) {
                    throw new Error("Ddepartment not found");
                }
                return ambulanceDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserSearchUsecase;
