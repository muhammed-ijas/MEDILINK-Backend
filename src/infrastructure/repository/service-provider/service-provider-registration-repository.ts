import SP from "../../../domain/sp";
import SPModel from "../../database/service-provider-model";
import SPRepo from "../../../useCase/interface/service-provider-repo";
import SPOtpModel from "../../database/service-provider-otp-model";

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

class SPRepository implements SPRepo {
  //saving provider details to database
  async save(sp: SP): Promise<SP> {
    const newSP = new SPModel(sp);
    const savedSP = await newSP.save();
    return savedSP;
  }

  async findByEmail(email: string): Promise<SP | null> {
    const spData = await SPModel.findOne({ email: email });
    return spData;
  }

  async findById(_id: string): Promise<SP | null> {
    const spData = await SPModel.findById(_id);
    return spData;
  }

  async saveOtp(
    email: string,
    otp: number,
    name?: string,
    phone?: string,
    password?: string,
    area?: string,
    city?: string,
    latitude?: number,
    longitude?: number,
    state?: string,
    pincode?: number,
    district?: string
  ): Promise<any> {
    const otpDoc = new SPOtpModel({
      name: name,
      email: email,
      phone: phone,
      password: password,
      area: area,
      city: city,
      latitude: latitude,
      longitude: longitude,
      state: state,
      pincode: pincode,
      district: district,
      otp: otp,
      otpGeneratedAt: new Date(),
    });

    const savedDoc = await otpDoc.save();
    return savedDoc;
  }

  async findOtpByEmail(email: string): Promise<any> {
    try {
      const otpRecord = await SPOtpModel.findOne({ email })
        .sort({ otpGeneratedAt: -1 })
        .exec();
      return otpRecord;
    } catch (error) {
      console.error("Error fetching OTP record:", error);
      throw error;
    }
  }

  async deleteOtpByEmail(email: string): Promise<any> {
    return SPOtpModel.deleteOne({ email });
  }

  async findPasswordById(Id: string): Promise<any> {
    try {
      const sp = await SPModel.findOne({ _id: Id });
      return sp?.password;
    } catch (error) {
      throw error;
    }
  }

  async changePasswordById(Id: string, password: string): Promise<boolean> {
    const result = await SPModel.updateOne(
      { _id: Id },
      { $set: { password: password } }
    );
    return result.modifiedCount > 0;
  }
}
export default SPRepository;