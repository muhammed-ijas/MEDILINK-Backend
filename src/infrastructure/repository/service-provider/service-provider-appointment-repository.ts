import DoctorModel from "../../database/doctor-model";

import AppointmentModel from "../../database/Appointment-model";

interface TimeSlot {
  slot: string;
  status: "occupied" | "not occupied";
  user?: string; // Reference to the user who booked the slot (optional)
}

interface AvailableDate {
  date: Date;
  timeSlots: TimeSlot[];
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
 
  async findAppointmentsByUserId(userId: string) {
    try {
      const appointments = await AppointmentModel.find({ user: userId })
        .populate("serviceProvider", "name , profileImage")
        .populate("doctor", "name")
        .populate("department", "name")
        .sort({ createdAt: -1 })
        .exec();

        return appointments;
    } catch (error) {
      throw error;
    }
  }



  async findAppointmentsBySPId(spId: string) {
    try {
      const appointments = await AppointmentModel.find({
        serviceProvider: spId,
      })
        .populate("serviceProvider", "name profileImage")
        .populate("doctor", "name")
        .populate("department", "name")
        .sort({ createdAt: -1 })
        .exec();

      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async findAppointmentById(id: string) {
    return await AppointmentModel.findById(id);
  }

  async saveAppointment(appointment: any) {
    return await appointment.save(); // This will update the existing appointment
  }

  

  async updateTimeSlotStatus(
    doctorId: string,
    bookingDate: Date,
    timeSlotValue: string,
    status: string
  ) {
    try {
      // Find the doctor by ID
      const doctor = await DoctorModel.findById(doctorId).exec();
      if (!doctor) throw new Error("Doctor not found");

      // Find the correct date and time slot
      const availableDate = doctor.availableDates.find(
        (date: AvailableDate) =>
          date.date.toISOString().split("T")[0] ===
          bookingDate.toISOString().split("T")[0]
      );

      if (!availableDate) throw new Error("No available date found");

      const timeSlot = availableDate.timeSlots.find(
        (slot: TimeSlot) => slot.slot === timeSlotValue
      );
      if (!timeSlot) throw new Error("No matching time slot found");

      // Update the time slot status to 'not occupied'
      if (timeSlot.status === "occupied") {
        timeSlot.status = status; // Update status to 'not occupied'
        timeSlot.user = null; // Remove the user from the time slot
      }

      await doctor.save();

      return { message: "Time slot status updated successfully" };
    } catch (error) {
      throw new Error("Error updating time slot status");
    }
  }


  async getAppointmentDetails(spId: string) {
    try {
      const appointments = await AppointmentModel.find({ doctor: spId })
        .populate("serviceProvider", "name profileImage")
        .populate("doctor", "name")
        .populate("department", "name")
        .sort({ createdAt: -1 })
        .exec();
      return appointments;
    } catch (error) {
      throw error;
    }
  }

  async findAppointmentsAppointmentId(appointmentId: string) {
    try {
      const appointments = await AppointmentModel.find({ _id: appointmentId });
        if (appointments.length === 0) {
        throw new Error("Appointment not found");
      }
      const appointment = appointments[0];
      const userId = appointment.user._id;
      const recentAppointments = await AppointmentModel.find({ user: userId })
      .populate("serviceProvider", "name profileImage")
      .populate("doctor", "name")
      .populate("department", "name")
      .sort({ createdAt: -1 })
      .exec();
    
      return recentAppointments;
    } catch (error) {
      throw error; 
    }
  }

}
export default SPRepository;