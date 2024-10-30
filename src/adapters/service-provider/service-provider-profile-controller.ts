import { Request, Response, NextFunction } from "express";
import SPUseCase from "../../useCase/service-provider/serrvice-provider-profile-usecase";

class spController {
    private spUseCase: SPUseCase;

    constructor(spUseCase: SPUseCase) {
        this.spUseCase = spUseCase;
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
  
  async getRatingsAndReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.spUseCase.getRatingsAndReviews(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

}

export default spController;
