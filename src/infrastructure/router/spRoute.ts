import express from 'express'
import SPRepository from '../repository/spRepository'
import SPUseCase from '../../useCase/spUsecase';
import SPController from '../../adapters/spController'
import GenerateOtp from '../services/generateOtp';
import SendOtp from '../services/sendEmail'; 
import EncryptPassword from '../services/bcryptPassword';
import JWTToken from '../services/generateToken';
import errorHandle from '../middleware/errorHandle';
import { spAuth } from '../middleware/spAuth';


//services
const generateOtp = new GenerateOtp(); 
const sendOtp = new SendOtp();  
const encryptPassword = new EncryptPassword();
const jwtToken = new JWTToken();

//repositories
const spRepository = new SPRepository();

//useCases 
const spCase = new SPUseCase(spRepository, encryptPassword, jwtToken, generateOtp, sendOtp);

//controllers
const spController = new SPController(spCase);

const route = express.Router();

route.post('/signup', (req, res, next) => spController.signUp(req, res, next));
route.post('/otpVerify', (req , res , next)=> spController.verifyOtp(req , res , next));
route.post('/login', (req , res , next)=> spController.login(req , res , next));
route.post('/resendOtp', (req , res , next)=> spController.resendOtp(req , res , next));
route.post('/getProfile',(req,res,next)=>spController.getProfile(req,res,next))
route.post('/editProfile',(req,res,next)=>spController.updateProfile(req,res,next))
route.post('/changePassword',(req,res,next)=>spController.updatePassword(req,res,next))
route.post('/upload-profile-image',(req,res,next)=>spController.updateImage(req,res,next))


route.post('/changeFirstDocumentImage',(req,res,next)=>spController.changeFirstDocumentImage(req,res,next))
route.post('/changeSecondDocumentImage',(req,res,next)=>spController.changeSecondDocumentImage(req,res,next))


route.post('/addDepartment',(req,res,next)=>spController.addDepartment(req,res,next))

route.post('/addDoctorToDepartment',(req,res,next)=>spController.addDoctorToDepartment(req,res,next))

route.post('/editDepartment', (req, res, next) => spController.editDepartment(req, res, next));
route.post('/deleteDepartment', (req, res, next) => spController.deleteDepartment(req, res, next));


route.get('/getAllServiceDetails/:spId', (req, res, next) => spController.getAllServiceDetails(req, res, next));

route.get('/getFullAppointmentList/:id', (req, res,next) => { spController.getFullAppointmentList(req, res ,next);});

// Route to get doctor details
route.get('/getDoctorDetails/:id', (req, res, next) => {spController.getDoctorDetails(req, res, next);});
route.post('/updateDoctorDetails', (req, res, next) => {spController.updateDoctorDetails(req, res, next);});
  // Route to get all appointments for a specific doctor
route.get('/getAppointmentDetails/:id', (req, res, next) => {spController.getAppointmentDetails(req, res, next);});

//ratings 
route.get('/getRatingsAndReviews/:id', (req, res,next) => { spController.getRatingsAndReviews(req, res ,next);});

route.put('/appointmentApprove/:id', (req, res, next) => spController.approveAppointment(req, res, next));
route.put('/completeAppointment/:id', (req, res, next) => spController.completeAppointment(req, res, next));
route.put('/appointmentCancel/:id', (req, res, next) => spController.cancelAppointment(req, res, next));

//for emergency contacts
route.get('/getEmergencyNumber/:id', (req, res, next) => spController.getEmergencyNumber(req, res, next));

route.post('/updateEmergencyNumber', (req, res, next) => spController.updateEmergencyNumber(req, res, next));
route.post('/deleteEmergencyNumber', (req, res, next) => spController.deleteEmergencyNumber(req, res, next));

route.post('/addPrescriptionToAppointment', (req, res, next) => spController.addPrescriptionToAppointment(req, res, next));

route.post('/getPrescription', (req, res, next) => spController.getPrescription(req, res, next));

route.post('/getAllDoctorDetailsInsideADepartment', (req, res, next) => spController.getAllDoctorDetailsInsideADepartment(req, res, next));

route.get('/getRecentAppointments/:appointmentId', (req, res,next) => { spController.getRecentAppointments(req, res ,next);});

//to get doctor slot details on deletedoctormodal 
route.post('/getDoctorSlotsDetails', (req, res, next) => spController.getDoctorSlotsDetails(req, res, next));

route.post('/isDoctorHaveSlots', (req, res, next) => spController.isDoctorHaveSlots(req, res, next));

route.delete('/deleteDoctor', (req, res, next) => spController.deleteDoctor(req, res, next));




route.use(errorHandle);


export default route;