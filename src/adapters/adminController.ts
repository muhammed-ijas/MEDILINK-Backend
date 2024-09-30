import { Request, Response, NextFunction } from "express";
import adminUseCase from "../useCase/adminUsecase";
import sp from "../domain/sp";

class adminController {
  private AdminUseCase: adminUseCase;

  constructor(AdminUsecase: adminUseCase) {
    this.AdminUseCase = AdminUsecase;
  }

 
  async getUnVerifiedServices(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.AdminUseCase.getUnverifiedServices();
      return res.status(200).json(response); // Make sure to send the response back to the client
    } catch (error) {
      next(error); // Handle errors appropriately
    }
  }

  
  async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.AdminUseCase.getAllServices();
      return res.status(200).json(response); // Make sure to send the response back to the client
    } catch (error) {
      next(error); // Handle errors appropriately
    }
  }


  async getVerifiedServices(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.AdminUseCase.getVerifiedServices();
      return res.status(200).json(response); // Make sure to send the response back to the client
    } catch (error) {
      next(error); // Handle errors appropriately
    }
  }


  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.AdminUseCase.getUsers();
      return res.status(200).json(response); // Make sure to send the response back to the client
    } catch (error) {
      next(error); // Handle errors appropriately
    }
  }


  async approvedService(req: Request, res: Response, next: NextFunction) {
    try {

      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'Service provider ID is required' });
      }
      const response = await this.AdminUseCase.approvedService(id);
      
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }


  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      await this.AdminUseCase.blockUser(userId);
      res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
      next(error);
    }
  }

  
  async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      await this.AdminUseCase.unblockUser(userId);
      res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
      next(error);
    }
  }
  
}

export default adminController;
