import DepartmentModel from "../../database/department-model";
import DoctorModel from "../../database/doctor-model";
import sendOtp from "../../services/send-email";

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
  //saving provider details to database
 

  async deleteDoctor(doctorId: string) {
    try {
      // find the doctor
      const doctor = await DoctorModel.findById(doctorId);
      if (!doctor) {
        throw new Error("Doctor not found");
      }
      //remove the doctor from  department model
      await DepartmentModel.findByIdAndUpdate(
        doctor.department,
        { $pull: { doctors: doctorId } },
        { new: true }
      );
      // Step 3: Check the doctor's time slots and cancel appointments if necessary
      const currentDate = new Date();
      const canceledAppointments: string[] = []; // Explicitly define the type as string[]
  
      for (const availableDate of doctor.availableDates) {
        for (const timeSlot of availableDate.timeSlots) {
          // If the time slot is occupied
          if (timeSlot.status === 'occupied' && timeSlot.user) {

            const appointments = await AppointmentModel.updateMany(
              {
                user: timeSlot.user,
                doctor: doctorId,
                bookingDate: { $gte: currentDate }, // Only update future appointments
                bookingStatus: { $ne: 'cancelled' } // Exclude already cancelled appointments
              },
              { $set: { bookingStatus: 'cancelled' } } // Update status to cancelled
            );
  
            // Collect user email for notifications
            if (appointments.modifiedCount > 0) {
              const userEmail = timeSlot.user.email; // Ensure timeSlot.user has an email property
              canceledAppointments.push(userEmail); // No need to cast to string
            }
          }
        }
      }

      // Step 5: Delete the doctor
      await DoctorModel.findByIdAndUpdate(doctorId, { isDeleted: true });
      // Step 6: Send cancellation emails
      const emailService = new sendOtp(); // Create an instance of your email service
      canceledAppointments.forEach(email => {
        emailService.sendCancellation(email, 'The doctor you had an appointment with has been deleted.');
      });
      return { message: "Doctor deleted successfully and cancellation emails sent." }; 

    } catch (error) {
      console.error('Error in deleteDoctor:', error);
      throw error;
    }
  }
}
export default SPRepository;