import User from "../domain/user";
import UserRepository from "../infrastructure/repository/userRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import GenerateOtp from "../infrastructure/services/generateOtp";
import JWTToken from "../infrastructure/services/generateToken";
import sendOtp from "../infrastructure/services/sendEmail";
import DepartmentRepository from "../infrastructure/repository/departmentRepository";
import DoctorRepository from "../infrastructure/repository/doctorRepository";
import SPRepository from "../infrastructure/repository/spRepository";

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
    SPRepository: SPRepository
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


  async getDepartments(page: number, limit: number, search: string) {
    try {
      const departments = await this.DepartmentRepository.findPaginated(
        page,
        limit,
        search
      );
      const totalDepartments = await this.DepartmentRepository.count(search);
      const totalPages = Math.ceil(totalDepartments / limit);

      return {
        items: departments,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getDoctors(page: number, limit: number, search: string) {
    try {
      const doctors = await this.DoctorRepository.findPaginated(
        page,
        limit,
        search
      );
      const totalDoctors = await this.DoctorRepository.count(search);
      const totalPages = Math.ceil(totalDoctors / limit);

      return {
        items: doctors,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getHospitals(page: number, limit: number, search: string) {
    try {
      const hospitals = await this.SPRepository.findPaginatedHospitals(
        page,
        limit,
        search
      );
      const totalHospitals = await this.SPRepository.countHospitals(search);
      const totalPages = Math.ceil(totalHospitals / limit);
      
      return {
        items: hospitals,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getClinicks(page: number, limit: number, search: string) {
    try {
      const clinicks = await this.SPRepository.findPaginatedClinicks(
        page,
        limit,
        search
      );
      const totalClinicks = await this.SPRepository.countClinicks(search);
      const totalPages = Math.ceil(totalClinicks / limit);

      return {
        items: clinicks,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAmbulances(page: number, limit: number, search: string) {
    try {
      const ambulances = await this.SPRepository.findPaginatedAmbulances(
        page,
        limit,
        search
      );
      const totalAmbulances = await this.SPRepository.countAmbulances(search);
      const totalPages = Math.ceil(totalAmbulances / limit);

      return {
        items: ambulances,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getHomeNurses(page: number, limit: number, search: string) {
    try {
      const homeNurses = await this.SPRepository.findPaginatedHomeNurses(
        page,
        limit,
        search
      );
      const totalHomeNurses = await this.SPRepository.countHomeNurses(search);
      const totalPages = Math.ceil(totalHomeNurses / limit);

      return {
        items: homeNurses,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getHospitalClinicDetails(id: string) {
    try {
      const hospitalDetails = await this.SPRepository.findHospitalClinicById(
        id
      );

      if (!hospitalDetails) {
        throw new Error("Hospital/Clinic not found");
      }

      return hospitalDetails;
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentDetails(id: string) {
    try {
      const departmentDetails = await this.SPRepository.findDepartmentById(id);

      if (!departmentDetails) {
        throw new Error("Ddepartment not found");
      }

      return departmentDetails;
    } catch (error) {
      throw error;
    }
  }

  async getDoctorDetails(id: string) {
    try {
      const doctorDetails = await this.DoctorRepository.findDoctorById(id);

      if (!doctorDetails) {
        throw new Error("Doctor not found");
      }

      return doctorDetails;
    } catch (error) {
      throw error;
    }
  }

  async getDoctorDetailsFromSearchPage(id: string) {
    try {
      const doctorDetails =
        await this.SPRepository.getDoctorDetailsFromSearchPage(id);

      if (!doctorDetails) {
        throw new Error("Doctor not found");
      }

      return doctorDetails;
    } catch (error) {
      throw error;
    }
  }

  async getHomeNurseDetails(id: string) {
    try {
      const homeNurseDetails = await this.SPRepository.findHomeNurseById(id);

      if (!homeNurseDetails) {
        throw new Error("Ddepartment not found");
      }

      return homeNurseDetails;
    } catch (error) {
      throw error;
    }
  }

  async getAmbulanceDetails(id: string) {
    try {
      const ambulanceDetails = await this.SPRepository.findAmbulanceById(id);

      if (!ambulanceDetails) {
        throw new Error("Ddepartment not found");
      }

      return ambulanceDetails;
    } catch (error) {
      throw error;
    }
  }

  async getFullAppointmentList(userId: string) {
    try {
      const appointments = await this.SPRepository.findAppointmentsByUserId(
        userId
      );
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async createPaymentSession(data: any) {
    return await this.SPRepository.createPaymentSession(data);
  }

  async updateBookingStatus(bookingId: string, status: string) {
    try {
      return await this.SPRepository.updateBookingStatus(bookingId, status);
    } catch (error) {
      throw new Error("Error updating booking status");
    }
  }
  
  async findTheappointmentForqrcodeById(bookingId: string) {
    try {
      return await this.SPRepository.findAppointmentById(bookingId);
    } catch (error) {
      throw new Error("ot get");
    }
  }

  


  async cancelAppointment(id: string, reason: string) {

    // Find the appointment by ID
    const appointment = await this.SPRepository.findAppointmentById(id);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.bookingStatus === "cancelled") {
      throw new Error("Already cancelled");
    }

    // Update appointment status to 'cancelled'
    await this.SPRepository.updateAppointmentStatus(id, "cancelled");

    // Update the time slot status to 'not occupied'
    await this.SPRepository.updateTimeSlotStatus(
      appointment.doctor,
      appointment.bookingDate,
      appointment.timeSlot,
      "not occupied"
    );

    // Send cancellation email
    this.generateEmail.sendCancellation(appointment.patientEmail, reason);

    return {
      status: 200,
      data: {
        status: true,
        message:
          "Appointment cancelled, time slot released, and notification sent to the patient",
      },
    };
  }

  async addReview (appointmentId:string , rating:number , review:string){
    try {
      return await this.UserRepository.addReview(appointmentId,rating,review);
    } catch (error) {
      throw new Error ('Error adding review');
    }
  }

  

  
  async getAllEmergencyNumbers() {
    try {
      const EmergencyNumbers = await this.UserRepository.findAllEmergencyNumber();
      return EmergencyNumbers;
    } catch (error) {
      throw error;
    }
  }

}

export default UserUseCase;
