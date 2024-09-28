import adminRepo from "../infrastructure/repository/adminRepository";
import SPRepo from "./interface/spRepo";
import sendOtp from "../infrastructure/services/sendEmail";


class adminUseCase {
  private AdminRepo: adminRepo;
  private SPRepo: SPRepo;
  private generateMail: sendOtp;

  constructor(AdminRepo: adminRepo, SPRepo: SPRepo ,generateMail: sendOtp) {
    this.AdminRepo = AdminRepo;
    this.SPRepo = SPRepo;
    this.generateMail = generateMail;
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

    async getUsers() {
      const result = await this.AdminRepo.getUsers();
      return result; // Ensure this returns the correct value
    }


  async approvedService(serviceProviderId: string): Promise<any> {
    const result = await this.AdminRepo.approvedService(serviceProviderId);
    console.log("result from usecase :",result);

    if (result) {
      const serviceProvider = await this.AdminRepo.getServiceProviderById(serviceProviderId);

      if (serviceProvider) {
        this.generateMail.sendApproval(serviceProvider.email, serviceProvider.name);
      }
    }
    
    return result;
  }




  async blockUser(userId: string) {
    return this.AdminRepo.updateUserBlockStatus(userId, true);
  }

  async unblockUser(userId: string) {
    return this.AdminRepo.updateUserBlockStatus(userId, false);
  }
}
export default adminUseCase;
