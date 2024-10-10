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

      let profile = await this.spUseCase.getProfile(Id);
      
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
  

  async addDoctorToDepartment(req: Request, res: Response, next: NextFunction) {
    try {

      console.log("came in controller addDoctorToDepartment",req.body);
      
      const { spId, department, doctors } = req.body;

      console.log(doctors);
      
      const update = await this.spUseCase.addDoctorToDepartment(spId, department, doctors);

      if (update) {
        return res.status(update.status).json(update.message);
      } else {
        return res.status(400).json({ message: "Update failed" });
      }
    } catch (error) {
      next(error);
    }
  }
  
  async addDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const { spId, department, avgTime } = req.body;
  
      const update = await this.spUseCase.addDepartment(spId, department, avgTime);
  
      if (update) {
        return res.status(update.status).json({ message: update.message });
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

      const spId = req.body.spId
      const  departmentId = req.body.data.departmentId ;
      const name = req.body.data.name ;
      const doctors  = req.body.data.doctors ;


      const updateResult = await this.spUseCase.editDepartment(spId,departmentId, name, doctors);


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
      
      const result = await this.spUseCase.getRatingsAndReviews(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }


  async approveAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.spUseCase.approveAppointment(id);
      res.status(200).json({ message: 'Appointment approved successfully!', result });
    } catch (error) {
      next(error);
    }
  }



  async completeAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
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
      const result = await this.spUseCase.cancelAppointment(id, reason);
      res.status(200).json({ message: 'Appointment cancelled successfully!', result });
    } catch (error) {
      next(error);
    }
  }
  
  async getEmergencyNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.spUseCase.getEmergencyNumber(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  

  async updateEmergencyNumber(req: Request, res: Response, next: NextFunction) {
    try {

      const { id ,emergencyNumber} = req.body;
      const result = await this.spUseCase.updateEmergencyNumber(id,emergencyNumber);
      return res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }
  

  async deleteEmergencyNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
      const result = await this.spUseCase.deleteEmergencyNumber(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDoctorDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const doctorDetails = await this.spUseCase.getDoctorDetails(id);
      return res.status(200).json(doctorDetails);
    } catch (error) {
      next(error);
    }
  }

  async getAppointmentDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.spUseCase.getAppointmentDetails(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }


  async addPrescriptionToAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { appointmentId ,prescription} = req.body;
      const result = await this.spUseCase.addPrescriptionToAppointment(appointmentId,prescription);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }




  async getPrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { appointmentId } = req.body;
      const result = await this.spUseCase.getPrescription(appointmentId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }




  
  
  async getRecentAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const { appointmentId } = req.params;      
      const result = await this.spUseCase.getRecentAppointments(appointmentId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }


  
  async updateDoctorDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorData = req.body;
      const result = await this.spUseCase.updateDoctorDetails(doctorData);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }


  
  async getAllDoctorDetailsInsideADepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const { departmentId } = req.body;
      const result = await this.spUseCase.getAllDoctorDetailsInsideADepartment(departmentId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  
  async getDoctorSlotsDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorId } = req.body;
      const result = await this.spUseCase.getDoctorSlotsDetails(doctorId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  
  async isDoctorHaveSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorId } = req.body;
      const result = await this.spUseCase.isDoctorHaveSlots(doctorId);      
      return res.status(200).json({result });
    } catch (error) {
      next(error);
    }
  }



  // controllers/spController.ts or similar file
async deleteDoctor(req: Request, res: Response, next: NextFunction) {
  try {

    console.log((req.body));
    
    const { doctorId } = req.body;
    console.log(doctorId);
    
    await this.spUseCase.deleteDoctor(doctorId); // Call the use case to delete the doctor
    return res.status(204).send(); // Send a No Content status on success
  } catch (error) {
    next(error); // Pass error to the error handler
  }
}


}

export default spController;
