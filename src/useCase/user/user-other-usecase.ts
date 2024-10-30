import UserRepository from "../../infrastructure/repository/user/user-repository";
import sendOtp from "../../infrastructure/services/send-email";

import SPRepository from "../../infrastructure/repository/service-provider/service-provider-repository";
//doctor
import SPAddDoctorRepository from "../../infrastructure/repository/service-provider/service-provider-add-doctor-repository";
import SPEditDoctorRepository from "../../infrastructure/repository/service-provider/service-provider-edit-doctor-repository";
import SPDeleteDoctorRepository from "../../infrastructure/repository/service-provider/service-provider-delete-doctor-repository";

//department
import SPAddDepartmentRepository from "../../infrastructure/repository/service-provider/service-provider-add-department-repository";
import SPEditDepartmentRepository from "../../infrastructure/repository/service-provider/service-provider-edit-department-repository";
import SPDeleteDepartmentRepository from "../../infrastructure/repository/service-provider/service-provider-delete-department-repository";

//appointment
import SPAppointmentRepository from "../../infrastructure/repository/service-provider/service-provider-appointment-repository";
import SPEditAppointmentRepository from "../../infrastructure/repository/service-provider/service-provider-edit-appointment-repository";

//payment
import SPCreatePaymentRepository from "../../infrastructure/repository/service-provider/service-provider-create-payment-repository";
import SPWalletRepository from "../../infrastructure/repository/service-provider/service-provider-wallet-repository";

//emergency,prescription
import SPEmergencyRepository from "../../infrastructure/repository/service-provider/service-provider-emergency-repository";
import SPPrescriptionRepository from "../../infrastructure/repository/service-provider/service-provider-prescription-repository";
import SPRatingRepository from "../../infrastructure/repository/service-provider/service-provider-ratings-repository";

//registration
import SPRegistrationRepository from "../../infrastructure/repository/service-provider/service-provider-registration-repository";

//search
import SPSearchRepository from "../../infrastructure/repository/service-provider/service-provider-search-repository";


//profile
import SPProfileRepository from "../../infrastructure/repository/service-provider/service-provider-profile-repository";


import { String } from "aws-sdk/clients/cloudsearch";

class UserUseCase {
  private UserRepository: UserRepository;
  private generateEmail: sendOtp;
  private SPRepository: SPRepository;
  private SPAppointmentRepository: SPAppointmentRepository;
  private SPCreatePaymentRepository: SPCreatePaymentRepository;
  private SPWalletRepository: SPWalletRepository;
  private SPEditAppointmentRepository: SPEditAppointmentRepository;

  constructor(
    UserRepository: UserRepository,
    generateEmail: sendOtp,
    SPRepository: SPRepository,
    SPAppointmentRepository: SPAppointmentRepository,
    SPCreatePaymentRepository: SPCreatePaymentRepository,
    SPWalletRepository: SPWalletRepository,
    SPEditAppointmentRepository: SPEditAppointmentRepository,
  ) {
    this.UserRepository = UserRepository;
    this.generateEmail = generateEmail;
    this.SPRepository = SPRepository;
    this.SPAppointmentRepository = SPAppointmentRepository;
    this.SPCreatePaymentRepository = SPCreatePaymentRepository;
    this.SPWalletRepository = SPWalletRepository;
    this.SPEditAppointmentRepository = SPEditAppointmentRepository;
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


  async getFullAppointmentList(userId: string) {
    try {
      const appointments = await this.SPAppointmentRepository.findAppointmentsByUserId(
        userId
      );
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async createPaymentSession(data: any) {
    return await this.SPCreatePaymentRepository.createPaymentSession(data);
  }

  async confirmWalletPayment(data: any) {
    return await this.SPWalletRepository.confirmWalletPayment(data);
  }

  async updateBookingStatus(bookingId: string, status: string) {
    try {
      return await this.SPEditAppointmentRepository.updateBookingStatus(bookingId, status);
    } catch (error) {
      throw new Error("Error updating booking status");
    }
  }
  
  async findTheappointmentForqrcodeById(bookingId: string) {
    try {
      return await this.SPAppointmentRepository.findAppointmentById(bookingId);
    } catch (error) {
      throw new Error("ot get");
    }
  }

  


  async cancelAppointment(id: string, reason: string) {

    // Find the appointment by ID
    const appointment = await this.SPAppointmentRepository.findAppointmentById(id);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.bookingStatus === "cancelled") {
      throw new Error("Already cancelled");
    }

    // Update appointment status to 'cancelled'
    await this.SPEditAppointmentRepository.updateAppointmentStatus(id, "cancelled");

    // Update the time slot status to 'not occupied'
    await this.SPAppointmentRepository.updateTimeSlotStatus(
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

  
  async getWalletDetails(userId:String) {
    try {
      const WalletDetails = await this.UserRepository.getWalletDetails(userId);
      return WalletDetails;
    } catch (error) {
      throw error;
    }
  }
  
  async isWalletHaveMoney(userId:String) {
    try {
      const WalletDetails = await this.UserRepository.isWalletHaveMoney(userId);
      return WalletDetails;
    } catch (error) {
      throw error;
    }
  }

}

export default UserUseCase;
