import SPProfileRepository from "../../infrastructure/repository/service-provider/service-provider-profile-repository";
import SPRegistrationRepository from "../../infrastructure/repository/service-provider/service-provider-registration-repository";

// Define the Medication and Prescription types
export interface Medication {
  medication: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  instructions?: string;
  refills?: number;
}

export interface Prescription {
  medications: Medication[];
}

class SPUseCase {
  private SPProfileRepository: SPProfileRepository;
  private SPRegistrationRepository: SPRegistrationRepository;
  constructor(
    SPProfileRepository: SPProfileRepository,
    SPRegistrationRepository: SPRegistrationRepository,
  ) {
    this.SPProfileRepository = SPProfileRepository;
    this.SPRegistrationRepository = SPRegistrationRepository;
  }

  async getProfile(Id: string) {
    const profile = await this.SPRegistrationRepository.findById(Id);

    let data = {
      _id: profile?._id,
      name: profile?.name,
      email: profile?.email,
      phone: profile?.phone,
      isBlocked: profile?.isBlocked,
      area: profile?.area,
      city: profile?.city,
      state: profile?.state,
      pincode: profile?.pincode,
      district: profile?.district,
      latitude: profile?.latitude,
      longitude: profile?.longitude,
      isVerified: profile?.isVerified,
      closingTime: profile?.closingTime,
      openingTime: profile?.openingTime,
      profileImage: profile?.profileImage,
      serviceType: profile?.serviceType,
      firstDocumentImage: profile?.firstDocumentImage,
      secondDocumentImage: profile?.secondDocumentImage,
      departments: profile?.departments,
    };
    return {status: 200,data: data,};
  }

  async editProfile(
    Id: string,
    data: {
      name: string;
      email: string;
      phone: string;
      area: string;
      city: string;
      latitude: number;
      longitude: number;
      state: string;
      pincode: number;
      district: string;
      serviceType: string;
      closingTime: string;
      openingTime: string;
      profileImage: string;
      firstDocumentImage: string;
      secondDocumentImage: string;
    }
  ) {
    const profile = await this.SPProfileRepository.editProfile(Id, data);

    if (profile) {
      const data = await this.SPRegistrationRepository.findById(Id);

      const profileData = {
        _id: data?._id,
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        isBlocked: data?.isBlocked,
        area: data?.area,
        city: data?.city,
        state: data?.state,
        pincode: data?.pincode,
        district: data?.district,
        latitude: data?.latitude,
        longitude: data?.longitude,
        isVerified: data?.isVerified,
        serviceType: data?.serviceType,
        closingTime: data?.closingTime,
        openingTime: data?.openingTime,
        profileImage: data?.profileImage,
        firstDocumentImage: data?.firstDocumentImage,
        secondDocumentImage: data?.secondDocumentImage,
      };

      return {status: 200,data: {message: "Profile updated successfully",user: profileData,},};
    } else {
      return {status: 400,message: "Failed to update the data Please try again",};
    }
  }


  async updateImage(Id: string, imageUrl: string) {
    const result = await this.SPProfileRepository.changeProfileImage(Id, imageUrl);
    if (result) {
      return {status: 200,message: "Password changed successfully",};
    } else {
      return {status: 400,message: "Failed please try again !",};
    }
  }

  async changeFirstDocumentImage(Id: string, imageUrl: string) {
    const result = await this.SPProfileRepository.changeFirstDocumentImage(Id,imageUrl);
    if (result) {
      return {status: 200,message: "Password changed successfully",};
    } else {
      return {status: 400,message: "Failed please try again !",};
    }
  }

  async changeSecondDocumentImage(Id: string, imageUrl: string) {
    const result = await this.SPProfileRepository.changeSecondDocumentImage(Id,imageUrl);
    if (result) {
      return {status: 200,message: "Password changed successfully",};
    } else {
      return {status: 400,message: "Failed please try again !",};
    }
  }

  async getRatingsAndReviews(spId: string) {
    try {
      const ratings = await this.SPProfileRepository.findRatingsOfSPById(spId);
      return ratings;
    } catch (error) {
      throw error;
    }
  }
}

export default SPUseCase;
