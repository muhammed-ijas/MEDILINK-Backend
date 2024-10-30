import SPModel from "../../database/service-provider-model";
import DepartmentModel from "../../database/department-model";
import UserModel from "../../database/user-model";
import DoctorModel from "../../database/doctor-model";
import QRCode from "qrcode";

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
 
  async updateBookingStatus(bookingId: string, status: string) {
    try {
      const booking = await AppointmentModel.findById(bookingId).exec();
      if (!booking) throw new Error("Booking not found");

      booking.paymentStatus = status;

      const serviceProvider = await SPModel.findById(
        booking.serviceProvider
      ).exec();
      ``;
      const department = await DepartmentModel.findById(
        booking.department
      ).exec();
      const doctorr = await DoctorModel.findById(booking.doctor).exec();

      if (!serviceProvider || !department || !doctorr)
        throw new Error("Related data not found");

      // Format the QR code content with all the details
      const qrCodeContent = `
      MEDILINK Appointment
      
      Service Provider: ${booking.serviceProvider.name}
      Department: ${booking.department.name}
      Doctor: ${booking.doctor.name}
      
      Appointment Date: ${booking.bookingDate.toLocaleDateString()}
      Time Slot: ${booking.timeSlot}
      
      Patient Details:
        Name: ${booking.patientName}
        Age: ${booking.patientAge}
        Email: ${booking.patientEmail}
        Phone: ${booking.patientPhone}
      
      Booking ID: ${booking._id}
      `.trim();

      const qrCodeData = await QRCode.toDataURL(qrCodeContent);
      booking.qrCode = qrCodeData;

      await booking.save();

      const doctor = await DoctorModel.findById(booking.doctor).exec();
      if (!doctor) throw new Error("Doctor not found");

      // Find the correct date and time slot
      const availableDate = doctor.availableDates.find(
        (date: AvailableDate) =>
          date.date.toISOString().split("T")[0] ===
          booking.bookingDate.toISOString().split("T")[0]
      );

      if (!availableDate) throw new Error("No available date found");

      const timeSlot = availableDate?.timeSlots.find(
        (slot: TimeSlot) => slot.slot === booking.timeSlot
      );
      if (!timeSlot) throw new Error("No matching time slot found");

      if (timeSlot.status === "not occupied") {
        timeSlot.status = "occupied";
        timeSlot.user = booking.user;
      }

      await doctor.save();

      return { message: "Booking and time slot status updated successfully" };
    } catch (error) {
      throw new Error("Error updating booking status and time slot");
    }
  }

  async approveAppointment(id: string) {
    return await AppointmentModel.findByIdAndUpdate(
      id,
      { bookingStatus: "approved" },
      { new: true }
    );
  }

  async completeAppointment(id: string) {
    return await AppointmentModel.findByIdAndUpdate(
      id,
      { bookingStatus: "completed" },
      { new: true }
    );
  }

  async updateAppointmentStatus(id: string, status: string) {
    // Find the appointment to get the user ID
    const appointment = await AppointmentModel.findById(id).select('user');
    
    if (!appointment) {
        throw new Error('Appointment not found');
    }

    const userId = appointment.user; // Get the user ID from the appointment

    // Update the appointment status
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
        id,
        { bookingStatus: status },
        { new: true } // This option returns the updated document
    );

    // If the appointment is cancelled, add 50 to the user's wallet
    if (status === 'cancelled') {
        const walletEntry = {
            appointmentId: id,
            date: new Date(), // current date
            amount: 50, // refund amount
            isPlus:true,
        };

        // Check if the user already has a wallet
        const userWallet = await UserModel.findOne({ _id: userId }).select('wallet');

        if (userWallet) {
            // User has a wallet, add the new wallet entry
            await UserModel.updateOne(
                { _id: userId },
                { $push: { wallet: walletEntry } } // Push the new wallet entry
            );
        } else {
            // User does not have a wallet, create a new one
            await UserModel.updateOne(
                { _id: userId },
                { $set: { wallet: [walletEntry] } } // Create a new wallet with the entry
            );
        }
    }

    return updatedAppointment;
}
}
export default SPRepository;