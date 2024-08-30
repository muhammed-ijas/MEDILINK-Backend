import adminRepo from "../infrastructure/repository/adminRepository";
import SPRepo from "./interface/spRepo";

class adminUseCase {
  private AdminRepo: adminRepo;
  private SPRepo: SPRepo;

  constructor(AdminRepo: adminRepo, SPRepo: SPRepo) {
    this.AdminRepo = AdminRepo;
    this.SPRepo = SPRepo;
  }

  async getUnverifiedServices() {
    const result = await this.AdminRepo.getUnVerifiedServices();
    return result; // Ensure this returns the correct value
  }
  async getAllServices() {
    const result = await this.AdminRepo.getAllServices();
    return result; // Ensure this returns the correct value
  }

  async getVerifiedServices() {
    const result = await this.AdminRepo.getVerifiedServices();
    return result; // Ensure this returns the correct value
  }


  async approvedService(serviceProviderId: string): Promise<any> {
    const result = await this.AdminRepo.approvedService(serviceProviderId);
    console.log("result from usecase :",result);
    
    return result;
  }
}
export default adminUseCase;
