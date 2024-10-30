import { Request, Response, NextFunction } from "express";
import SPUseCase from "../../useCase/service-provider/service-provider-usecase";

class spController {
    private spUseCase: SPUseCase;

    constructor(spUseCase: SPUseCase) {
        this.spUseCase = spUseCase;
    }

  
  async getFullAppointmentList(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;      
      const result = await this.spUseCase.getFullAppointmentList(id);
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

}

export default spController;
