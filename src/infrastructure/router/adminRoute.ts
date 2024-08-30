import express from 'express';
import AdminController from '../../adapters/adminController';
import AdminUseCase from '../../useCase/adminUsecase';
import AdminRepository from '../repository/adminRepository';
import SPRepository from '../repository/spRepository';
import errorHandle from '../middleware/errorHandle';

const adminRepository = new AdminRepository();
const spRepository = new SPRepository();
const adminUseCase = new AdminUseCase(adminRepository, spRepository);
const adminController = new AdminController(adminUseCase);

const route = express.Router();

route.get('/getUnVerifiedServices', (req, res, next) => adminController.getUnVerifiedServices(req, res, next));
route.get('/getVerifiedServices', (req, res, next) => adminController.getVerifiedServices(req, res, next));
route.post('/approvedService', (req, res, next) => adminController.approvedService(req, res, next));

route.use(errorHandle);

export default route;
