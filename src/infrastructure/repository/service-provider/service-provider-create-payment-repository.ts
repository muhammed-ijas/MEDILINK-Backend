import SPModel from "../../database/service-provider-model";
import DepartmentModel from "../../database/department-model";
import DoctorModel from "../../database/doctor-model";

import AppointmentModel from "../../database/Appointment-model";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2024-06-20",
});

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

class SPRepository  {

  async createPaymentSession(data: any) {
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
      const department = await DepartmentModel.findById(
        doctor.department
      ).exec();
      if (!department) throw new Error("Department not found");

      // Fetch the service provider based on department.serviceProvider
      const serviceProvider = await SPModel.findById(
        department.serviceProvider
      ).exec();
      if (!serviceProvider) throw new Error("Service Provider not found");

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
        amount: data.amount,
        paymentStatus: "pending",
      });

      await appointment.save();

      // Create Stripe Payment Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "INR",
              product_data: {
                name: "Doctor Appointment",
              },
              unit_amount: 50 * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:5173//user/success?bookingId=${appointment._id}`,
        cancel_url: "http://localhost:5173//user/cancel",
      });

      return session;
    } catch (error) {
      console.error("Error in createPaymentSession:", error);
      throw new Error("An error occurred while creating the payment session");
    }
  }


  async findDoctorById(doctorId: string) {
    try {
      const doctor = await DoctorModel.findById(doctorId);
      return doctor;
    } catch (error) {
      throw error;
    }
  }

}
export default SPRepository;