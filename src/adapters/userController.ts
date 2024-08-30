import { Request, Response, NextFunction } from "express";
import UserUseCase from "../useCase/userUsecase";
import GenerateOtp from "../infrastructure/services/generateOtp";
import sendOtp from "../infrastructure/services/sendEmail";
import SessionData from '../domain/sessionData'

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

      if (typeof email !== 'string' || typeof otp !== 'number') {
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
      console.log("login",email,password);
      
      const user = await this.userUseCase.login(email, password);
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
      let { Id, password ,oldPassword} = req.body;

      let update = await this.userUseCase.updatePassword(Id, password,oldPassword);

      if (update) {
        return res.status(update.status).json(update.message);
      }
    } catch (error) {
      next(error);
    }
  }


  async getDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.userUseCase.getDepartments(Number(page), Number(limit));
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.userUseCase.getDoctors(Number(page), Number(limit));
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getServiceProviders(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.userUseCase.getServiceProviders(Number(page), Number(limit));
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

}

export default userController;
