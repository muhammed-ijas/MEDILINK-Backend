import { Request, Response, NextFunction } from "express";
import UserUseCase from "../../useCase/user/user-other-usecase";

class userController {
  private userUseCase: UserUseCase;

  constructor(userUseCase: UserUseCase) {
    this.userUseCase = userUseCase;
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id } = req.body;
      let profile = await this.userUseCase.getProfile(Id);
      return res.status(profile.status).json(profile.data);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, data } = req.body;
      let profile = await this.userUseCase.editProfile(Id, data);
      if (profile.status == 200) {
        return res.status(profile.status).json(profile.data);
      }
      return res.status(profile.status).json(profile.message);
    } catch (error) {
      next(error);
    }
  }

  async getFullAppointmentList(req: Request,res: Response,next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.userUseCase.getFullAppointmentList(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async createPaymentSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;
      const session = await this.userUseCase.createPaymentSession(body);
      return res.status(200).json({ id: session.id });
    } catch (error) {
      next(error);
    }
  }

  async confirmWalletPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { appointmentData } = req.body;
      const Appointment = await this.userUseCase.confirmWalletPayment(appointmentData);
      return res.status(200).json({Appointment});
    } catch (error) {
      next(error);
    }
  }

  async updateBookingStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, status } = req.body;
      const result = await this.userUseCase.updateBookingStatus(bookingId, status);
      const updatedBooking = await this.userUseCase.findTheappointmentForqrcodeById(bookingId); 
      res.status(200).json({ result, qrCode: updatedBooking.qrCode });
    } catch (error) {
      next(error);
    }
  }
  
  async cancelAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await this.userUseCase.cancelAppointment(id, reason);
      res.status(200).json({ message: "Appointment cancelled successfully!", result });
    } catch (error) {
      next(error);
    }
  }

  async addReview (req:Request , res: Response , next: NextFunction) {
    try{
      const {id} = req.params;
      const {rating , review } = req.body;
      const result = await this.userUseCase.addReview(id,rating,review);
      res.status(201).json(result);
    }catch(error){
      next(error);
    }
  }

  async getAllEmergencyNumbers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userUseCase.getAllEmergencyNumbers();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getWalletDetails (req:Request , res: Response , next: NextFunction) {
    try{
      const {id} = req.params;
      const result = await this.userUseCase.getWalletDetails(id);
      res.status(201).json(result);
    }catch(error){
      next(error);
    }
  }
  
  async isWalletHaveMoney (req:Request , res: Response , next: NextFunction) {
    try{
      const {id} = req.params;
      const result = await this.userUseCase.isWalletHaveMoney(id);
      res.status(201).json(result);
    }catch(error){
      next(error);
    }
  }

}

export default userController;
