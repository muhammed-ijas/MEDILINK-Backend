import { Request, Response, NextFunction } from "express";
import UserUseCase from "../useCase/userUsecase";
import GenerateOtp from "../infrastructure/services/generateOtp";
import sendOtp from "../infrastructure/services/sendEmail";
import SessionData from "../domain/sessionData";
import Stripe from "stripe";

class userController {
  private userUseCase: UserUseCase;

  constructor(userUseCase: UserUseCase) {
    this.userUseCase = userUseCase;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const verifyUser = await this.userUseCase.checkExist(req.body.email);

      if (verifyUser.data.status == true && req.body.fromGoogle) {
        const user = await this.userUseCase.verifyOtpUser(req.body);
        return res.status(user.status).json(user);
      }

      if (verifyUser.data.status == true) {
        const sendOtp = await this.userUseCase.signup(
          req.body.email,
          req.body.name,
          req.body.phone,
          req.body.password
        );
        return res.status(sendOtp.status).json(sendOtp.data);
      } else {
        return res.status(verifyUser.status).json(verifyUser.data);
      }
    } catch (error) {
      next(error);
    }
  }
  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp: otpObj, email: emailObj } = req.body;
      const otp = otpObj?.otp || otpObj;
      const email = emailObj?.email || emailObj;

      if (typeof email !== "string" || typeof otp !== "number") {
        return res.status(400).json({ message: "Invalid email or OTP format" });
      }

      // Proceed with verification
      const verify = await this.userUseCase.verifyOtp(email, otp);

      if (verify.status == 400) {
        return res.status(verify.status).json({ message: verify.message });
      } else if (verify.status == 200) {
        let save = await this.userUseCase.verifyOtpUser(verify.data);

        if (save) {
          return res.status(save.status).json(save);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      // console.log("login", email, password);

      const user = await this.userUseCase.login(email, password);
      // console.log("user from controller after ogin  :",user)
      return res.status(user.status).json(user.data);
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password, phone } = req.body;

      let resent = await this.userUseCase.resendOtp(
        email,
        name,
        phone,
        password
      );

      if (resent) {
        return res.status(resent.status).json({ message: resent.message });
      }
    } catch (error) {
      next(error);
    }
  }

  async forgotVerifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email } = req.body;

      let verify = await this.userUseCase.verifyOtp(email, otp);

      if (verify.status == 400) {
        return res.status(verify.status).json({ message: verify.message });
      } else if (verify.status == 200) {
        return res.status(verify.status).json(verify.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, email } = req.body;

      const changePassword = await this.userUseCase.resetPassword(
        password,
        email
      );

      return res.status(changePassword.status).json(changePassword.message);
    } catch (error) {
      next(error);
    }
  }
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await this.userUseCase.forgotPassword(email);

      if (user.status == 200) {
        return res.status(user.status).json(user.data);
      } else {
        return res.status(user.status).json(user.data);
      }
    } catch (error) {
      next(error);
    }
  }

  async resentOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      let resend = await this.userUseCase.resentOtp(email);
      if (resend) {
        return res.status(resend.status).json({ message: resend.message });
      }
    } catch (error) {
      next(error);
    }
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

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, password, oldPassword } = req.body;

      let update = await this.userUseCase.updatePassword(
        Id,
        password,
        oldPassword
      );
      // console.log("update :", update);
      return res.status(update.status).json(update.message);
    } catch (error) {
      next(error);
    }
  }


  async getDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await this.userUseCase.getDepartments(
        Number(page),
        Number(limit),
        search as string
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await this.userUseCase.getDoctors(
        Number(page),
        Number(limit),
        search as string
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHospitals(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await this.userUseCase.getHospitals(
        Number(page),
        Number(limit),
        search as string
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getClinicks(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await this.userUseCase.getClinicks(
        Number(page),
        Number(limit),
        search as string
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAmbulances(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await this.userUseCase.getAmbulances(
        Number(page),
        Number(limit),
        search as string
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHomeNurses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await this.userUseCase.getHomeNurses(
        Number(page),
        Number(limit),
        search as string
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHospitalClinicDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // console.log("came in userController :",req.params);

      const { id } = req.params;
      const result = await this.userUseCase.getHospitalClinicDetails(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDepartmentDetails(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("came in userController :",req.params);

      const { id } = req.params;
      const result = await this.userUseCase.getDepartmentDetails(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDoctorDetails(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("came in userController :",req.params);

      const { id } = req.params;
      const result = await this.userUseCase.getDoctorDetails(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDoctorDetailsFromSearchPage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // console.log("came in userController :",req.params);

      const { id } = req.params;
      const result = await this.userUseCase.getDoctorDetailsFromSearchPage(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHomeNurseDetails(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("came in userController :",req.params);

      const { id } = req.params;
      const result = await this.userUseCase.getHomeNurseDetails(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAmbulanceDetails(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("came in userController :",req.params);

      const { id } = req.params;
      const result = await this.userUseCase.getAmbulanceDetails(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getFullAppointmentList(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      // console.log("userId : ", id);

      const result = await this.userUseCase.getFullAppointmentList(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }


  async createPaymentSession(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("came in contyroller ", req.body);
      const { body } = req;
      const session = await this.userUseCase.createPaymentSession(body);
      // console.log("return  in controller ", session);

      return res.status(200).json({ id: session.id });
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
      // console.log(" cancelAppointment controller id ,reason   :", id, reason);

      const result = await this.userUseCase.cancelAppointment(id, reason);

      res
        .status(200)
        .json({ message: "Appointment cancelled successfully!", result });
    } catch (error) {
      next(error);
    }
  }

  async addReview (req:Request , res: Response , next: NextFunction) {
    try{

      // console.log( "addReview controller : " , req.body,req.params);
      
      const {id} = req.params;
      const {rating , review } = req.body;

      const result = await this.userUseCase.addReview(id,rating,review);
      res.status(201).json(result);
    }catch(error){
      next(error);
    }
  }


}

export default userController;
