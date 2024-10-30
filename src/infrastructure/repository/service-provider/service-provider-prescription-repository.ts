import AppointmentModel from "../../database/Appointment-model";

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
 
  async addPrescriptionToAppointment(appointmentId: string, prescription: Prescription) {
    try {
      
      const appointment = await AppointmentModel.findById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
        if (appointment.prescription && appointment.prescription.length > 0) {
        appointment.prescription = prescription.medications; // Replace the old prescription with the new one
      } else {
        appointment.prescription = prescription.medications;
      }
      
      await appointment.save();
      
      return appointment; 
    } catch (error) {
      console.error('Error in addPrescriptionToAppointment:', error);
      throw error; 
    }
  }
  
  
  async getPrescription(appointmentId: string) {
    try {
      
      const appointment = await AppointmentModel.findById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      return appointment.prescription; 
    } catch (error) {
      console.error('Error in addPrescriptionToAppointment:', error);
      throw error; 
    }
  }
  


}
export default SPRepository;