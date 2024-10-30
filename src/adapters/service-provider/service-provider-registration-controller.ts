import { Request, Response, NextFunction } from "express";
import SPUseCase from "../../useCase/service-provider/service-provider-registration-usecase";

class spController {
    private spUseCase: SPUseCase;

    constructor(spUseCase: SPUseCase) {
        this.spUseCase = spUseCase;
    }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      
      const verifySP = await this.spUseCase.checkExist(req.body.email);

      if (verifySP.data.status == true) {
        const sendOtp = await this.spUseCase.signup(req.body.email,req.body.name,req.body.phone,req.body.password,req.body.area,req.body.city,req.body.latitude,req.body.longitude,req.body.state,req.body.pincode,req.body.district);
        return res.status(sendOtp.status).json(sendOtp.data);
      } else {  
        return res.status(verifySP.status).json(verifySP.data);
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
      const verify = await this.spUseCase.verifyOtp(email, otp);
      
      if (verify.status == 400) {
        return res.status(verify.status).json({ message: verify.message });
      } else if (verify.status == 200) {
        let save = await this.spUseCase.verifyOtpSP(verify.data);
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
      const sp = await this.spUseCase.login(email, password);
      return res.status(sp.status).json(sp.data);
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email,
        name,
        password,
        phone,
        area,
        city,
        latitude,
        longitude,
        state,
        pincode,
        district, } = req.body;
      let resent = await this.spUseCase.resendOtp(email,name,phone,password,area,city,latitude,longitude,state,pincode,district);
      if (resent) {
        return res.status(resent.status).json({ message: resent.message });
      }
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, password ,oldPassword} = req.body;
      let update = await this.spUseCase.updatePassword(Id, password,oldPassword);
      if (update) {
        return res.status(update.status).json(update.message);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default spController;
