import express from 'express';
import AdminController from '../../adapters/admin/admin-controller';
import AdminUseCase from '../../useCase/admin/admin-usecase';
import AdminRepository from '../repository/admin/admin-repository';
import errorHandle from '../middleware/error-handle';
import SendOtp from '../services/send-email'; 

const sendOtp = new SendOtp();  

//repositories
const adminRepository = new AdminRepository();

// usecases
const adminUseCase = new AdminUseCase(adminRepository,sendOtp);
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