import { response } from "express";
import SP from "../domain/sp";
import SPRepository from "../infrastructure/repository/spRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import GenerateOtp from "../infrastructure/services/generateOtp";
import JWTToken from "../infrastructure/services/generateToken";
import sendOtp from "../infrastructure/services/sendEmail";
import { Error } from "mongoose";

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

interface DoctorData {
  doctorId: string;
  name: string;
  specialization: string;
  yearsOfExperience: string;
  contact: string;
  doctorProfileImage: string;
  validCertificate: string;
}

class SPUseCase {
  private SPRepository: SPRepository;
  private EncryptPassword: EncryptPassword;
  private JwtToken: JWTToken;
  private generateOtp: GenerateOtp;
  private generateEmail: sendOtp;
  constructor(
    SPRepository: SPRepository,
    encryptPassword: EncryptPassword,
    jwtToken: JWTToken,
    generateOtp: GenerateOtp,
    generateEmail: sendOtp
  ) {
    this.SPRepository = SPRepository;
    this.EncryptPassword = encryptPassword;
    this.JwtToken = jwtToken;
    this.generateOtp = generateOtp;
    this.generateEmail = generateEmail;
  }

  async checkExist(email: string) {
    const userExist = await this.SPRepository.findByEmail(email);

    if (userExist) {
      return {
        status: 400,
        data: {
          status: false,
          message: "Already exists",
        },
      };
    } else {
      return {
        status: 200,
        data: {
          status: true,
          message: "does not exist",
        },
      };
    }
  }

  async signup(
    email: string,
    name: string,
    phone: string,
    password: string,
    area: string,
    city: string,
    latitude: number,
    longitude: number,
    state: string,
    pincode: number,
    district: string
  ) {
    console.log(
      email,
      name,
      phone,
      password,
      area,
      city,
      latitude,
      longitude,
      state,
      pincode,
      district,
      "from spusecase"
    );

    const otp = this.generateOtp.createOtp();

    const hashedPassword = await this.EncryptPassword.encryptPassword(password);

    await this.SPRepository.saveOtp(
      email,
      otp,
      name,
      phone,
      hashedPassword,
      area,
      city,
      latitude,
      longitude,
      state,
      pincode,
      district
    );

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
    const otpRecord = await this.SPRepository.findOtpByEmail(sEmail);

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
      await this.SPRepository.deleteOtpByEmail(email);
      return { status: 400, message: "OTP has expired" };
    }

    if (otpRecord.otp !== otp) {
      return { status: 400, message: "Invalid OTP" };
    }

    await this.SPRepository.deleteOtpByEmail(email);

    return { status: 200, message: "OTP verified successfully", data: data };
  }

  async verifyOtpSP(sp: any) {
    const newUser = { ...sp };

    const spData = await this.SPRepository.save(newUser);

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

    await this.SPRepository.deleteOtpByEmail(data.email);

    const token = this.JwtToken.generateToken(spData._id, "sp");

    return {
      status: 200,
      data: data,
      message: "OTP verified successfully",
      token,
    };
  }

  async login(email: string, password: string) {
    const spData = await this.SPRepository.findByEmail(email);
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

      const passwordMatch = await this.EncryptPassword.compare(
        password,
        spData.password
      );

      if (passwordMatch) {
        token = this.JwtToken.generateToken(spData._id, "user");

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
    password: string,
    area: string,
    city: string,
    latitude: number,
    longitude: number,
    state: string,
    pincode: number,
    district: string
  ) {
    const otp = this.generateOtp.createOtp();
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    await this.SPRepository.saveOtp(
      email,
      otp,
      name,
      phone,
      hashedPassword,
      area,
      city,
      latitude,
      longitude,
      state,
      pincode,
      district
    );
    this.generateEmail.sendMail(email, otp);

    return { status: 200, message: "Otp has been sent to your email" };
  }

  async getProfile(Id: string) {
    const profile = await this.SPRepository.findById(Id);

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

    return {
      status: 200,
      data: data,
    };
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
    const profile = await this.SPRepository.editProfile(Id, data);

    if (profile) {
      const data = await this.SPRepository.findById(Id);

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
    const currentPasswordHash = await this.SPRepository.findPasswordById(Id);

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
        status: 400,
        message: "Current password is incorrect",
      };
    }

    const hashedPassword = await this.EncryptPassword.encryptPassword(
      newpassword
    );

    const changePassword = await this.SPRepository.changePasswordById(
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

  async updateImage(Id: string, imageUrl: string) {
    const result = await this.SPRepository.changeProfileImage(Id, imageUrl);

    if (result) {
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

  async changeFirstDocumentImage(Id: string, imageUrl: string) {
    const result = await this.SPRepository.changeFirstDocumentImage(
      Id,
      imageUrl
    );

    if (result) {
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

  async changeSecondDocumentImage(Id: string, imageUrl: string) {
    const result = await this.SPRepository.changeSecondDocumentImage(
      Id,
      imageUrl
    );

    if (result) {
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

  async addDoctorToDepartment(
    spId: string,
    department: string,
    doctors: {
      name: string;
      specialization: string;
      availableFrom: string;
      availableTo: string;
      contact: string;
      dateFrom: string;
      dateEnd: string;
      doctorProfileImage: string;
      yearsOfExperience: string;
      validCertificate: string;
    }[]
  ) {
    try {
      console.log("from usecase ,", spId, department, doctors);

      // Call the repository to perform the operation
      const result = await this.SPRepository.addDoctorToDepartment(
        spId,
        department,
        doctors
      );
      if (result) {
        return {
          status: 200,
          message: "Doctors added successfully",
        };
      } else {
        return {
          status: 400,
          message: "Failed to add   doctors",
        };
      }
    } catch (error) {
      throw new Error("An error occurred while adding the doctors");
    }
  }

  async addDepartment(spId: string, departmentName: string, avgTime: string) {
    try {
      // Call the repository to perform the operation
      const result = await this.SPRepository.addDepartment(
        spId,
        departmentName,
        avgTime
      );

      if (result.status) {
        return {
          status: 200,
          message: result.message, // "Department added successfully"
        };
      } else {
        return {
          status: 201,
          message: result.message,
        };
      }
    } catch (error) {
      throw new Error("An error occurred while adding the department");
    }
  }

  async getAllServiceDetails(spId: string) {
    try {
      const services = await this.SPRepository.getAllServiceDetails(spId);

      if (services) {
        return services;
      } else {
        throw new Error("Services not found");
      }
    } catch (error) {
      throw new Error("An error occurred while fetching the services");
    }
  }

  async editDepartment(
    spId: string,
    departmentId: string,
    name: string,
    doctors: any[]
  ) {
    try {
      const updatedDepartment = await this.SPRepository.editDepartment(
        spId,
        departmentId,
        name,
        doctors
      );

      if (updatedDepartment) {
        return {
          status: 200,
          message: "Department updated successfully",
          data: updatedDepartment,
        };
      } else {
        throw new Error("Department update failed");
      }
    } catch (error) {
      throw new Error("An error occurred while updating the department");
    }
  }

  async deleteDepartment(spId: string, departmentId: string) {
    try {
      const deleted = await this.SPRepository.deleteDepartment(
        spId,
        departmentId
      );
      return deleted || { success: false, message: "Unknown error" };
    } catch (error) {
      console.log("Error in deleteDepartment use case:", error);
      return {
        success: false,
        message: "An error occurred while deleting the department",
      };
    }
  }

  async getFullAppointmentList(spId: string) {
    try {
      const appointments = await this.SPRepository.findAppointmentsBySPId(spId);
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async getRatingsAndReviews(spId: string) {
    try {
      const ratings = await this.SPRepository.findRatingsOfSPById(spId);
      return ratings;
    } catch (error) {
      throw error;
    }
  }

  async approveAppointment(id: string) {
    const appointment = await this.SPRepository.approveAppointment(id);
    if (!appointment)
      throw new Error("Appointment not found or already approved");
    return appointment;
  }

  async completeAppointment(id: string) {
    const appointment = await this.SPRepository.completeAppointment(id);

    if (!appointment)
      throw new Error("Appointment not found or already completed");
    return appointment;
  }

  async cancelAppointment(id: string, reason: string) {
    const appointment = await this.SPRepository.findAppointmentById(id);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.bookingStatus === "cancelled") {
      throw new Error("Already cancelled");
    }

    await this.SPRepository.updateAppointmentStatus(id, "cancelled");
    // Update the time slot status to 'not occupied'
    await this.SPRepository.updateTimeSlotStatus(
      appointment.doctor,
      appointment.bookingDate,
      appointment.timeSlot,
      "not occupied"
    );

    this.generateEmail.sendCancellation(appointment.patientEmail, reason);

    return {
      status: 200,
      data: {
        status: true,
        message: "Appointment cancelled and notification sent to the patient",
      },
    };
  }

  async getEmergencyNumber(spId: string) {
    try {
      const EmergencyNumbers = await this.SPRepository.findEmergencyNumber(
        spId
      );
      return EmergencyNumbers;
    } catch (error) {
      throw error;
    }
  }

  async updateEmergencyNumber(spId: string, emergencyNumber: string) {
    try {
      const EmergencyNumbers = await this.SPRepository.updateEmergencyNumber(
        spId,
        emergencyNumber
      );
      return EmergencyNumbers;
    } catch (error) {
      throw error;
    }
  }

  async deleteEmergencyNumber(spId: string) {
    try {
      const result = await this.SPRepository.deleteEmergencyNumber(spId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getDoctorDetails(doctorId: string) {
    try {
      const doctorDetails = await this.SPRepository.findDoctorById(doctorId);
      return doctorDetails;
    } catch (error) {
      throw error;
    }
  }

  async getAppointmentDetails(spId: string) {
    try {
      const appointments = await this.SPRepository.getAppointmentDetails(spId);
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async addPrescriptionToAppointment(
    appointmentId: string,
    prescription: Prescription
  ) {
    try {
      const result = await this.SPRepository.addPrescriptionToAppointment(
        appointmentId,
        prescription
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPrescription(appointmentId: string) {
    try {
      const result = await this.SPRepository.getPrescription(appointmentId);
      return result;
    } catch (error) {
      throw error;
    }
  }
 

  async getRecentAppointments(appointmentId: string) {
    try {
      const appointments =
        await this.SPRepository.findAppointmentsAppointmentId(appointmentId);
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async updateDoctorDetails(doctorData: DoctorData) {
    try {
      const result = await this.SPRepository.updateDoctorDetails(doctorData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllDoctorDetailsInsideADepartment(departmentId: string) {
    try {
      const result = await this.SPRepository.getAllDoctorDetailsInsideADepartment(departmentId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getDoctorSlotsDetails(doctorId: string) {
    try {
      const result = await this.SPRepository.getDoctorSlotsDetails(doctorId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async isDoctorHaveSlots(doctorId: string) {
    try {
      const result = await this.SPRepository.isDoctorHaveSlots(doctorId);
      return result;
    } catch (error) {
      throw error;
    }
  }


  // usecases/spUseCase.ts or similar file
async deleteDoctor(doctorId: string) {
  try {
    // You might want to add additional checks here if necessary
    await this.SPRepository.deleteDoctor(doctorId); // Call repository method to delete doctor
  } catch (error) {
    throw error; // Re-throw the error for handling in the controller
  }
}

}

export default SPUseCase;
