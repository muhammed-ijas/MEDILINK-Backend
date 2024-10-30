import UserModel from "../../database/user-model";
import SPModel from "../../database/service-provider-model";

class adminRepository {
 

  async getUnVerifiedServices(): Promise<{ services: any[] }> {
    const services = await SPModel.find({ isVerified: false }).lean();
    return { services };
  }

  
  async getAllServices(): Promise<{ services: any[] }> {
    const services = await SPModel.find({})
      .populate({
        path: 'departments', // Populate the departments field
        populate: {
          path: 'doctors', // Populate the doctors field inside each department
          model: 'Doctor'  // Specify the model name
        }
      })
      .lean();
    return { services };
  }


  async getVerifiedServices(): Promise<{ services: any[] }> {
    const services = await SPModel.find({isVerified:true})
      .populate({
        path: 'departments', // Populate the departments field
        populate: {
          path: 'doctors', // Populate the doctors field inside each department
          model: 'Doctor'  // Specify the model name
        }
      })
      .lean();
    return { services };
  }


  async getUsers(): Promise<{ users: any[] }> {
    const users = await UserModel.find({isAdmin:false})
      .lean();
    return { users };
  }


  async approvedService(serviceProviderId: string): Promise<any> {
    const result = await SPModel.updateOne(
      { _id: serviceProviderId },
      { $set: { isVerified: true } }
    );
    return result;
  }


  async getServiceProviderById(serviceProviderId: string): Promise<any> {
    const service = await SPModel.findOne({_id:serviceProviderId})
    return  service ;
  }

  
  async updateUserBlockStatus(userId: string, isBlocked: boolean) {
    return UserModel.findByIdAndUpdate(userId, { isBlocked });
  }
  
}

export default adminRepository;
