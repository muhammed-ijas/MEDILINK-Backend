import { Request, Response, NextFunction } from "express";
import SPUseCase from "../../useCase/service-provider/service-provider-add-department-usecase";

class spController {
  private spUseCase: SPUseCase;

  constructor(spUseCase: SPUseCase) {
    this.spUseCase = spUseCase;
  }

  async addDoctorToDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const { spId, department, doctors } = req.body;
      const update = await this.spUseCase.addDoctorToDepartment(spId,department,doctors);
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
      const update = await this.spUseCase.addDepartment(spId,department,avgTime);
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
      const spId = req.body.spId;
      const departmentId = req.body.data.departmentId;
      const name = req.body.data.name;
      const doctors = req.body.data.doctors;

      const updateResult = await this.spUseCase.editDepartment(spId,departmentId,name,doctors);
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
      const response = await this.spUseCase.deleteDepartment(spId,departmentId);
      if (response.success) {
        return res.status(200).json({ message: response.message });
      } else {
        return res.status(400).json({ message: response.message });
      }
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

  async updateDoctorDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorData = req.body;
      const result = await this.spUseCase.updateDoctorDetails(doctorData);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllDoctorDetailsInsideADepartment(req: Request,res: Response,next: NextFunction) {
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
      return res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  }

  async deleteDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorId } = req.body;
      await this.spUseCase.deleteDoctor(doctorId); // Call the use case to delete the doctor
      return res.status(204).send(); // Send a No Content status on success
    } catch (error) {
      next(error); // Pass error to the error handler
    }
  }
}

export default spController;
