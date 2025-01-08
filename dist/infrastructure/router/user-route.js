"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//repository import
const user_repository_1 = __importDefault(require("../repository/user/user-repository"));
const service_provider_repository_1 = __importDefault(require("../repository/service-provider/service-provider-repository"));
const service_provider_search_repository_1 = __importDefault(require("../repository/service-provider/service-provider-search-repository"));
const service_provider_appointment_repository_1 = __importDefault(require("../repository/service-provider/service-provider-appointment-repository"));
const doctor_repository_1 = __importDefault(require("../repository/doctor-repository"));
const service_provider_create_payment_repository_1 = __importDefault(require("../repository/service-provider/service-provider-create-payment-repository"));
const service_provider_wallet_repository_1 = __importDefault(require("../repository/service-provider/service-provider-wallet-repository"));
const service_provider_edit_appointment_repository_1 = __importDefault(require("../repository/service-provider/service-provider-edit-appointment-repository"));
//usecase import 
const user_other_usecase_1 = __importDefault(require("../../useCase/user/user-other-usecase"));
const user_registration_usecase_1 = __importDefault(require("../../useCase/user/user-registration-usecase"));
const user_search_usecase_1 = __importDefault(require("../../useCase/user/user-search-usecase"));
//controller import
const user_other_controller_1 = __importDefault(require("../../adapters/user/user-other-controller"));
const user_registration_controller_1 = __importDefault(require("../../adapters/user/user-registration-controller"));
const user_search_controller_1 = __importDefault(require("../../adapters/user/user-search-controller"));
//services import
const generate_otp_1 = __importDefault(require("../services/generate-otp"));
const send_email_1 = __importDefault(require("../services/send-email"));
const bcrypt_password_1 = __importDefault(require("../services/bcrypt-password"));
const generate_token_1 = __importDefault(require("../services/generate-token"));
const user_auth_1 = require("../middleware/user-auth");
const error_handle_1 = __importDefault(require("../middleware/error-handle"));
const department_repository_1 = __importDefault(require("../repository/department-repository"));
//services
const generateOtp = new generate_otp_1.default();
const sendOtp = new send_email_1.default(); // Ensure consistent naming
const encryptPassword = new bcrypt_password_1.default();
const jwtToken = new generate_token_1.default();
//repositories
const userRepository = new user_repository_1.default();
const departmentRepository = new department_repository_1.default();
const doctorRepository = new doctor_repository_1.default();
const spRepository = new service_provider_repository_1.default();
const spSearchRepository = new service_provider_search_repository_1.default();
const spAppointmentRepository = new service_provider_appointment_repository_1.default();
const spCreatePaymentRepository = new service_provider_create_payment_repository_1.default();
const spWalletRepository = new service_provider_wallet_repository_1.default();
const spEditAppointmentRepository = new service_provider_edit_appointment_repository_1.default();
//useCases 
const userCase = new user_other_usecase_1.default(userRepository, sendOtp, spRepository, spAppointmentRepository, spCreatePaymentRepository, spWalletRepository, spEditAppointmentRepository);
const userRegisterUsecase = new user_registration_usecase_1.default(userRepository, encryptPassword, jwtToken, generateOtp, sendOtp);
const userSearchUsecase = new user_search_usecase_1.default(departmentRepository, doctorRepository, spRepository, spSearchRepository);
//controllers
const userController = new user_other_controller_1.default(userCase);
const userRegisterController = new user_registration_controller_1.default(userRegisterUsecase);
const userSearchPageController = new user_search_controller_1.default(userSearchUsecase);
const route = express_1.default.Router();
//to userRegisterController
route.post('/signup', (req, res, next) => userRegisterController.signUp(req, res, next));
route.post('/verify', (req, res, next) => userRegisterController.verifyOtp(req, res, next));
route.post('/fVerify', (req, res, next) => userRegisterController.forgotVerifyOtp(req, res, next));
route.post('/login', (req, res, next) => userRegisterController.login(req, res, next));
route.post('/resend_otp', (req, res, next) => userRegisterController.resendOtp(req, res, next));
route.post('/resetPassword', (req, res, next) => userRegisterController.resetPassword(req, res, next));
route.post('/verifyEmail', (req, res, next) => userRegisterController.forgotPassword(req, res, next));
route.post('/resendOtp', (req, res, next) => userRegisterController.resentOtp(req, res, next));
route.post('/changePassword', user_auth_1.userAuth, (req, res, next) => userRegisterController.updatePassword(req, res, next));
//profile
route.post('/editProfile', user_auth_1.userAuth, (req, res, next) => userController.updateProfile(req, res, next));
route.post('/getProfile', user_auth_1.userAuth, (req, res, next) => userController.getProfile(req, res, next));
//for search page to userSearchPageController 
route.get('/getDepartments', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getDepartments(req, res, next));
route.get('/getDoctors', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getDoctors(req, res, next));
route.get('/getHospitals', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getHospitals(req, res, next));
route.get('/getClinicks', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getClinicks(req, res, next));
route.get('/getAmbulances', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getAmbulances(req, res, next));
route.get('/getHomeNurses', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getHomeNurses(req, res, next));
route.get('/getHospitalClinicDetails/:id', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getHospitalClinicDetails(req, res, next));
route.get('/getDepartmentDetails/:id', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getDepartmentDetails(req, res, next));
route.get('/getDoctorDetails/:id', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getDoctorDetails(req, res, next));
route.get('/getDoctorDetailsFromSearchPage/:id', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getDoctorDetailsFromSearchPage(req, res, next));
route.get('/getHomeNurseDetails/:id', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getHomeNurseDetails(req, res, next));
route.get('/getAmbulanceDetails/:id', user_auth_1.userAuth, (req, res, next) => userSearchPageController.getAmbulanceDetails(req, res, next));
route.post('/updateBookingStatus', user_auth_1.userAuth, (req, res, next) => { userController.updateBookingStatus(req, res, next); });
route.get('/getFullAppointmentList/:id', user_auth_1.userAuth, (req, res, next) => { userController.getFullAppointmentList(req, res, next); });
route.put('/appointmentCancel/:id', (req, res, next) => userController.cancelAppointment(req, res, next));
route.post('/addReview/:id', (req, res, next) => userController.addReview(req, res, next));
route.get('/getEmergencyNumbers', (req, res, next) => userController.getAllEmergencyNumbers(req, res, next));
route.post('/createPaymentSession', user_auth_1.userAuth, (req, res, next) => { userController.createPaymentSession(req, res, next); });
route.get('/getWalletDetails/:id', (req, res, next) => userController.getWalletDetails(req, res, next));
route.get('/isWalletHaveMoney/:id', (req, res, next) => userController.isWalletHaveMoney(req, res, next));
route.post('/confirmWalletPayment', user_auth_1.userAuth, (req, res, next) => { userController.confirmWalletPayment(req, res, next); });
route.use(error_handle_1.default);
exports.default = route;
