import express from 'express';

import ChatController from '../../adapters/chatController';
import ChatUseCase from '../../useCase/chatUsecase';
import ChatRepository from '../repository/chatRepository';
import errorHandle from '../middleware/errorHandle';

import { userAuth } from '../middleware/userAuth';


// Repositories
const chatRepository = new ChatRepository();

// Use cases
const chatUsecase = new ChatUseCase(chatRepository);

// Controller
const chatController = new ChatController(chatUsecase);

const route = express.Router();

// Error handling middleware
route.use(errorHandle);


//users side

route.post('/getProvidersList', (req, res, next) => chatController.getProvidersList(req, res, next));

route.post('/sendMessage', (req, res, next) => chatController.sendMessage(req, res, next));

route.post('/getMessages', (req, res, next) => chatController.getMessages(req, res, next));


//providers side

route.post('/SPgetUsersList', (req, res, next) => chatController.SPgetUsersList(req, res, next));

route.post('/SPgetMessages', (req, res, next) => chatController.SPgetMessages(req, res, next));

route.post('/SPsendMessage', (req, res, next) => chatController.SPsendMessage(req, res, next));



export default route;
