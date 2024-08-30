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
      console.log("Came in controller get unverified services section ");
      const response = await this.AdminUseCase.getUnverifiedServices();
      console.log(response);
      return res.status(200).json(response); // Make sure to send the response back to the client
    } catch (error) {
      next(error); // Handle errors appropriately
    }
  }
  
  async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("Came in controller get  services section ");
      const response = await this.AdminUseCase.getAllServices();
      console.log(response);
      return res.status(200).json(response); // Make sure to send the response back to the client
    } catch (error) {
      next(error); // Handle errors appropriately
    }
  }

  async getVerifiedServices(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("Came in controller get  services section ");
      const response = await this.AdminUseCase.getVerifiedServices();
      console.log(response);
      return res.status(200).json(response); // Make sure to send the response back to the client
    } catch (error) {
      next(error); // Handle errors appropriately
    }
  }



  async approvedService(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("came in controller admin approval request",req.body)

      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'Service provider ID is required' });
      }
      const response = await this.AdminUseCase.approvedService(id);
      console.log("response in controller :",response);
      
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  
}

export default adminController;
