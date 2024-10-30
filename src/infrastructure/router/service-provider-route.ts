import express from 'express'

//import repositories
import SPRepository from '../repository/service-provider/service-provider-repository'
import SPRegistrationRepository from '../repository/service-provider/service-provider-registration-repository'
import SPProfileRepository from '../repository/service-provider/service-provider-profile-repository'
import SPAppointmentRepository from '../repository/service-provider/service-provider-appointment-repository'
import SPAddDepartmentRepository from '../repository/service-provider/service-provider-add-department-repository'
import SPEditAppointmentRepository from '../repository/service-provider/service-provider-edit-appointment-repository'
import SPEmergencyRepository from '../repository/service-provider/service-provider-emergency-repository'
import SPPrescriptionRepository from '../repository/service-provider/service-provider-prescription-repository'
import SPAddDoctorRepository from '../repository/service-provider/service-provider-add-doctor-repository'
import SPEditDepartmentRepository from '../repository/service-provider/service-provider-edit-department-repository'
import SPDeleteDepartmentRepository from '../repository/service-provider/service-provider-delete-department-repository'
import SPEditDoctorRepository from '../repository/service-provider/service-provider-edit-doctor-repository'
import SPDeleteDoctorRepository from '../repository/service-provider/service-provider-delete-doctor-repository'

//import usecases
import SPUseCase from '../../useCase/service-provider/service-provider-usecase';
import SPRegistrationUsecase from '../../useCase/service-provider/service-provider-registration-usecase';
import SPProfileUsecase from '../../useCase/service-provider/serrvice-provider-profile-usecase';
import SPAddDepartmentUsecase from '../../useCase/service-provider/service-provider-add-department-usecase';

//import controllers
import SPController from '../../adapters/service-provider/service-provider-controller'
import SPAddDepartmentController from '../../adapters/service-provider/service-provider-add-department-controller'
import SPProfileController from '../../adapters/service-provider/service-provider-profile-controller'
import SPRegistrationController from '../../adapters/service-provider/service-provider-registration-controller'

import GenerateOtp from '../services/generate-otp';
import SendOtp from '../services/send-email'; 
import EncryptPassword from '../services/bcrypt-password';
import JWTToken from '../services/generate-token';
import errorHandle from '../middleware/error-handle';
import { spAuth } from '../middleware/service-provider-auth';


//services
const generateOtp = new GenerateOtp(); 
const sendOtp = new SendOtp();  
const encryptPassword = new EncryptPassword();
const jwtToken = new JWTToken();

//repositories
const spRepository = new SPRepository();
const spRegistrationRepository = new SPRegistrationRepository();
const spProfileRepository = new SPProfileRepository();
const spAppointmentRepository = new SPAppointmentRepository();
const spAddDepartmentRepository = new SPAddDepartmentRepository();
const spEditAppointmentRepository = new SPEditAppointmentRepository();
const spEmergencyRepository = new SPEmergencyRepository();
const spPrescriptionRepository = new SPPrescriptionRepository();
const spAddDoctorRepository = new SPAddDoctorRepository();
const spEditDepartmentRepository = new SPEditDepartmentRepository();
const spDeleteDepartmentRepository = new SPDeleteDepartmentRepository();
const spEditDoctorRepository = new SPEditDoctorRepository();
const spDeleteDoctorRepository = new SPDeleteDoctorRepository();

//useCases 
const spUseCase = new SPUseCase(spRepository,spAppointmentRepository,sendOtp,spEditAppointmentRepository,spEmergencyRepository,spPrescriptionRepository);
const spRegistrationUsecase = new SPRegistrationUsecase(spRegistrationRepository, encryptPassword, jwtToken, generateOtp, sendOtp);
const spProfileUsecase = new SPProfileUsecase(spProfileRepository,spRegistrationRepository);
const spAddDepartmentUsecase = new SPAddDepartmentUsecase(spAddDepartmentRepository,spRepository,spAddDoctorRepository,spEditDepartmentRepository,spDeleteDepartmentRepository,spEditDoctorRepository,spDeleteDoctorRepository);

//controllers
const spController = new SPController(spUseCase);
const spAddDepartmentController = new SPAddDepartmentController(spAddDepartmentUsecase);
const spProfileController = new SPProfileController(spProfileUsecase);
const spRegistrationController = new SPRegistrationController(spRegistrationUsecase);

const route = express.Router();

route.post('/signup', (req, res, next) => spRegistrationController.signUp(req, res, next));
route.post('/otpVerify', (req , res , next)=> spRegistrationController.verifyOtp(req , res , next));
route.post('/login', (req , res , next)=> spRegistrationController.login(req , res , next));
route.post('/resendOtp', (req , res , next)=> spRegistrationController.resendOtp(req , res , next));
route.post('/getProfile',(req,res,next)=>spProfileController.getProfile(req,res,next))
route.post('/editProfile',(req,res,next)=>spProfileController.updateProfile(req,res,next))
route.post('/changePassword',(req,res,next)=>spRegistrationController.updatePassword(req,res,next))

route.post('/upload-profile-image',(req,res,next)=>spProfileController.updateImage(req,res,next))


route.post('/changeFirstDocumentImage',(req,res,next)=>spProfileController.changeFirstDocumentImage(req,res,next))
route.post('/changeSecondDocumentImage',(req,res,next)=>spProfileController.changeSecondDocumentImage(req,res,next))


route.post('/addDepartment',(req,res,next)=>spAddDepartmentController.addDepartment(req,res,next))

route.post('/addDoctorToDepartment',(req,res,next)=>spAddDepartmentController.addDoctorToDepartment(req,res,next))

route.post('/editDepartment', (req, res, next) => spAddDepartmentController.editDepartment(req, res, next));
route.post('/deleteDepartment', (req, res, next) => spAddDepartmentController.deleteDepartment(req, res, next));


route.get('/getAllServiceDetails/:spId', (req, res, next) => spAddDepartmentController.getAllServiceDetails(req, res, next));

route.get('/getFullAppointmentList/:id', (req, res,next) => { spController.getFullAppointmentList(req, res ,next);});

// Route to get doctor details
route.get('/getDoctorDetails/:id', (req, res, next) => {spAddDepartmentController.getDoctorDetails(req, res, next);});
route.post('/updateDoctorDetails', (req, res, next) => {spAddDepartmentController.updateDoctorDetails(req, res, next);});
  // Route to get all appointments for a specific doctor
route.get('/getAppointmentDetails/:id', (req, res, next) => {spController.getAppointmentDetails(req, res, next);});

//ratings 
route.get('/getRatingsAndReviews/:id', (req, res,next) => { spProfileController.getRatingsAndReviews(req, res ,next);});

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

route.get('/getRecentAppointments/:appointmentId', (req, res,next) => { spController.getRecentAppointments(req, res ,next);});

//to get doctor slot details on deletedoctormodal 
route.post('/getDoctorSlotsDetails', (req, res, next) => spAddDepartmentController.getDoctorSlotsDetails(req, res, next));

route.post('/isDoctorHaveSlots', (req, res, next) => spAddDepartmentController.isDoctorHaveSlots(req, res, next));

route.delete('/deleteDoctor', (req, res, next) => spAddDepartmentController.deleteDoctor(req, res, next));




route.use(errorHandle);


export default route;