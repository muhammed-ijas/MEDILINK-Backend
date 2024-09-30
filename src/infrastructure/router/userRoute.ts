import express from 'express'
import UserRepository from '../repository/userRepository'
import UserUseCase from '../../useCase/userUsecase';
import UserController from '../../adapters/userController'
import GenerateOtp from '../services/generateOtp';
import SendOtp from '../services/sendEmail'; // Ensure correct case
import EncryptPassword from '../services/bcryptPassword';
import JWTToken from '../services/generateToken';
import { userAuth } from '../middleware/userAuth';
import errorHandle from '../middleware/errorHandle';
import DepartmentRepository from '../repository/departmentRepository';
import DoctorRepository from '../repository/doctorRepository';
import SPRepository from '../repository/spRepository';

const stripe = require("stripe")(process.env.STRIPE_SECRET)

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

//useCases 
const userCase = new UserUseCase(userRepository, encryptPassword, jwtToken, generateOtp, sendOtp,departmentRepository,doctorRepository,spRepository);

//controllers
const userController = new UserController(userCase);

const route = express.Router();

route.post('/signup', (req, res, next) => userController.signUp(req, res, next));
route.post('/verify', (req, res, next) => userController.verifyOtp(req, res, next));
route.post('/fVerify',(req,res,next)=>userController.forgotVerifyOtp(req,res,next))
route.post('/login', (req, res, next) => userController.login(req, res, next));
route.post('/resend_otp', (req, res, next) => userController.resendOtp(req, res, next));
route.post('/resetPassword',(req,res,next)=>userController.resetPassword(req,res,next))
route.post('/verifyEmail',(req,res,next)=>userController.forgotPassword(req,res,next))
route.post('/resendOtp',(req,res,next)=>userController.resentOtp(req,res,next))
route.post('/getProfile',userAuth,(req,res,next)=>userController.getProfile(req,res,next))
route.post('/editProfile',userAuth,(req,res,next)=>userController.updateProfile(req,res,next))
route.post('/changePassword',userAuth,(req,res,next)=>userController.updatePassword(req,res,next))

//for search page 
route.get('/getDepartments',userAuth,(req,res,next)=>userController.getDepartments(req,res,next))
route.get('/getDoctors',userAuth,(req,res,next)=>userController.getDoctors(req,res,next))
route.get('/getHospitals',userAuth,(req,res,next)=>userController.getHospitals(req,res,next))
route.get('/getClinicks',userAuth,(req,res,next)=>userController.getClinicks(req,res,next))
route.get('/getAmbulances',userAuth,(req,res,next)=>userController.getAmbulances(req,res,next))
route.get('/getHomeNurses',userAuth,(req,res,next)=>userController.getHomeNurses(req,res,next))


route.get('/getHospitalClinicDetails/:id', userAuth, (req, res, next) => userController.getHospitalClinicDetails(req, res, next));
route.get('/getDepartmentDetails/:id', userAuth, (req, res, next) => userController.getDepartmentDetails(req, res, next));

route.get('/getDoctorDetails/:id', userAuth, (req, res, next) => userController.getDoctorDetails(req, res, next));
route.get('/getDoctorDetailsFromSearchPage/:id', userAuth, (req, res, next) => userController.getDoctorDetailsFromSearchPage(req, res, next));



route.get('/getHomeNurseDetails/:id', userAuth, (req, res, next) => userController.getHomeNurseDetails(req, res, next));
route.get('/getAmbulanceDetails/:id', userAuth, (req, res, next) => userController.getAmbulanceDetails(req, res, next));


route.post('/createPaymentSession', userAuth, (req, res, next) => {userController.createPaymentSession(req, res, next);});

route.post('/updateBookingStatus', userAuth, (req, res,next) => { userController.updateBookingStatus(req, res ,next);});

route.get('/getFullAppointmentList/:id', userAuth, (req, res,next) => { userController.getFullAppointmentList(req, res ,next);});

route.put('/appointmentCancel/:id', (req, res, next) => userController.cancelAppointment(req, res, next));

route.post('/addReview/:id', (req, res, next) => userController.addReview(req, res, next));


route.get('/getEmergencyNumbers', (req, res, next) => userController.getAllEmergencyNumbers(req, res, next));





route.use(errorHandle);

export default route;
