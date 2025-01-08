"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import repositories
const service_provider_repository_1 = __importDefault(require("../repository/service-provider/service-provider-repository"));
const service_provider_registration_repository_1 = __importDefault(require("../repository/service-provider/service-provider-registration-repository"));
const service_provider_profile_repository_1 = __importDefault(require("../repository/service-provider/service-provider-profile-repository"));
const service_provider_appointment_repository_1 = __importDefault(require("../repository/service-provider/service-provider-appointment-repository"));
const service_provider_add_department_repository_1 = __importDefault(require("../repository/service-provider/service-provider-add-department-repository"));
const service_provider_edit_appointment_repository_1 = __importDefault(require("../repository/service-provider/service-provider-edit-appointment-repository"));
const service_provider_emergency_repository_1 = __importDefault(require("../repository/service-provider/service-provider-emergency-repository"));
const service_provider_prescription_repository_1 = __importDefault(require("../repository/service-provider/service-provider-prescription-repository"));
const service_provider_add_doctor_repository_1 = __importDefault(require("../repository/service-provider/service-provider-add-doctor-repository"));
const service_provider_edit_department_repository_1 = __importDefault(require("../repository/service-provider/service-provider-edit-department-repository"));
const service_provider_delete_department_repository_1 = __importDefault(require("../repository/service-provider/service-provider-delete-department-repository"));
const service_provider_edit_doctor_repository_1 = __importDefault(require("../repository/service-provider/service-provider-edit-doctor-repository"));
const service_provider_delete_doctor_repository_1 = __importDefault(require("../repository/service-provider/service-provider-delete-doctor-repository"));
//import usecases
const service_provider_usecase_1 = __importDefault(require("../../useCase/service-provider/service-provider-usecase"));
const service_provider_registration_usecase_1 = __importDefault(require("../../useCase/service-provider/service-provider-registration-usecase"));
const serrvice_provider_profile_usecase_1 = __importDefault(require("../../useCase/service-provider/serrvice-provider-profile-usecase"));
const service_provider_add_department_usecase_1 = __importDefault(require("../../useCase/service-provider/service-provider-add-department-usecase"));
//import controllers
const service_provider_controller_1 = __importDefault(require("../../adapters/service-provider/service-provider-controller"));
const service_provider_add_department_controller_1 = __importDefault(require("../../adapters/service-provider/service-provider-add-department-controller"));
const service_provider_profile_controller_1 = __importDefault(require("../../adapters/service-provider/service-provider-profile-controller"));
const service_provider_registration_controller_1 = __importDefault(require("../../adapters/service-provider/service-provider-registration-controller"));
const generate_otp_1 = __importDefault(require("../services/generate-otp"));
const send_email_1 = __importDefault(require("../services/send-email"));
const bcrypt_password_1 = __importDefault(require("../services/bcrypt-password"));
const generate_token_1 = __importDefault(require("../services/generate-token"));
const error_handle_1 = __importDefault(require("../middleware/error-handle"));
//services
const generateOtp = new generate_otp_1.default();
const sendOtp = new send_email_1.default();
const encryptPassword = new bcrypt_password_1.default();
const jwtToken = new generate_token_1.default();
//repositories
const spRepository = new service_provider_repository_1.default();
const spRegistrationRepository = new service_provider_registration_repository_1.default();
const spProfileRepository = new service_provider_profile_repository_1.default();
const spAppointmentRepository = new service_provider_appointment_repository_1.default();
const spAddDepartmentRepository = new service_provider_add_department_repository_1.default();
const spEditAppointmentRepository = new service_provider_edit_appointment_repository_1.default();
const spEmergencyRepository = new service_provider_emergency_repository_1.default();
const spPrescriptionRepository = new service_provider_prescription_repository_1.default();
const spAddDoctorRepository = new service_provider_add_doctor_repository_1.default();
const spEditDepartmentRepository = new service_provider_edit_department_repository_1.default();
const spDeleteDepartmentRepository = new service_provider_delete_department_repository_1.default();
const spEditDoctorRepository = new service_provider_edit_doctor_repository_1.default();
const spDeleteDoctorRepository = new service_provider_delete_doctor_repository_1.default();
//useCases 
const spUseCase = new service_provider_usecase_1.default(spRepository, spAppointmentRepository, sendOtp, spEditAppointmentRepository, spEmergencyRepository, spPrescriptionRepository);
const spRegistrationUsecase = new service_provider_registration_usecase_1.default(spRegistrationRepository, encryptPassword, jwtToken, generateOtp, sendOtp);
const spProfileUsecase = new serrvice_provider_profile_usecase_1.default(spProfileRepository, spRegistrationRepository);
const spAddDepartmentUsecase = new service_provider_add_department_usecase_1.default(spAddDepartmentRepository, spRepository, spAddDoctorRepository, spEditDepartmentRepository, spDeleteDepartmentRepository, spEditDoctorRepository, spDeleteDoctorRepository);
//controllers
const spController = new service_provider_controller_1.default(spUseCase);
const spAddDepartmentController = new service_provider_add_department_controller_1.default(spAddDepartmentUsecase);
const spProfileController = new service_provider_profile_controller_1.default(spProfileUsecase);
const spRegistrationController = new service_provider_registration_controller_1.default(spRegistrationUsecase);
const route = express_1.default.Router();
route.post('/signup', (req, res, next) => spRegistrationController.signUp(req, res, next));
route.post('/otpVerify', (req, res, next) => spRegistrationController.verifyOtp(req, res, next));
route.post('/login', (req, res, next) => spRegistrationController.login(req, res, next));
route.post('/resendOtp', (req, res, next) => spRegistrationController.resendOtp(req, res, next));
route.post('/getProfile', (req, res, next) => spProfileController.getProfile(req, res, next));
route.post('/editProfile', (req, res, next) => spProfileController.updateProfile(req, res, next));
route.post('/changePassword', (req, res, next) => spRegistrationController.updatePassword(req, res, next));
route.post('/upload-profile-image', (req, res, next) => spProfileController.updateImage(req, res, next));
route.post('/changeFirstDocumentImage', (req, res, next) => spProfileController.changeFirstDocumentImage(req, res, next));
route.post('/changeSecondDocumentImage', (req, res, next) => spProfileController.changeSecondDocumentImage(req, res, next));
route.post('/addDepartment', (req, res, next) => spAddDepartmentController.addDepartment(req, res, next));
route.post('/addDoctorToDepartment', (req, res, next) => spAddDepartmentController.addDoctorToDepartment(req, res, next));
route.post('/editDepartment', (req, res, next) => spAddDepartmentController.editDepartment(req, res, next));
route.post('/deleteDepartment', (req, res, next) => spAddDepartmentController.deleteDepartment(req, res, next));
route.get('/getAllServiceDetails/:spId', (req, res, next) => spAddDepartmentController.getAllServiceDetails(req, res, next));
route.get('/getFullAppointmentList/:id', (req, res, next) => { spController.getFullAppointmentList(req, res, next); });
// Route to get doctor details
route.get('/getDoctorDetails/:id', (req, res, next) => { spAddDepartmentController.getDoctorDetails(req, res, next); });
route.post('/updateDoctorDetails', (req, res, next) => { spAddDepartmentController.updateDoctorDetails(req, res, next); });
// Route to get all appointments for a specific doctor
route.get('/getAppointmentDetails/:id', (req, res, next) => { spController.getAppointmentDetails(req, res, next); });
//ratings 
route.get('/getRatingsAndReviews/:id', (req, res, next) => { spProfileController.getRatingsAndReviews(req, res, next); });
route.put('/appointmentApprove/:id', (req, res, next) => spController.approveAppointment(req, res, next));
route.put('/completeAppointment/:id', (req, res, next) => spController.completeAppointment(req, res, next));
route.put('/appointmentCancel/:id', (req, res, next) => spController.cancelAppointment(req, res, next));
//for emergency contacts
route.get('/getEmergencyNumber/:id', (req, res, next) => spController.getEmergencyNumber(req, res, next));
route.post('/updateEmergencyNumber', (req, res, next) => spController.updateEmergencyNumber(req, res, next));
route.post('/deleteEmergencyNumber', (req, res, next) => spController.deleteEmergencyNumber(req, res, next));
route.post('/addPrescriptionToAppointment', (req, res, next) => spController.addPrescriptionToAppointment(req, res, next));
route.post('/getPrescription', (req, res, next) => spController.getPrescription(req, res, next));
route.post('/getAllDoctorDetailsInsideADepartment', (req, res, next) => spAddDepartmentController.getAllDoctorDetailsInsideADepartment(req, res, next));
route.get('/getRecentAppointments/:appointmentId', (req, res, next) => { spController.getRecentAppointments(req, res, next); });
//to get doctor slot details on deletedoctormodal 
route.post('/getDoctorSlotsDetails', (req, res, next) => spAddDepartmentController.getDoctorSlotsDetails(req, res, next));
route.post('/isDoctorHaveSlots', (req, res, next) => spAddDepartmentController.isDoctorHaveSlots(req, res, next));
route.delete('/deleteDoctor', (req, res, next) => spAddDepartmentController.deleteDoctor(req, res, next));
route.use(error_handle_1.default);
exports.default = route;
