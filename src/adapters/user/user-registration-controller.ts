import { Request, Response, NextFunction } from "express";
import UserUseCase from "../../useCase/user/user-registration-usecase";

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
        const sendOtp = await this.userUseCase.signup(req.body.email,req.body.name,req.body.phone,req.body.password);
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
      const user = await this.userUseCase.login(email, password);      
      return res.status(user.status).json(user.data);
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password, phone } = req.body;
      let resent = await this.userUseCase.resendOtp(email,name,phone,password);
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
      const changePassword = await this.userUseCase.resetPassword(password,email);
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

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, password, oldPassword } = req.body;
      let update = await this.userUseCase.updatePassword(Id,password,oldPassword);
      return res.status(update.status).json(update);
    } catch (error) {
      next(error);
    }
  }

}

export default userController;
