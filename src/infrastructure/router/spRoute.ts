import express from 'express'
import SPRepository from '../repository/spRepository'
import SPUseCase from '../../useCase/spUsecase';
import SPController from '../../adapters/spController'
import GenerateOtp from '../services/generateOtp';
import SendOtp from '../services/sendEmail'; // Ensure correct case
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
route.post('/addDepartment',(req,res,next)=>spController.addDepartment(req,res,next))
route.post('/changeFirstDocumentImage',(req,res,next)=>spController.changeFirstDocumentImage(req,res,next))
route.post('/changeSecondDocumentImage',(req,res,next)=>spController.changeSecondDocumentImage(req,res,next))
route.get('/getAllServiceDetails/:spId', (req, res, next) => spController.getAllServiceDetails(req, res, next));
route.post('/editDepartment', (req, res, next) => spController.editDepartment(req, res, next));
route.post('/deleteDepartment', (req, res, next) => spController.deleteDepartment(req, res, next));




route.use(errorHandle);

export default route;