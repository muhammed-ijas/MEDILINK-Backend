import DoctorModel from "../../database/doctor-model";

interface DoctorData {
  doctorId: string;
  name: string;
  specialization: string;
  yearsOfExperience: string;
  contact: string;
  doctorProfileImage: string;
  validCertificate: string;
}

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

class SPRepository {
  //saving provider details to database
  async updateDoctorDetails(doctorData: DoctorData) {
    try {
      const {
        doctorId, 
        name, 
        specialization, 
        yearsOfExperience, 
        contact, 
        doctorProfileImage, 
        validCertificate
      } = doctorData;
  
      // Find doctor by ID and update the details
      const updatedDoctor = await DoctorModel.findByIdAndUpdate(
        doctorId, // Filter by doctor ID
        {         // Fields to update
          name,
          specialization,
          yearsOfExperience,
          contact,
          doctorProfileImage,
          validCertificate
        },
        { new: true, useFindAndModify: false } // Return the updated document
      );
  
      if (!updatedDoctor) {
        throw new Error('Doctor not found');
      }
        return updatedDoctor;
    } catch (error) {
      throw error;
    }
  }
  
}
export default SPRepository;