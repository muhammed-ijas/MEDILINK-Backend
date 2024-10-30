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
  private SPAddDepartmentRepository: SPAddDepartmentRepository;
  private SPRepository: SPRepository;
  private SPAddDoctorRepository: SPAddDoctorRepository;
  private SPEditDepartmentRepository: SPEditDepartmentRepository;
  private SPDeleteDepartmentRepository: SPDeleteDepartmentRepository;
  private SPEditDoctorRepository: SPEditDoctorRepository;
  private SPDeleteDoctorRepository: SPDeleteDoctorRepository;
 
  constructor(
    SPAddDepartmentRepository: SPAddDepartmentRepository,
    SPRepository: SPRepository,
    SPAddDoctorRepository: SPAddDoctorRepository,
    SPEditDepartmentRepository: SPEditDepartmentRepository,
    SPDeleteDepartmentRepository: SPDeleteDepartmentRepository,
    SPEditDoctorRepository: SPEditDoctorRepository,
    SPDeleteDoctorRepository: SPDeleteDoctorRepository,
  ) {
    this.SPAddDepartmentRepository = SPAddDepartmentRepository;
    this.SPRepository = SPRepository;
    this.SPAddDoctorRepository = SPAddDoctorRepository;
    this.SPEditDepartmentRepository = SPEditDepartmentRepository;
    this.SPDeleteDepartmentRepository = SPDeleteDepartmentRepository;
    this.SPEditDoctorRepository = SPEditDoctorRepository;
    this.SPDeleteDoctorRepository = SPDeleteDoctorRepository;
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
      const result = await this.SPAddDoctorRepository.addDoctorToDepartment(
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
      const result = await this.SPAddDepartmentRepository.addDepartment(
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

 
  async editDepartment(
    spId: string,
    departmentId: string,
    name: string,
    doctors: any[]
  ) {
    try {
      const updatedDepartment = await this.SPEditDepartmentRepository.editDepartment(
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
      const deleted = await this.SPDeleteDepartmentRepository.deleteDepartment(
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


 
  
  async getDoctorDetails(doctorId: string) {
    try {
      const doctorDetails = await this.SPRepository.findDoctorById(doctorId);
      return doctorDetails;
    } catch (error) {
      throw error;
    }
  }

 

  async updateDoctorDetails(doctorData: DoctorData) {
    try {
      const result = await this.SPEditDoctorRepository.updateDoctorDetails(doctorData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllDoctorDetailsInsideADepartment(departmentId: string) {
    try {
      const result = await this.SPAddDepartmentRepository.getAllDoctorDetailsInsideADepartment(departmentId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getDoctorSlotsDetails(doctorId: string) {
    try {
      const result = await this.SPAddDepartmentRepository.getDoctorSlotsDetails(doctorId);
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


  // usecases/spUseCase.ts or similar file
async deleteDoctor(doctorId: string) {
  try {
    // You might want to add additional checks here if necessary
    await this.SPDeleteDoctorRepository.deleteDoctor(doctorId); // Call repository method to delete doctor
  } catch (error) {
    throw error; // Re-throw the error for handling in the controller
  }
}

}

export default SPUseCase;
