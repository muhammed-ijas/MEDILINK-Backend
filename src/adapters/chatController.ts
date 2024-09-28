import { Request, Response, NextFunction } from "express";
import ChatUseCase from "../useCase/chatUsecase";

export default class ChatController {
  private chatUseCase: ChatUseCase;

  constructor(chatUseCase: ChatUseCase) {
    this.chatUseCase = chatUseCase;
  }


  async getProvidersList(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("came in controller get providers list ");
      
      const { userId } = req.body; // Extract userId from request body
      const result = await this.chatUseCase.getProvidersList(userId);
      return res.status(200).json(result); // Send back the providers list
    } catch (error) {
      next(error); // Handle error
    }
  }


   // Handle sending a new message
   async sendMessage(req: Request, res: Response, next: NextFunction) {

    // console.log("came to controller :",req.body);
    
    
    const  senderId = req.body.userId;
    const  receiverId = req.body.providerId;
    const  message = req.body.message;

    // console.log(" senderId, receiverId, message ", senderId, receiverId, message);
    

    try {
        const newMessage = await this.chatUseCase.sendMessage(senderId, receiverId, message);
        return res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
}



// Handle retrieving messages between two users

async getMessages(req: Request, res: Response, next: NextFunction) {
  // console.log("came to contriller getmessages :",req.body);
  
    const  senderId = req.body.userId;
    const  receiverId = req.body.providerId;

    // console.log(" senderId, receiverId  :", senderId, receiverId );
    
    try {
        const messages = await this.chatUseCase.getMessages(senderId, receiverId);

        // console.log("messages    :",messages);
        
        return res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
}






























async SPgetUsersList(req: Request, res: Response, next: NextFunction) {
  try {

    console.log("came to controller :",req.body);

    const { providerId } = req.body; // Extract userId from request body
    const result = await this.chatUseCase.SPgetUsersList(providerId);
    return res.status(200).json(result); // Send back the providers list
  } catch (error) {
    next(error); // Handle error
  }
}


 // Handle sending a new message
 async SPsendMessage(req: Request, res: Response, next: NextFunction) {

  console.log("came to controller SPsendMessage :",req.body);
  
  
  const  senderId = req.body.providerId;
  const  receiverId = req.body.userId;
  const  message = req.body.message;

  console.log(" senderId, receiverId, message ", senderId, receiverId, message);
  

  try {
      const newMessage = await this.chatUseCase.SPsendMessage(senderId, receiverId, message);
      return res.status(201).json(newMessage);
  } catch (error) {
      next(error);
  }
}



// Handle retrieving messages between two users

async SPgetMessages(req: Request, res: Response, next: NextFunction) {
console.log("came to contriller getmessages :",req.body);

  const  senderId = req.body.providerId;
  const  receiverId = req.body.userId;

  console.log(" senderId, receiverId  :", senderId, receiverId );
  
  try {
      const messages = await this.chatUseCase.SPgetMessages(senderId, receiverId);

      console.log("messages    :",messages);
      
      return res.status(200).json(messages);
  } catch (error) {
      next(error);
  }
}



}
