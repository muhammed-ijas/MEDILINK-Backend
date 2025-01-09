import { Request, Response, NextFunction } from "express";
import UserUseCase from "../../useCase/user/user-search-usecase";

class userController {
  private userUseCase: UserUseCase;

  constructor(userUseCase: UserUseCase) {
    this.userUseCase = userUseCase;
  }
    
  async getDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = "" } =req.query;
      const result = await this.userUseCase.getDepartments(Number(page),Number(limit),search as string);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await this.userUseCase.getDoctors(Number(page),Number(limit),search as string);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHospitals(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("request came to controller ");
      
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await this.userUseCase.getHospitals(Number(page),Number(limit),search as string);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getClinicks(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await this.userUseCase.getClinicks(Number(page),Number(limit),search as string);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAmbulances(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await this.userUseCase.getAmbulances(Number(page),Number(limit),search as string);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHomeNurses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const result = await this.userUseCase.getHomeNurses(Number(page),Number(limit),search as string);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHospitalClinicDetails(req: Request,res: Response,next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.userUseCase.getHospitalClinicDetails(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDepartmentDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.userUseCase.getDepartmentDetails(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDoctorDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.userUseCase.getDoctorDetails(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDoctorDetailsFromSearchPage(req: Request,res: Response,next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.userUseCase.getDoctorDetailsFromSearchPage(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHomeNurseDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.userUseCase.getHomeNurseDetails(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAmbulanceDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.userUseCase.getAmbulanceDetails(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

}

export default userController;
