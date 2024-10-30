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
    
  async confirmWalletPayment(data: any) {
    // Validate required fields
    if (
      !data.userInfo ||
      !data.doctorId ||
      !data.bookingDate ||
      !data.timeSlot ||
      !data.patientName ||
      !data.patientAge ||
      !data.patientEmail ||
      !data.patientPhone ||
      !data.amount
    ) {
      throw new Error("Missing required fields");
    }
  
    try {      
      // Fetch the doctor based on doctorId
      const doctor = await DoctorModel.findById(data.doctorId).exec();
      if (!doctor) throw new Error("Doctor not found");
  
      // Fetch the department based on doctor.department
      const department = await DepartmentModel.findById(doctor.department).exec();
      if (!department) throw new Error("Department not found");
  
      // Fetch the service provider based on department.serviceProvider
      const serviceProvider = await SPModel.findById(department.serviceProvider).exec();
      if (!serviceProvider) throw new Error("Service Provider not found");
  
      // Create a new appointment with status "pending"
      const appointment = new AppointmentModel({
        user: data.userInfo._id,
        serviceProvider: serviceProvider._id,
        department: department._id,
        doctor: doctor._id,
        bookingDate: new Date(data.bookingDate),
        timeSlot: data.timeSlot,
        patientName: data.patientName,
        patientAge: data.patientAge,
        patientEmail: data.patientEmail,
        patientPhone: data.patientPhone,
        amount: 50,
        paymentStatus: "completed", // Change status to confirmed
      });
  
      await appointment.save(); // Save the appointment
  
      // Update the user's wallet
      const user = await UserModel.findById(data.userInfo._id).exec();
      if (!user) throw new Error("User not found");
  
      // Deduct amount from wallet
      user.wallet.push({
        appointmentId: appointment._id,
        date: new Date(), // Current date
        amount: 50, // Use the amount passed from data
        isPlus: false, // Mark as a deduction
      });
  
      await user.save(); // Save the updated user
  
      // Update doctor's availability
      const availableDate = doctor.availableDates.find(
        (date: AvailableDate) =>
          date.date.toISOString().split("T")[0] ===
          appointment.bookingDate.toISOString().split("T")[0]
      );
  
      if (!availableDate) throw new Error("No available date found");
  
      const timeSlot = availableDate?.timeSlots.find(
        (slot: TimeSlot) => slot.slot === appointment.timeSlot
      );

      if (!timeSlot) throw new Error("No matching time slot found");
  
      if (timeSlot.status === "not occupied") {
        timeSlot.status = "occupied";
        timeSlot.user = appointment.user;
      }
  
      await doctor.save(); // Save updated doctor's availability
  
      // Generate QR code for appointment details
      const qrCodeContent = `
        MEDILINK Appointment
        
        Service Provider: ${serviceProvider.name}
        Department: ${department.name}
        Doctor: ${doctor.name}
        
        Appointment Date: ${appointment.bookingDate.toLocaleDateString()}
        Time Slot: ${appointment.timeSlot}
        
        Patient Details:
          Name: ${appointment.patientName}
          Age: ${appointment.patientAge}
          Email: ${appointment.patientEmail}
          Phone: ${appointment.patientPhone}
        
        Booking ID: ${appointment._id}
      `.trim();
  
      const qrCodeData = await QRCode.toDataURL(qrCodeContent);
      appointment.qrCode = qrCodeData; // Save QR code in appointment
      await appointment.save(); // Save appointment with QR code
  
      return { message: "Appointment created successfully", appointmentId: appointment._id, qrCode: qrCodeData };
    } catch (error) {
      console.error('Error in confirmWalletPayment:', error);
      throw new Error("An error occurred while confirming the wallet payment");
    }
  }
}
export default SPRepository;