import express from 'express'

//repository import
import UserRepository from '../repository/user/user-repository'
import SPRepository from '../repository/service-provider/service-provider-repository';
import SPSearchRepository from '../repository/service-provider/service-provider-search-repository';
import SPAppointmentRepository from '../repository/service-provider/service-provider-appointment-repository';
import DoctorRepository from '../repository/doctor-repository';
import SPCreatePaymentRepository from '../repository/service-provider/service-provider-create-payment-repository';
import SPWalletRepository from '../repository/service-provider/service-provider-wallet-repository';
import SPEditAppointmentRepository from '../repository/service-provider/service-provider-edit-appointment-repository';



//usecase import 
import UserUseCase from '../../useCase/user/user-other-usecase';
import UserRegisterUsecase from '../../useCase/user/user-registration-usecase';
import UserSearchUsecase from '../../useCase/user/user-search-usecase';

//controller import
import UserController from '../../adapters/user/user-other-controller'
import UserRegistrationController from '../../adapters/user/user-registration-controller'
import UserSearchPageController from '../../adapters/user/user-search-controller'

//services import
import GenerateOtp from '../services/generate-otp';
import SendOtp from '../services/send-email'; 
import EncryptPassword from '../services/bcrypt-password';
import JWTToken from '../services/generate-token';
import { userAuth } from '../middleware/user-auth';
import errorHandle from '../middleware/error-handle';
import DepartmentRepository from '../repository/department-repository';


//services
const generateOtp = new GenerateOtp(); 
const sendOtp = new SendOtp();  // Ensure consistent naming
const encryptPassword = new EncryptPassword();
const jwtToken = new JWTToken();

//repositories
const userRepository = new UserRepository();
const departmentRepository = new DepartmentRepository();
const doctorRepository = new DoctorRepository();
const spRepository = new SPRepository();
const spSearchRepository = new SPSearchRepository();
const spAppointmentRepository = new SPAppointmentRepository();
const spCreatePaymentRepository = new SPCreatePaymentRepository();
const spWalletRepository = new SPWalletRepository();
const spEditAppointmentRepository = new SPEditAppointmentRepository();

//useCases 
const userCase = new UserUseCase(userRepository, sendOtp,spRepository,spAppointmentRepository,spCreatePaymentRepository,spWalletRepository,spEditAppointmentRepository);
const userRegisterUsecase = new UserRegisterUsecase(userRepository, encryptPassword, jwtToken, generateOtp, sendOtp);
const userSearchUsecase = new UserSearchUsecase(departmentRepository,doctorRepository,spRepository,spSearchRepository);

//controllers
const userController = new UserController(userCase);
const userRegisterController = new UserRegistrationController(userRegisterUsecase)
const userSearchPageController = new UserSearchPageController(userSearchUsecase)

const route = express.Router();

//to userRegisterController
route.post('/signup', (req, res, next) => userRegisterController.signUp(req, res, next));
route.post('/verify', (req, res, next) => userRegisterController.verifyOtp(req, res, next));
route.post('/fVerify',(req,res,next)=>userRegisterController.forgotVerifyOtp(req,res,next))
route.post('/login', (req, res, next) => userRegisterController.login(req, res, next));
route.post('/resend_otp', (req, res, next) => userRegisterController.resendOtp(req, res, next));
route.post('/resetPassword',(req,res,next)=>userRegisterController.resetPassword(req,res,next))
route.post('/verifyEmail',(req,res,next)=>userRegisterController.forgotPassword(req,res,next))
route.post('/resendOtp',(req,res,next)=>userRegisterController.resentOtp(req,res,next))
route.post('/changePassword',userAuth,(req,res,next)=>userRegisterController.updatePassword(req,res,next))

//profile
route.post('/editProfile',userAuth,(req,res,next)=>userController.updateProfile(req,res,next))
route.post('/getProfile',userAuth,(req,res,next)=>userController.getProfile(req,res,next))


//for search page to userSearchPageController 
route.get('/getDepartments',userAuth,(req,res,next)=>userSearchPageController.getDepartments(req,res,next))
route.get('/getDoctors',userAuth,(req,res,next)=>userSearchPageController.getDoctors(req,res,next))
route.get('/getHospitals',userAuth,(req,res,next)=>userSearchPageController.getHospitals(req,res,next))
route.get('/getClinicks',userAuth,(req,res,next)=>userSearchPageController.getClinicks(req,res,next))
route.get('/getAmbulances',userAuth,(req,res,next)=>userSearchPageController.getAmbulances(req,res,next))
route.get('/getHomeNurses',userAuth,(req,res,next)=>userSearchPageController.getHomeNurses(req,res,next))

route.get('/getHospitalClinicDetails/:id', userAuth, (req, res, next) => userSearchPageController.getHospitalClinicDetails(req, res, next));
route.get('/getDepartmentDetails/:id', userAuth, (req, res, next) => userSearchPageController.getDepartmentDetails(req, res, next));
route.get('/getDoctorDetails/:id', userAuth, (req, res, next) => userSearchPageController.getDoctorDetails(req, res, next));
route.get('/getDoctorDetailsFromSearchPage/:id', userAuth, (req, res, next) => userSearchPageController.getDoctorDetailsFromSearchPage(req, res, next));
route.get('/getHomeNurseDetails/:id', userAuth, (req, res, next) => userSearchPageController.getHomeNurseDetails(req, res, next));
route.get('/getAmbulanceDetails/:id', userAuth, (req, res, next) => userSearchPageController.getAmbulanceDetails(req, res, next));


route.post('/updateBookingStatus', userAuth, (req, res,next) => { userController.updateBookingStatus(req, res ,next);});

route.get('/getFullAppointmentList/:id', userAuth, (req, res,next) => { userController.getFullAppointmentList(req, res ,next);});

route.put('/appointmentCancel/:id', (req, res, next) => userController.cancelAppointment(req, res, next));

route.post('/addReview/:id', (req, res, next) => userController.addReview(req, res, next));

route.get('/getEmergencyNumbers', (req, res, next) => userController.getAllEmergencyNumbers(req, res, next));

route.post('/createPaymentSession', userAuth, (req, res, next) => {userController.createPaymentSession(req, res, next);});

route.get('/getWalletDetails/:id', (req, res, next) => userController.getWalletDetails(req, res, next));
route.get('/isWalletHaveMoney/:id', (req, res, next) => userController.isWalletHaveMoney(req, res, next));
route.post('/confirmWalletPayment', userAuth, (req, res, next) => {userController.confirmWalletPayment(req, res, next);});




route.use(errorHandle);

export default route;
