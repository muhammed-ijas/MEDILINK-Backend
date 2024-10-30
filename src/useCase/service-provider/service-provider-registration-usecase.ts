import SPRegistrationRepository from "../../infrastructure/repository/service-provider/service-provider-registration-repository";

import EncryptPassword from "../../infrastructure/services/bcrypt-password";
import GenerateOtp from "../../infrastructure/services/generate-otp";
import JWTToken from "../../infrastructure/services/generate-token";
import sendOtp from "../../infrastructure/services/send-email";

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
  private SPRegistrationRepository: SPRegistrationRepository;
  private EncryptPassword: EncryptPassword;
  private JwtToken: JWTToken;
  private generateOtp: GenerateOtp;
  private generateEmail: sendOtp;
  constructor(
    SPRegistrationRepository: SPRegistrationRepository,
    encryptPassword: EncryptPassword,
    jwtToken: JWTToken,
    generateOtp: GenerateOtp,
    generateEmail: sendOtp
  ) {
    this.SPRegistrationRepository = SPRegistrationRepository;
    this.EncryptPassword = encryptPassword;
    this.JwtToken = jwtToken;
    this.generateOtp = generateOtp;
    this.generateEmail = generateEmail;
  }

  async checkExist(email: string) {
    const userExist = await this.SPRegistrationRepository.findByEmail(email);

    if (userExist) {
      return {status: 400,data: {status: false,message: "Already exists",},
      };
    } else {
      return {status: 200,data: {status: true,message: "does not exist",},
      };
    }
  }

  async signup(email: string,name: string,phone: string,password: string,area: string,city: string,latitude: number,longitude: number,state: string,pincode: number,district: string) {

    const otp = this.generateOtp.createOtp();

    const hashedPassword = await this.EncryptPassword.encryptPassword(password);

    await this.SPRegistrationRepository.saveOtp(email,otp,name,phone,hashedPassword,area,city,latitude,longitude,state,pincode,district);

    this.generateEmail.sendMail(email, otp);

    return {status: 200,data: {status: true,message: "Verification otp sent to your email",},};
  }

  async verifyOtp(email: string, otp: number) {
    const sEmail = String(email);
    const otpRecord = await this.SPRegistrationRepository.findOtpByEmail(sEmail);

    let data: {
      name: string;
      email: string;
      phone: string;
      password: string;
      area: string;
      city: string;
      latitude: number;
      longitude: number;
      state: string;
      pincode: number;
      district: string;
    } = {
      name: otpRecord.name,
      email: otpRecord.email,
      phone: otpRecord.phone,
      password: otpRecord.password,
      area: otpRecord.area,
      city: otpRecord.city,
      latitude: otpRecord.latitude,
      longitude: otpRecord.longitude,
      state: otpRecord.state,
      pincode: otpRecord.pincode,
      district: otpRecord.district,
    };

    const now = new Date().getTime();
    const otpGeneratedAt = new Date(otpRecord.otpGeneratedAt).getTime();
    const otpExpiration = 2 * 60 * 1000;
    if (now - otpGeneratedAt > otpExpiration) {
      await this.SPRegistrationRepository.deleteOtpByEmail(email);
      return { status: 400, message: "OTP has expired" };
    }
    if (otpRecord.otp !== otp) {
      return { status: 400, message: "Invalid OTP" };
    }
    await this.SPRegistrationRepository.deleteOtpByEmail(email);

    return { status: 200, message: "OTP verified successfully", data: data };
  }

  async verifyOtpSP(sp: any) {
    const newUser = { ...sp };
    const spData = await this.SPRegistrationRepository.save(newUser);

    let data = {
      _id: spData._id,
      name: spData.name,
      email: spData.email,
      phone: spData.phone,
      area: spData.area,
      city: spData.city,
      latitude: spData.latitude,
      longitude: spData.longitude,
      state: spData.state,
      pincode: spData.pincode,
      district: spData.district,
      isVerified: spData.isVerified,
      isBlocked: spData.isBlocked,
    };

    await this.SPRegistrationRepository.deleteOtpByEmail(data.email);
    const token = this.JwtToken.generateToken(spData._id, "sp");

    return {status: 200,data: data,message: "OTP verified successfully",token,};
}

  async login(email: string, password: string) {
    const spData = await this.SPRegistrationRepository.findByEmail(email);
    let token = "";

    if (spData) {
      let data = {
        _id: spData._id,
        name: spData.name,
        email: spData.email,
        phone: spData.phone,
        area: spData.area,
        city: spData.city,
        latitude: spData.latitude,
        longitude: spData.longitude,
        state: spData.state,
        pincode: spData.pincode,
        district: spData.district,
        isVerified: spData.isVerified,
        isBlocked: spData.isBlocked,
        firstDocumentImage: spData.firstDocumentImage,
        secondDocumentImage: spData.secondDocumentImage,
        serviceType: spData.serviceType,
      };
      const passwordMatch = await this.EncryptPassword.compare(password,spData.password);

      if (passwordMatch) {
        token = this.JwtToken.generateToken(spData._id, "user");

        return {status: 200,data: {status: true,message: data,token,},};
      } else {
        return {status: 400,data: {status: false,message: "Invalid email or password",token: "",},};
      }
    } else {
      return {status: 400,data: {status: false,message: "Invalid email or password",token: "",},};
    }
  }

  async resendOtp(email: string,name: string,phone: string,password: string,area: string,city: string,latitude: number,longitude: number,state: string,pincode: number,district: string
  ) {
    const otp = this.generateOtp.createOtp();
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    await this.SPRegistrationRepository.saveOtp(email,otp,name,phone,hashedPassword,area,city,latitude,longitude,state,pincode,district);
    this.generateEmail.sendMail(email, otp);

    return { status: 200, message: "Otp has been sent to your email" };
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


  async updatePassword(Id: string, newpassword: string, oldPassword: string) {
    const currentPasswordHash = await this.SPRegistrationRepository.findPasswordById(Id);
    if (!currentPasswordHash) {
      return {status: 404,message: "User not found",};
    }
    const isPasswordValid = await this.EncryptPassword.comparePassword(oldPassword,currentPasswordHash);
    if (!isPasswordValid) {
      return {status: 400,message: "Current password is incorrect",};
    }
    const hashedPassword = await this.EncryptPassword.encryptPassword(newpassword);
    const changePassword = await this.SPRegistrationRepository.changePasswordById(Id,hashedPassword);
    if (changePassword) {
      return {status: 200,message: "Password changed successfully",};
    } else {
      return {status: 400,message: "Failed please try again !",};
    }

  }
}

export default SPUseCase;