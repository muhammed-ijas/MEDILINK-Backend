import SPModel from "../../database/service-provider-model";
import DepartmentModel from "../../database/department-model";
import DoctorModel from "../../database/doctor-model";

import AppointmentModel from "../../database/Appointment-model";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2024-06-20",
});

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

class SPRepository  {
  //saving provider details to database
  async getAllServiceDetails(spId: string) {
    try {
      const departments = await DepartmentModel.find({ serviceProvider: spId })
        .populate("doctors")
        .exec();

      return departments;
    } catch (error) {
      console.error("Error in getAllServiceDetails:", error);
      return null;
    }
  }

  async findHospitalClinicById(id: string) {
    try {
      const result = await SPModel.findById({ _id: id }).populate(
        "departments"
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findDepartmentById(id: string) {
    try {
      const result = await DepartmentModel.findById({ _id: id }).populate({
        path: "doctors",
        populate: {
          path: "availableDates", // Populate availableDates with time slots
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getDoctorDetailsFromSearchPage(id: string) {
    try {
      const result = await DoctorModel.findById(id)
        .populate({
          path: "availableDates",
          populate: {
            path: "timeSlots",
          },
        })
        .populate("department");

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findHomeNurseById(id: string) {
    try {
      const result = await SPModel.findById({ _id: id });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAmbulanceById(id: string) {
    try {
      const result = await SPModel.findById({ _id: id });
      return result;
    } catch (error) {
      throw error;
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

  async isDoctorHaveSlots(doctorId: string) {
    try {
      const doctor = await DoctorModel.findById(doctorId)
        .populate({
          path: 'availableDates.timeSlots.user',
          model: 'User',
          select: 'name email',
        })
        .exec();
  
      // Check if doctor has future available dates
      if (doctor && doctor.availableDates) {
        const currentDate = new Date();
  
        // Check for any future dates
        const hasFutureDates = doctor.availableDates.some((date: AvailableDate) => {
          return new Date(date.date) > currentDate; // Check if any date is in the future
        });
  
        return hasFutureDates; // Return true if there are future dates, otherwise false
      }
  
      return false; // Return false if no doctor found or no available dates
    } catch (error) {
      console.error('Error in isDoctorHaveSlots:', error);
      throw error;
    }
  }
}
export default SPRepository;