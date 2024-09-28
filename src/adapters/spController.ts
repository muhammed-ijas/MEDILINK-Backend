import { Request, Response, NextFunction } from "express";
import SPUseCase from "../useCase/spUsecase";
import GenerateOtp from "../infrastructure/services/generateOtp";
import sendOtp from "../infrastructure/services/sendEmail";
import SessionData from '../domain/sessionData'

class spController {
    private spUseCase: SPUseCase;

    constructor(spUseCase: SPUseCase) {
        this.spUseCase = spUseCase;
    }

    
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("from signup function from spController : ",req.body);
      
      const verifySP = await this.spUseCase.checkExist(req.body.email);

     

      if (verifySP.data.status == true) {
        const sendOtp = await this.spUseCase.signup(
          req.body.email,
          req.body.name,
          req.body.phone,
          req.body.password,
          req.body.area,
          req.body.city,
          req.body.latitude,
          req.body.longitude,
          req.body.state,
          req.body.pincode,
          req.body.district
        );
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
      console.log("login",email,password);
      
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

      let resent = await this.spUseCase.resendOtp(
        email,
        name,
        phone,
        password,
        area,
        city,
        latitude,
        longitude,
        state,
        pincode,
        district,
      );

      if (resent) {
        return res.status(resent.status).json({ message: resent.message });
      }
    } catch (error) {
      next(error);
    }
  }

  

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      
      let { Id } = req.body;
      // console.log("from get profile from spcontroller :", req.body);
      

      let profile = await this.spUseCase.getProfile(Id);
      // console.log("from get profile from spcontroller :", profile, "this is that");
      

      return res.status(profile.status).json(profile.data);
    } catch (error) {
      next(error);
    }
  }

  

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, data } = req.body;

      let profile = await this.spUseCase.editProfile(Id, data);

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

      let update = await this.spUseCase.updatePassword(Id, password,oldPassword);

      if (update) {
        return res.status(update.status).json(update.message);
      }
    } catch (error) {
      next(error);
    }
  }

  

  async updateImage(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, imageUrl} = req.body;

      let update = await this.spUseCase.updateImage(Id, imageUrl);

      if (update) {
        return res.status(update.status).json(update.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async changeFirstDocumentImage(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, imageUrl} = req.body;

      let update = await this.spUseCase.changeFirstDocumentImage(Id, imageUrl);

      if (update) {
        return res.status(update.status).json(update.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async changeSecondDocumentImage(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, imageUrl} = req.body;

      let update = await this.spUseCase.changeSecondDocumentImage(Id, imageUrl);

      if (update) {
        return res.status(update.status).json(update.message);
      }
    } catch (error) {
      next(error);
    }
  }
  


  
  async addDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("came to controller",req.body);

      const { spId, department, doctors,avgTime } = req.body;
      const update = await this.spUseCase.addDepartment(spId, department, doctors,avgTime);
      if (update) {
        return res.status(update.status).json(update.message);
      } else {
        return res.status(400).json({ message: "Update failed" });
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllServiceDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { spId } = req.params;
      // console.log("Fetching all service details for SP ID:", spId);

      const services = await this.spUseCase.getAllServiceDetails(spId);
      
      if (services) {
        return res.status(200).json(services);
      } else {
        return res.status(404).json({ message: "Services not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async editDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("Came to editDepartment controller", req.body);

      const spId = req.body.spId
      const  departmentId = req.body.data.departmentId ;
      const name = req.body.data.name ;
      const doctors  = req.body.data.doctors ;

      // console.log("departmentId :",departmentId , "name :",name  , "doctors :",doctors )

      const updateResult = await this.spUseCase.editDepartment(spId,departmentId, name, doctors);

      // console.log("response ffrom spusecase :",updateResult)

      if (updateResult) {
        return res.status(updateResult.status).json(updateResult);
      } else {
        return res.status(400).json({ message: "Update failed" });
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const { spId, departmentId } = req.body;
      const response = await this.spUseCase.deleteDepartment(spId, departmentId);
  
      if (response.success) {
        return res.status(200).json({ message: response.message });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      next(error);
    }
  }


  
  async getFullAppointmentList(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log("spId : ",id);
      
      const result = await this.spUseCase.getFullAppointmentList(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  
  async getRatingsAndReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // console.log("spId  from the controller getRatingsAndReviews : ",id);
      
      const result = await this.spUseCase.getRatingsAndReviews(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }


  async approveAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(" approveAppointment controller id    :",id)
      const result = await this.spUseCase.approveAppointment(id);
      res.status(200).json({ message: 'Appointment approved successfully!', result });
    } catch (error) {
      next(error);
    }
  }



  async completeAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(" completeAppointment controller id    :",id)
      const result = await this.spUseCase.completeAppointment(id);
      res.status(200).json({ message: 'Appointment completed successfully!', result });
    } catch (error) {
      next(error);
    }
  }



  async cancelAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      console.log(" cancelAppointment controller id ,reason   :",id,reason )

      const result = await this.spUseCase.cancelAppointment(id, reason);
      
      res.status(200).json({ message: 'Appointment cancelled successfully!', result });
    } catch (error) {
      next(error);
    }
  }


}

export default spController;
