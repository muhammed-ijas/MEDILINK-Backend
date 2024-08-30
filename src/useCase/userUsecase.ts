import User from "../domain/user";
import UserRepository from "../infrastructure/repository/userRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import GenerateOtp from "../infrastructure/services/generateOtp";
import JWTToken from "../infrastructure/services/generateToken";
import sendOtp from "../infrastructure/services/sendEmail";
import DepartmentRepository from '../infrastructure/repository/departmentRepository';
import DoctorRepository from '../infrastructure/repository/doctorRepository';
import SPRepository from '../infrastructure/repository/spRepository';

class UserUseCase {
  private UserRepository: UserRepository;
  private EncryptPassword: EncryptPassword;
  private JwtToken: JWTToken;
  private generateOtp: GenerateOtp;
  private generateEmail: sendOtp;
  private DepartmentRepository: DepartmentRepository;
  private DoctorRepository: DoctorRepository;
  private SPRepository: SPRepository;

  constructor(
    UserRepository: UserRepository,
    encryptPassword: EncryptPassword,
    jwtToken: JWTToken,
    generateOtp: GenerateOtp,
    generateEmail: sendOtp,
    DepartmentRepository: DepartmentRepository,
    DoctorRepository: DoctorRepository,
    SPRepository: SPRepository,
  ) {
    this.UserRepository = UserRepository;
    this.EncryptPassword = encryptPassword;
    this.JwtToken = jwtToken;
    this.generateOtp = generateOtp;
    this.generateEmail = generateEmail;
    this.DepartmentRepository = DepartmentRepository;
    this.DoctorRepository = DoctorRepository;
    this.SPRepository = SPRepository;
  }

  async checkExist(email: string) {
    const userExist = await this.UserRepository.findByEmail(email);

    if (userExist) {
      return {
        status: 400,
        data: {
          status: false,
          message: "User already exists",
        },
      };
    } else {
      return {
        status: 200,
        data: {
          status: true,
          message: "User does not exist",
        },
      };
    }
  }

  async signup(email: string, name: string, phone: string, password: string) {
    const otp = this.generateOtp.createOtp();
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    await this.UserRepository.saveOtp(email, otp, name, phone, hashedPassword);
    this.generateEmail.sendMail(email, otp);

    return {
      status: 200,
      data: {
        status: true,
        message: "Verification otp sent to your email",
      },
    };
  }
  async verifyOtp(email: string, otp: number) {
    console.log("verifyOtp from use case", email, otp);

    const sEmail = String(email);
    const otpRecord = await this.UserRepository.findOtpByEmail(sEmail);

    let data: { name: string; email: string; phone: string; password: string } =
      {
        name: otpRecord.name,
        email: otpRecord.email,
        phone: otpRecord.phone,
        password: otpRecord.password,
      };

    const now = new Date().getTime();
    const otpGeneratedAt = new Date(otpRecord.otpGeneratedAt).getTime();
    const otpExpiration = 2 * 60 * 1000;

    if (now - otpGeneratedAt > otpExpiration) {
      await this.UserRepository.deleteOtpByEmail(email);
      return { status: 400, message: "OTP has expired" };
    }

    if (otpRecord.otp !== otp) {
      return { status: 400, message: "Invalid OTP" };
    }

    await this.UserRepository.deleteOtpByEmail(email);
    console.log("OTP verified successfully", data);

    return { status: 200, message: "OTP verified successfully", data: data };
  }

  async verifyOtpUser(user: any) {
    if (user?.fromGoogle) {
      const hashedPassword = await this.EncryptPassword.encryptPassword(
        user.password
      );

      const newUser = { ...user, password: hashedPassword };

      const userData = await this.UserRepository.save(newUser);

      console.log(userData);

      let data = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        isBlocked: userData.isBlocked,
        isAdmin:userData.isAdmin,
      };

      const token = this.JwtToken.generateToken(userData._id, "user");

      return {
        status: 200,
        data: data,
        token,
      };
    }

    const newUser = { ...user };

    const userData = await this.UserRepository.save(newUser);
    console.log(userData);

    let data = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      isBlocked: userData.isBlocked,
      isAdmin:userData.isAdmin,
    };

    await this.UserRepository.deleteOtpByEmail(data.email);

    const token = this.JwtToken.generateToken(userData._id, "user");

    return {
      status: 200,
      data: data,
      message: "OTP verified successfully",
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.UserRepository.findByEmail(email);
    let token = "";

    if (user) {
      let data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isBlocked: user.isBlocked,
        isAdmin: user.isAdmin,
      };

      if (user.isBlocked) {
        return {
          status: 400,
          data: {
            status: false,
            message: "You have been blocked by admin!",
            token: "",
          },
        };
      }

      const passwordMatch = await this.EncryptPassword.compare(
        password,
        user.password
      );
      console.log(passwordMatch);

      if (passwordMatch) {
        token = this.JwtToken.generateToken(user._id, "user");

        return {
          status: 200,
          data: {
            status: true,
            message: data,
            token,
          },
        };
      } else {
        return {
          status: 400,
          data: {
            status: false,
            message: "Invalid email or password",
            token: "",
          },
        };
      }
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Invalid email or password",
          token: "",
        },
      };
    }
  }

  async resendOtp(
    email: string,
    name: string,
    phone: string,
    password: string
  ) {
    const otp = this.generateOtp.createOtp();
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    await this.UserRepository.saveOtp(email, otp, name, phone, hashedPassword);
    this.generateEmail.sendMail(email, otp);

    return { status: 200, message: "Otp has been sent to your email" };
  }

  async resetPassword(password: string, email: string) {
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    const changePassword = await this.UserRepository.changePassword(
      email,
      hashedPassword
    );
    if (changePassword) {
      return {
        status: 200,
        message: "Password changed successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again !",
      };
    }
  }

  async forgotPassword(email: string) {
    let userExist = await this.UserRepository.findByEmail(email);

    if (userExist) {
      const otp = this.generateOtp.createOtp();
      await this.UserRepository.saveOtp(email, otp);
      this.generateEmail.sendMail(email, otp);

      return {
        status: 200,
        data: {
          status: true,
          message: "Verification otp sent to your Email",
          email: userExist.email,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Email not registered!",
        },
      };
    }
  }

  async resentOtp(email: string) {
    const otp = this.generateOtp.createOtp();
    await this.UserRepository.saveOtp(email, otp);
    this.generateEmail.sendMail(email, otp);

    return { status: 200, message: "Otp has been sent to your email" };
  }
  async getProfile(Id: string) {
    const profile = await this.UserRepository.findById(Id);

    let data = {
      _id: profile?._id,
      name: profile?.name,
      email: profile?.email,
      phone: profile?.phone,
      isBlocked: profile?.isBlocked,
    };

    return {
      status: 200,
      data: data,
    };
  }

  async editProfile(
    Id: string,
    data: { name: string; email: string; phone: string }
  ) {
    const profile = await this.UserRepository.editProfile(Id, data);

    if (profile) {
      const data = await this.UserRepository.findById(Id);

      const profileData = {
        _id: data?._id,
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        isBlocked: data?.isBlocked,
      };

      return {
        status: 200,
        data: {
          message: "Profile updated successfully",
          user: profileData,
        },
      };
    } else {
      return {
        status: 400,
        message: "Failed to update the data Please try again",
      };
    }
  }

  async updatePassword(Id: string, newpassword: string, oldPassword: string) {
    const currentPasswordHash = await this.UserRepository.findPasswordById(Id);
    console.log("currentPasswordHash :", currentPasswordHash);

    if (!currentPasswordHash) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const isPasswordValid = await this.EncryptPassword.comparePassword(
      oldPassword,
      currentPasswordHash
    );
    console.log("isPasswordValid :", isPasswordValid);

    if (!isPasswordValid) {
      return {
        status: 400,
        message: "Current password is incorrect",
      };
    }

    const hashedPassword = await this.EncryptPassword.encryptPassword(
      newpassword
    );
    console.log("hashedPassword :", hashedPassword);

    const changePassword = await this.UserRepository.chnagePasswordById(
      Id,
      hashedPassword
    );
    console.log("changePassword :", changePassword);

    if (changePassword) {
      return {
        status: 200,
        message: "Password changed successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again !",
      };
    }
  }


  async getDepartments(page: number, limit: number) {
    try {
      const departments = await this.DepartmentRepository.findPaginated(page, limit);
      const totalDepartments = await this.DepartmentRepository.count();
      const totalPages = Math.ceil(totalDepartments / limit);

      return {
        items: departments,
        totalPages
      };
    } catch (error) {
      throw error;
    }
  }

  async getDoctors(page: number, limit: number) {
    try {
      const doctors = await this.DoctorRepository.findPaginated(page, limit);
      const totalDoctors = await this.DoctorRepository.count();
      const totalPages = Math.ceil(totalDoctors / limit);

      return {
        items: doctors,
        totalPages
      };
    } catch (error) {
      throw error;
    }
  }

  async getServiceProviders(page: number, limit: number) {
    try {
      const providers = await this.SPRepository.findPaginated(page, limit);
      const totalProviders = await this.SPRepository.count();
      const totalPages = Math.ceil(totalProviders / limit);

      return {
        items: providers,
        totalPages
      };
    } catch (error) {
      throw error;
    }
  }
}

export default UserUseCase;
