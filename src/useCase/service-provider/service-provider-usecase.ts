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



import sendOtp from "../../infrastructure/services/send-email";
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


class SPUseCase {
  private SPRepository: SPRepository;
  private SPAppointmentRepository: SPAppointmentRepository;
  private generateEmail: sendOtp;
  private SPEditAppointmentRepository: SPEditAppointmentRepository;
  private SPEmergencyRepository: SPEmergencyRepository;
  private SPPrescriptionRepository: SPPrescriptionRepository;

  constructor(
    SPRepository: SPRepository,
    SPAppointmentRepository: SPAppointmentRepository,
    generateEmail: sendOtp,
    SPEditAppointmentRepository: SPEditAppointmentRepository,
    SPEmergencyRepository: SPEmergencyRepository,
    SPPrescriptionRepository: SPPrescriptionRepository,
    
  ) {
    this.SPRepository = SPRepository;
    this.SPAppointmentRepository = SPAppointmentRepository;
    this.generateEmail = generateEmail;
    this.SPEditAppointmentRepository = SPEditAppointmentRepository;
    this.SPEmergencyRepository = SPEmergencyRepository;
    this.SPPrescriptionRepository = SPPrescriptionRepository;
  }
 


 

  async getFullAppointmentList(spId: string) {
    try {
      const appointments = await this.SPAppointmentRepository.findAppointmentsBySPId(spId);
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  
  async approveAppointment(id: string) {
    const appointment = await this.SPEditAppointmentRepository.approveAppointment(id);
    if (!appointment)
      throw new Error("Appointment not found or already approved");
    return appointment;
  }

  async completeAppointment(id: string) {
    const appointment = await this.SPEditAppointmentRepository.completeAppointment(id);

    if (!appointment)
      throw new Error("Appointment not found or already completed");
    return appointment;
  }

  async cancelAppointment(id: string, reason: string) {
    const appointment = await this.SPAppointmentRepository.findAppointmentById(id);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.bookingStatus === "cancelled") {
      throw new Error("Already cancelled");
    }

    await this.SPEditAppointmentRepository.updateAppointmentStatus(id, "cancelled");
    // Update the time slot status to 'not occupied'
    await this.SPAppointmentRepository.updateTimeSlotStatus(
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
      const EmergencyNumbers = await this.SPEmergencyRepository.findEmergencyNumber(
        spId
      );
      return EmergencyNumbers;
    } catch (error) {
      throw error;
    }
  }

  async updateEmergencyNumber(spId: string, emergencyNumber: string) {
    try {
      const EmergencyNumbers = await this.SPEmergencyRepository.updateEmergencyNumber(
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
      const result = await this.SPEmergencyRepository.deleteEmergencyNumber(spId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAppointmentDetails(spId: string) {
    try {
      const appointments = await this.SPAppointmentRepository.getAppointmentDetails(spId);
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
      const result = await this.SPPrescriptionRepository.addPrescriptionToAppointment(
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
      const result = await this.SPPrescriptionRepository.getPrescription(appointmentId);
      return result;
    } catch (error) {
      throw error;
    }
  }
 

  async getRecentAppointments(appointmentId: string) {
    try {
      const appointments =
        await this.SPAppointmentRepository.findAppointmentsAppointmentId(appointmentId);
      return appointments;
    } catch (error) {
      throw error;
    }
  }

}

export default SPUseCase;
