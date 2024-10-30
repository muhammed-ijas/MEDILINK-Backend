import UserRepository from "../../infrastructure/repository/user/user-repository";
import EncryptPassword from "../../infrastructure/services/bcrypt-password";
import GenerateOtp from "../../infrastructure/services/generate-otp";
import JWTToken from "../../infrastructure/services/generate-token";
import sendOtp from "../../infrastructure/services/send-email";

class UserRegisterUsecase {
  private UserRepository: UserRepository;
  private EncryptPassword: EncryptPassword;
  private JwtToken: JWTToken;
  private generateOtp: GenerateOtp;
  private generateEmail: sendOtp;

  constructor(
    UserRepository: UserRepository,
    encryptPassword: EncryptPassword,
    jwtToken: JWTToken,
    generateOtp: GenerateOtp,
    generateEmail: sendOtp,
  ) {
    this.UserRepository = UserRepository;
    this.EncryptPassword = encryptPassword;
    this.JwtToken = jwtToken;
    this.generateOtp = generateOtp;
    this.generateEmail = generateEmail;
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

    return { status: 200, message: "OTP verified successfully", data: data };
  }


  async verifyOtpUser(user: any) {
    if (user?.fromGoogle) {
      const hashedPassword = await this.EncryptPassword.encryptPassword(
        user.password
      );

      const newUser = { ...user, password: hashedPassword };

      const userData = await this.UserRepository.save(newUser);


      let data = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        isBlocked: userData.isBlocked,
        isAdmin: userData.isAdmin,
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

    let data = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      isBlocked: userData.isBlocked,
      isAdmin: userData.isAdmin,
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
          status: 403,
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
 
  async updatePassword(Id: string, newpassword: string, oldPassword: string) {

    const currentPasswordHash = await this.UserRepository.findPasswordById(Id);

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

    if (!isPasswordValid) {
      return {
        status: 201,
        message: "Current password is incorrect",
      };
    }

    const hashedPassword = await this.EncryptPassword.encryptPassword(
      newpassword
    );

    const changePassword = await this.UserRepository.chnagePasswordById(
      Id,
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

}

export default UserRegisterUsecase;
