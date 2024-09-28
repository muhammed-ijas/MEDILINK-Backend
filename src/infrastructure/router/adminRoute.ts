import express from 'express';
import AdminController from '../../adapters/adminController';
import AdminUseCase from '../../useCase/adminUsecase';
import AdminRepository from '../repository/adminRepository';
import SPRepository from '../repository/spRepository';
import errorHandle from '../middleware/errorHandle';
import SendOtp from '../services/sendEmail'; 

const sendOtp = new SendOtp();  

//reositories
const adminRepository = new AdminRepository();
const spRepository = new SPRepository();

// usecases
const adminUseCase = new AdminUseCase(adminRepository, spRepository,sendOtp);
const adminController = new AdminController(adminUseCase);

const route = express.Router();

route.get('/getUnVerifiedServices', (req, res, next) => adminController.getUnVerifiedServices(req, res, next));
route.get('/getVerifiedServices', (req, res, next) => adminController.getVerifiedServices(req, res, next));
route.get('/getUsers', (req, res, next) => adminController.getUsers(req, res, next));
route.post('/approvedService', (req, res, next) => adminController.approvedService(req, res, next));

route.post('/blockUser', (req, res, next) => adminController.blockUser(req, res, next));
route.post('/unblockUser', (req, res, next) => adminController.unblockUser(req, res, next));


route.use(errorHandle);

export default route;
