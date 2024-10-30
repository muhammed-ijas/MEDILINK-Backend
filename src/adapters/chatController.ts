import { Request, Response, NextFunction } from "express";
import ChatUseCase from "../useCase/chat-usecase";

export default class ChatController {
  private chatUseCase: ChatUseCase;

  constructor(chatUseCase: ChatUseCase) {
    this.chatUseCase = chatUseCase;
  }

  async getProvidersList(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body; // Extract userId from request body
      const result = await this.chatUseCase.getProvidersList(userId);
      return res.status(200).json(result); // Send back the providers list
    } catch (error) {
      next(error); // Handle error
    }
  }

  // Handle sending a new message
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    const senderId = req.body.userId;
    const receiverId = req.body.providerId;
    const message = req.body.message;

    try {
      const newMessage = await this.chatUseCase.sendMessage(
        senderId,
        receiverId,
        message
      );
      return res.status(201).json(newMessage);
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    const senderId = req.body.userId;
    const receiverId = req.body.providerId;
    try {
      const messages = await this.chatUseCase.getMessages(senderId, receiverId);

      return res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }

  async SPgetUsersList(req: Request, res: Response, next: NextFunction) {
    try {
      const { providerId } = req.body; // Extract userId from request body
      const result = await this.chatUseCase.SPgetUsersList(providerId);
      return res.status(200).json(result); // Send back the providers list
    } catch (error) {
      next(error); // Handle error
    }
  }
  // Handle sending a new message
  async SPsendMessage(req: Request, res: Response, next: NextFunction) {
    const senderId = req.body.providerId;
    const receiverId = req.body.userId;
    const message = req.body.message;
    try {
      const newMessage = await this.chatUseCase.SPsendMessage(
        senderId,
        receiverId,
        message
      );
      return res.status(201).json(newMessage);
    } catch (error) {
      next(error);
    }
  }
  // Handle retrieving messages between two users

  async SPgetMessages(req: Request, res: Response, next: NextFunction) {
    const senderId = req.body.providerId;
    const receiverId = req.body.userId;

    try {
      const messages = await this.chatUseCase.SPgetMessages(
        senderId,
        receiverId
      );
      return res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }
}
