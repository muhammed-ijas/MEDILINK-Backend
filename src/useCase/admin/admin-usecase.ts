import adminRepository from "../../infrastructure/repository/admin/admin-repository";
import sendOtp from "../../infrastructure/services/send-email";


class adminUseCase {
  private AdminRepository: adminRepository;
  private generateMail: sendOtp;

  constructor(AdminRepo: adminRepository ,generateMail: sendOtp) {
    this.AdminRepository = AdminRepo;
    this.generateMail = generateMail;
  }


  async getUnverifiedServices() {
    const result = await this.AdminRepository.getUnVerifiedServices();
    return result; // Ensure this returns the correct value
  }


  async getAllServices() {
    const result = await this.AdminRepository.getAllServices();
    return result; // Ensure this returns the correct value
  }


  async getVerifiedServices() {
    const result = await this.AdminRepository.getVerifiedServices();
    return result; // Ensure this returns the correct value
  }


  async getUsers() {
    const result = await this.AdminRepository.getUsers();
    return result; // Ensure this returns the correct value
  }


  async approvedService(serviceProviderId: string): Promise<any> {
    const result = await this.AdminRepository.approvedService(serviceProviderId);

    if (result) {
      const serviceProvider = await this.AdminRepository.getServiceProviderById(serviceProviderId);

      if (serviceProvider) {
        this.generateMail.sendApproval(serviceProvider.email, serviceProvider.name);
      }
    }
    
    return result;
  }


  async blockUser(userId: string) {
    return this.AdminRepository.updateUserBlockStatus(userId, true);
  }

  
  async unblockUser(userId: string) {
    return this.AdminRepository.updateUserBlockStatus(userId, false);
  }
}
export default adminUseCase;
