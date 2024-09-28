import SP from "../../domain/sp";
import SPModel from "../database/spModel";
import SPRepo from "../../useCase/interface/spRepo";
import SPOtp from "../../domain/SPOtp";
import SPOtpModel from "../database/SPOtpModel";
import DepartmentModel from "../database/departmentModel";
import DoctorModel from "../database/doctorsModel";
import mongoose, { Model, Schema, Document } from "mongoose";
import moment from "moment";
import QRCode from "qrcode";

import AppointmentModel from "../database/AppointmentModel";

// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET!, {
//   apiVersion: "2024-06-20",
// });

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2024-06-20",
});

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET);

interface TimeSlot {
  slot: string;
  status: "occupied" | "not occupied";
  user?: string; // Reference to the user who booked the slot (optional)
}

interface AvailableDate {
  date: Date;
  timeSlots: TimeSlot[];
}

interface Doctor {
  _id?: string; // _id is optional because new doctors won't have one initially
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
  dateFrom: Date; // New fields for date range
  dateEnd: Date; // New fields for date range
  availableDates: AvailableDate[]; // Array of available dates, each containing time slots
}

class SPRepository implements SPRepo {
  //saving provider details to database
  async save(sp: SP): Promise<SP> {
    const newSP = new SPModel(sp);
    console.log("before save", newSP);

    const savedSP = await newSP.save();
    return savedSP;
  }
  async findByEmail(email: string): Promise<SP | null> {
    const spData = await SPModel.findOne({ email: email });

    return spData;
  }
  async findById(_id: string): Promise<SP | null> {
    const spData = await SPModel.findById(_id);
    return spData;
  }

  async saveOtp(
    email: string,
    otp: number,
    name?: string,
    phone?: string,
    password?: string,
    area?: string,
    city?: string,
    latitude?: number,
    longitude?: number,
    state?: string,
    pincode?: number,
    district?: string
  ): Promise<any> {
    const otpDoc = new SPOtpModel({
      name: name,
      email: email,
      phone: phone,
      password: password,
      area: area,
      city: city,
      latitude: latitude,
      longitude: longitude,
      state: state,
      pincode: pincode,
      district: district,
      otp: otp,
      otpGeneratedAt: new Date(),
    });

    const savedDoc = await otpDoc.save();

    return savedDoc;
  }
  async findOtpByEmail(email: string): Promise<any> {
    try {
      const otpRecord = await SPOtpModel.findOne({ email })
        .sort({ otpGeneratedAt: -1 })
        .exec();
      console.log("Fetched OTP record:", otpRecord);
      return otpRecord;
    } catch (error) {
      console.error("Error fetching OTP record:", error);
      throw error;
    }
  }

  async deleteOtpByEmail(email: string): Promise<any> {
    return SPOtpModel.deleteOne({ email });
  }

  async editProfile(
    Id: string,
    data: {
      name: string;
      email: string;
      phone: string;
      area: string;
      city: string;
      latitude: number;
      longitude: number;
      state: string;
      pincode: number;
      district: string;
      serviceType: string;
      closingTime: string;
      openingTime: string;
      profileImage: string;
      firstDocumentImage: string;
      secondDocumentImage: string;
    }
  ): Promise<boolean> {
    const update = await SPModel.updateOne(
      { _id: Id },
      {
        $set: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          area: data.area,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          state: data.state,
          pincode: data.pincode,
          district: data.district,
          serviceType: data.serviceType,
          closingTime: data.closingTime,
          openingTime: data.openingTime,
          profileImage: data.profileImage,
          firstDocumentImage: data.firstDocumentImage,
          secondDocumentImage: data.secondDocumentImage,
        },
      }
    );
    return update.modifiedCount > 0;
  }

  async findPasswordById(Id: string): Promise<any> {
    try {
      const sp = await SPModel.findOne({ _id: Id });
      return sp?.password;
    } catch (error) {
      console.error("Error fetching current password:", error);
      throw error;
    }
  }

  async changePasswordById(Id: string, password: string): Promise<boolean> {
    const result = await SPModel.updateOne(
      { _id: Id },
      { $set: { password: password } }
    );
    return result.modifiedCount > 0;
  }

  async changeProfileImage(Id: string, imageUrl: string): Promise<boolean> {
    const result = await SPModel.updateOne(
      { _id: Id },
      { $set: { profileImage: imageUrl } }
    );
    return result.modifiedCount > 0;
  }

  async changeFirstDocumentImage(
    Id: string,
    imageUrl: string
  ): Promise<boolean> {
    const result = await SPModel.updateOne(
      { _id: Id },
      { $set: { firstDocumentImage: imageUrl } }
    );
    return result.modifiedCount > 0;
  }

  async changeSecondDocumentImage(
    Id: string,
    imageUrl: string
  ): Promise<boolean> {
    const result = await SPModel.updateOne(
      { _id: Id },
      { $set: { secondDocumentImage: imageUrl } }
    );
    return result.modifiedCount > 0;
  }

  // async addDepartment(
  //   spId: string,
  //   departmentName: string,
  //   doctors: {
  //     name: string;
  //     specialization: string;
  //     availableFrom: string;
  //     availableTo: string;
  //     contact: string;
  //   }[]
  // ): Promise<boolean> {
  //   try {
  //     // Check if the department already exists for the given service provider
  //     const existingDepartment = await DepartmentModel.findOne({
  //       name: departmentName,
  //       serviceProvider: spId,
  //     });

  //     if (existingDepartment) {
  //       const doctorDocs = await Promise.all(
  //         doctors.map((doctor) => {
  //           return new DoctorModel({
  //             ...doctor,
  //             department: existingDepartment._id,
  //           }).save();
  //         })
  //       );

  //       existingDepartment.doctors.push(...doctorDocs.map((doc) => doc._id));
  //       await existingDepartment.save();

  //       return true;
  //     } else {
  //       const department = new DepartmentModel({
  //         name: departmentName,
  //         serviceProvider: spId,
  //       });

  //       await department.save();

  //       const doctorDocs = await Promise.all(
  //         doctors.map((doctor) => {
  //           return new DoctorModel({
  //             ...doctor,
  //             department: department._id,
  //           }).save();
  //         })
  //       );

  //       department.doctors = doctorDocs.map((doc) => doc._id);
  //       await department.save();

  //       await SPModel.findByIdAndUpdate(
  //         spId,
  //         { $push: { departments: department._id } },
  //         { new: true }
  //       );

  //       return true;
  //     }
  //   } catch (error) {
  //     console.error("Error in addDepartment:", error);
  //     return false;
  //   }
  // }

  async addDepartment(
    spId: string,
    departmentName: string,
    doctors: {
      name: string;
      specialization: string;
      availableFrom: string;
      availableTo: string;
      contact: string;
      dateFrom: string;
      dateEnd: string;
    }[],
    avgTime: string
  ): Promise<boolean> {
    try {
      // Check if the department already exists for the given service provider
      const existingDepartment = await DepartmentModel.findOne({
        name: departmentName,
        serviceProvider: spId,
      });

      // console.log(avgTime);

      // Function to generate time slots for a single day
      function generateTimeSlots(
        from: string,
        to: string
      ): { slot: string; status: "not occupied" }[] {
        const slots: { slot: string; status: "not occupied" }[] = [];
        let current = moment(from, "HH:mm");
        const end = moment(to, "HH:mm");

        while (current < end) {
          const next = moment(current).add(avgTime, "minutes");
          if (next > end) break;

          slots.push({
            slot: `${current.format("HH:mm")} - ${next.format("HH:mm")}`,
            status: "not occupied",
          });

          current = next;
        }

        return slots;
      }

      function generateAvailableDates(
        dateFrom: string,
        dateEnd: string,
        availableFrom: string,
        availableTo: string
      ): AvailableDate[] {
        const dates: AvailableDate[] = [];
        const startDate = moment(dateFrom, "YYYY-MM-DD");
        const endDate = moment(dateEnd, "YYYY-MM-DD");

        let currentDate = startDate;

        // Loop through each date in the range and generate time slots
        while (currentDate <= endDate) {
          const timeSlots = generateTimeSlots(availableFrom, availableTo);
          dates.push({
            date: currentDate.toDate(),
            timeSlots,
          });
          currentDate = currentDate.add(1, "days"); // Move to the next day
        }

        return dates;
      }

      const createDoctor = async (doctor: any, departmentId: string) => {
        // Generate available dates with time slots for each doctor
        const availableDates = generateAvailableDates(
          doctor.dateFrom,
          doctor.dateEnd,
          doctor.availableFrom,
          doctor.availableTo
        );

        return new DoctorModel({
          ...doctor,
          department: departmentId,
          availableDates, // Add the generated available dates and time slots
        }).save();
      };

      if (existingDepartment) {
        // Add doctors to the existing department
        const doctorDocs = await Promise.all(
          doctors.map((doctor) => createDoctor(doctor, existingDepartment._id))
        );

        // Update the existing department with the new doctors
        existingDepartment.doctors.push(...doctorDocs.map((doc) => doc._id));
        await existingDepartment.save();

        return true;
      } else {
        // Create a new department
        const department = new DepartmentModel({
          name: departmentName,
          serviceProvider: spId,
        });

        await department.save();

        // Add doctors to the new department
        const doctorDocs = await Promise.all(
          doctors.map((doctor) => createDoctor(doctor, department._id))
        );

        department.doctors = doctorDocs.map((doc) => doc._id);
        department.avgTime = avgTime;
        await department.save();

        // Update the service provider with the new department
        await SPModel.findByIdAndUpdate(
          spId,
          { $push: { departments: department._id } },
          { new: true }
        );

        return true;
      }
    } catch (error) {
      console.error("Error in addDepartment:", error);
      return false;
    }
  }

  async findPaginatedHospitals(page: number, limit: number, search: string) {
    try {
      return await SPModel.find({
        isVerified: true,
        serviceType: "hospital",
        name: new RegExp(search, "i"),
      })
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async countHospitals(search: string) {
    try {
      return await SPModel.countDocuments({
        isVerified: true,
        serviceType: "hospital",
        name: new RegExp(search, "i"),
      });
    } catch (error) {
      throw error;
    }
  }

  async findPaginatedClinicks(page: number, limit: number, search: string) {
    try {
      return await SPModel.find({
        isVerified: true,
        serviceType: "clinic",
        name: new RegExp(search, "i"),
      })
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async countClinicks(search: string) {
    try {
      return await SPModel.countDocuments({
        isVerified: true,
        serviceType: "clinic",
        name: new RegExp(search, "i"),
      });
    } catch (error) {
      throw error;
    }
  }

  async findPaginatedAmbulances(page: number, limit: number, search: string) {
    try {
      return await SPModel.find({
        isVerified: true,
        serviceType: "ambulance",
        name: new RegExp(search, "i"),
      })
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async countAmbulances(search: string) {
    try {
      return await SPModel.countDocuments({
        isVerified: true,
        serviceType: "ambulance",
        name: new RegExp(search, "i"),
      });
    } catch (error) {
      throw error;
    }
  }

  async findPaginatedHomeNurses(page: number, limit: number, search: string) {
    try {
      return await SPModel.find({
        isVerified: true,
        serviceType: "homeNurse",
        name: new RegExp(search, "i"),
      })
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async countHomeNurses(search: string) {
    try {
      return await SPModel.countDocuments({
        isVerified: true,
        serviceType: "homeNurse",
        name: new RegExp(search, "i"),
      });
    } catch (error) {
      throw error;
    }
  }

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

  // async editDepartment(
  //   spId: string,
  //   departmentId: string,
  //   name: string,
  //   doctors: Doctor[] // Use the defined interface here
  // ) {
  //   try {
  //     console.log(
  //       "Repository: Editing department with ID:",
  //       spId,
  //       departmentId,
  //       name,
  //       doctors
  //     );

  //     // Update the department details
  //     const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
  //       departmentId,
  //       { name },
  //       { new: true }
  //     );

  //     if (!updatedDepartment) {
  //       throw new Error("Department not found");
  //     }

  //     // Create a list of new doctors (those without _id)
  //     const newDoctors = doctors.filter((doctor: Doctor) => !doctor._id);

  //     // Save new doctors and collect their IDs
  //     const addedDoctorsPromises = newDoctors.map((doctor: Doctor) => {
  //       return new DoctorModel({
  //         ...doctor,
  //         department: departmentId,
  //       }).save();
  //     });

  //     const addedDoctors = await Promise.all(addedDoctorsPromises);

  //     // Collect the IDs of the new doctors
  //     const newDoctorIds = addedDoctors.map((doctor: any) => doctor._id);

  //     // Existing doctor IDs for update and removal
  //     const existingDoctorIds = updatedDepartment.doctors.map((doc: any) =>
  //       doc.toString()
  //     );

  //     const existingDoctors = doctors.filter((doctor: Doctor) => doctor._id);
  //     for (const doctor of existingDoctors) {
  //       await DoctorModel.findByIdAndUpdate(
  //         doctor._id,
  //         {
  //           ...doctor, // Update with all fields from the provided doctor object
  //           department: departmentId, // Ensure the department field is updated as well
  //         },
  //         { new: true }
  //       );
  //     }

  //     // console.log("existingDoctorIds :", existingDoctorIds);

  //     // Collect IDs of doctors to be removed
  //     const doctorIdsToRemove = existingDoctorIds.filter(
  //       (id: string) =>
  //         !doctors.some(
  //           (doctor: Doctor) => doctor._id && doctor._id.toString() === id
  //         )
  //     );

  //     const doctorIdsToStay = existingDoctorIds.filter((id: string) =>
  //       doctors.some(
  //         (doctor: Doctor) => doctor._id && doctor._id.toString() === id
  //       )
  //     );
  //     // console.log("doctorIdsToStay :", doctorIdsToStay);

  //     // Remove doctors that are no longer in the list
  //     await DoctorModel.deleteMany({ _id: { $in: doctorIdsToRemove } }).exec();

  //     // Update the department's doctors field with new and existing doctor IDs
  //     const allDoctorIds = [...doctorIdsToStay, ...newDoctorIds];
  //     await DepartmentModel.findByIdAndUpdate(departmentId, {
  //       $set: { doctors: allDoctorIds },
  //     }).exec();

  //     // Fetch the updated department with populated doctors
  //     const departmentWithDoctors = await DepartmentModel.findById(departmentId)
  //       .populate("doctors")
  //       .exec();

  //     // Return the updated department and doctors
  //     return {
  //       department: departmentWithDoctors,
  //       doctors: [...addedDoctors],
  //     };
  //   } catch (error) {
  //     console.error("Error in editDepartment:", error);
  //     return null;
  //   }
  // }

  async editDepartment(
    spId: string,
    departmentId: string,
    name: string,
    doctors: Doctor[] // Use the defined interface here
  ) {
    try {
      console.log(
        "Repository: Editing department with ID:",
        spId,
        departmentId,
        name,
        doctors
      );

      // Update the department details
      const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
        departmentId,
        { name },
        { new: true }
      );

      if (!updatedDepartment) {
        throw new Error("Department not found");
      }

      // Helper function to generate time slots for a single day
      function generateTimeSlots(
        from: string,
        to: string
      ): { slot: string; status: "not occupied" }[] {
        const slots: { slot: string; status: "not occupied" }[] = [];
        let current = moment(from, "HH:mm");
        const end = moment(to, "HH:mm");

        while (current < end) {
          const next = moment(current).add(
            updatedDepartment.avgTime,
            "minutes"
          );
          if (next > end) break;

          slots.push({
            slot: `${current.format("HH:mm")} - ${next.format("HH:mm")}`,
            status: "not occupied",
          });

          current = next;
        }

        return slots;
      }

      // Helper function to generate available dates and their time slots
      function generateAvailableDates(
        dateFrom: Date | string,
        dateEnd: Date | string,
        availableFrom: string,
        availableTo: string
      ): AvailableDate[] {
        const dates: AvailableDate[] = [];

        // Convert Date to string if needed
        const startDate = moment(
          dateFrom instanceof Date ? dateFrom.toISOString() : dateFrom,
          "YYYY-MM-DD"
        );
        const endDate = moment(
          dateEnd instanceof Date ? dateEnd.toISOString() : dateEnd,
          "YYYY-MM-DD"
        );

        let currentDate = startDate;

        while (currentDate <= endDate) {
          const timeSlots = generateTimeSlots(availableFrom, availableTo);
          dates.push({
            date: currentDate.toDate(),
            timeSlots,
          });
          currentDate = currentDate.add(1, "days");
        }

        return dates;
      }

      // Create a list of new doctors (those without _id)
      const newDoctors = doctors.filter((doctor: Doctor) => !doctor._id);

      // Save new doctors and collect their IDs
      const addedDoctorsPromises = newDoctors.map(async (doctor: Doctor) => {
        const availableDates = generateAvailableDates(
          doctor.dateFrom,
          doctor.dateEnd,
          doctor.availableFrom,
          doctor.availableTo
        );

        return new DoctorModel({
          ...doctor,
          department: departmentId,
          availableDates, // Add the generated available dates and time slots
        }).save();
      });

      const addedDoctors = await Promise.all(addedDoctorsPromises);

      // Collect the IDs of the new doctors
      const newDoctorIds = addedDoctors.map((doctor: any) => doctor._id);

      // Existing doctor IDs for update and removal
      const existingDoctorIds = updatedDepartment.doctors.map((doc: any) =>
        doc.toString()
      );

      // Process existing doctors
      const existingDoctors = doctors.filter((doctor: Doctor) => doctor._id);
      for (const doctor of existingDoctors) {
        // Check if available dates or slots were edited
        const availableDates = generateAvailableDates(
          doctor.dateFrom,
          doctor.dateEnd,
          doctor.availableFrom,
          doctor.availableTo
        );

        // Update the doctor with new available dates and time slots
        await DoctorModel.findByIdAndUpdate(
          doctor._id,
          {
            ...doctor, // Update all fields from the provided doctor object
            department: departmentId, // Ensure the department field is updated as well
            availableDates, // Update with newly generated available dates and slots
          },
          { new: true }
        );
      }

      // Collect IDs of doctors to be removed
      const doctorIdsToRemove = existingDoctorIds.filter(
        (id: string) =>
          !doctors.some(
            (doctor: Doctor) => doctor._id && doctor._id.toString() === id
          )
      );

      // IDs of doctors that should stay
      const doctorIdsToStay = existingDoctorIds.filter((id: string) =>
        doctors.some(
          (doctor: Doctor) => doctor._id && doctor._id.toString() === id
        )
      );

      // Remove doctors that are no longer in the list
      await DoctorModel.deleteMany({ _id: { $in: doctorIdsToRemove } }).exec();

      // Update the department's doctors field with new and existing doctor IDs
      const allDoctorIds = [...doctorIdsToStay, ...newDoctorIds];
      await DepartmentModel.findByIdAndUpdate(departmentId, {
        $set: { doctors: allDoctorIds },
      }).exec();

      // Fetch the updated department with populated doctors
      const departmentWithDoctors = await DepartmentModel.findById(departmentId)
        .populate("doctors")
        .exec();

      // Return the updated department and doctors
      return {
        department: departmentWithDoctors,
        doctors: [...addedDoctors],
      };
    } catch (error) {
      console.error("Error in editDepartment:", error);
      return null;
    }
  }

  async deleteDepartment(spId: string, departmentId: string) {
    try {
      const department = await DepartmentModel.findOne({
        _id: departmentId,
        serviceProvider: spId,
      });
      const result = await DepartmentModel.deleteOne({
        _id: departmentId,
        serviceProvider: spId,
      });

      await SPModel.updateMany(
        { departments: departmentId },
        { $pull: { departments: departmentId } }
      );

      if (result.deletedCount > 0) {
        const doctorsDeleted = await DoctorModel.deleteMany({
          _id: { $in: department?.doctors || [] },
        });
        if (doctorsDeleted.deletedCount > 0) {
          return {
            success: true,
            message: "Department and associated doctors deleted successfully",
          };
        } else {
          return {
            success: true,
            message:
              "Department deleted, but no associated doctors found or deleted",
          };
        }
      } else {
        return { success: false, message: "Failed to delete the department" };
      }
    } catch (error) {
      console.log("Error in deleteDepartment:", error);
      return {
        success: false,
        message: "An error occurred while deleting the department",
      };
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

  async findAppointmentsByUserId(userId: string) {
    try {
      console.log("came in repos appointment details ", userId);

      const appointments = await AppointmentModel.find({ user: userId })
        .populate("serviceProvider", "name , profileImage")
        .populate("doctor", "name")
        .populate("department", "name")
        .sort({ createdAt: -1 })
        .exec();
      console.log(appointments);

      return appointments;
    } catch (error) {
      throw error;
    }
  }

  // async createPaymentSession(data: any) {
  //   console.log("came in repository ",data)

  //   // Validate required fields
  //   if (
  //     !data.userInfo ||
  //     !data.doctorId ||
  //     !data.bookingDate ||
  //     !data.timeSlot ||
  //     !data.patientName ||
  //     !data.patientAge ||
  //     !data.patientEmail ||
  //     !data.patientPhone ||
  //     !data.amount
  //   ) {
  //     throw new Error("Missing required fields");
  //   }

  //   // Fetch the doctor based on doctorId
  //   const doctor = await DoctorModel.findById(data.doctorId).exec();

  //   if (!doctor) {
  //     throw new Error("Doctor not found");
  //   }

  //   // Fetch the department based on doctor.department
  //   const department = await DepartmentModel.findById(doctor.department).exec();

  //   if (!department) {
  //     throw new Error("Department not found");
  //   }

  //   // Fetch the service provider based on department.serviceProvider
  //   const serviceProvider = await SPModel.findById(
  //     department.serviceProvider
  //   ).exec();

  //   if (!serviceProvider) {
  //     throw new Error("Service Provider not found");
  //   }

  //   console.log("mukunda mukundaaaaa");

  //   // Create Stripe Payment Session
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ["card"],
  //     line_items: [
  //       {
  //         price_data: {
  //           currency: "INR", // You can customize this or use data.currency
  //           product_data: {
  //             name: "Doctor Appointment",
  //           },
  //           unit_amount: data.amount * 100, // Convert amount to the smallest unit (e.g., cents)
  //         },
  //         quantity: 1,
  //       },
  //     ],
  //     mode: "payment",
  //     success_url:
  //       data.successUrl || "http://localhost:3000/user/success",
  //     cancel_url: data.cancelUrl || "http://localhost:3000/user/cancel",
  //   });

  //   console.log("Stripe session  :", session);

  //   // Save Appointment in MongoDB
  //   const appointment = new AppointmentModel({
  //     user: data.userInfo._id, // User ID from userInfo
  //     serviceProvider: serviceProvider._id,
  //     department: department._id,
  //     doctor: doctor._id,
  //     bookingDate: new Date(data.bookingDate),
  //     timeSlot: data.timeSlot,
  //     patientName: data.patientName,
  //     patientAge: data.patientAge,
  //     patientEmail: data.patientEmail,
  //     patientPhone: data.patientPhone,
  //     amount: data.amount,
  //     paymentStatus: "pending", // Initial status as pending
  //   });

  //   await appointment.save(); // Save appointment in MongoDB

  //   return session;
  // }

  async createPaymentSession(data: any) {
    console.log("Received data in repository:", data);

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

      console.log("Creating Stripe session");

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
      console.log("Appointment saved:", appointment);

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
        success_url: `http://localhost:5173/user/success?bookingId=${appointment._id}`,
        cancel_url: "http://localhost:5173/user/cancel",
      });

      // console.log("Stripe session created:", session);

      return session;
    } catch (error) {
      console.error("Error in createPaymentSession:", error);
      throw new Error("An error occurred while creating the payment session");
    }
  }

  // In your bookingRepository.js

  async updateBookingStatus(bookingId: string, status: string) {
    try {
      const booking = await AppointmentModel.findById(bookingId).exec();
      if (!booking) throw new Error("Booking not found");

      booking.paymentStatus = status;

      // const qrCodeData = await QRCode.toDataURL(
      //   `Booking ID: ${booking._id}, Date: ${booking.bookingDate}`
      // );
      // booking.qrCode = qrCodeData;

      // await booking.save();
      // Fetch related details manually
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

  // async findAppointmentsBySPId(spId: string) {
  //   try {
  //     // console.log("came in repos appointment details ", spId);

  //     const appointments = await AppointmentModel.find({ serviceProvider: spId })
  //       .populate("serviceProvider", "name , profileImage")
  //       .populate("doctor", "name")
  //       .populate("department", "name")
  //       .sort({ createdAt: -1 })
  //       .exec();

  //     return appointments;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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


  async findAppointmentById(id: string) {
    return await AppointmentModel.findById(id);
  }


  async saveAppointment(appointment: any) {
    return await appointment.save(); // This will update the existing appointment
  }

  async updateAppointmentStatus(id: string, status: string) {
    return await AppointmentModel.findByIdAndUpdate(
      id,
      { bookingStatus: status },
      { new: true } // This option returns the updated document
    );
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

  //for ratings

  // async findRatingsOfSPById(id: string) {
  //   try {
  //     const result = await SPModel.
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // Repository method to find ratings of doctors under a service provider by SP Id
  // Repository method to find ratings of a service provider by SP Id
  // async findRatingsOfSPById(spId: string) {
  //   try {
  //     const result = await SPModel.findOne(
  //       { _id: spId }, // Find the service provider by ID
  //       { ratings: 1, _id: 0 } // Only return the 'ratings' field, exclude '_id'
  //     );

  //     console.log("result from repository  :",result);
      
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async findRatingsOfSPById(spId: string) {
    try {
      // Aggregate pipeline to get ratings along with doctor and user details
      const result = await SPModel.aggregate([
        // Match the service provider by id
        { $match: { _id: new mongoose.Types.ObjectId(spId) } },

        // Unwind the departments array
        { $unwind: "$departments" },

        // Lookup the department data
        {
          $lookup: {
            from: "departments",
            localField: "departments",
            foreignField: "_id",
            as: "departmentDetails"
          }
        },

        // Unwind the departmentDetails array
        { $unwind: "$departmentDetails" },

        // Unwind the doctors array inside departmentDetails
        { $unwind: "$departmentDetails.doctors" },

        // Lookup the doctor data
        {
          $lookup: {
            from: "doctors",
            localField: "departmentDetails.doctors",
            foreignField: "_id",
            as: "doctorDetails"
          }
        },

        // Unwind the doctorDetails array
        { $unwind: "$doctorDetails" },

        // Unwind the ratings array inside doctorDetails
        { $unwind: "$doctorDetails.ratings" },

        // Lookup the user data for ratings
        {
          $lookup: {
            from: "users",
            localField: "doctorDetails.ratings.userId",
            foreignField: "_id",
            as: "userDetails"
          }
        },

        // Unwind the userDetails array
        { $unwind: "$userDetails" },

        // Project the desired fields
        {
          $project: {
            _id: 0,
            doctorName: "$doctorDetails.name",
            patientName: "$userDetails.name",
            rating: "$doctorDetails.ratings.rating",
            review: "$doctorDetails.ratings.review",
            createdAt: "$doctorDetails.ratings.createdAt"
          }
        }
      ]);

      console.log("Aggregated result:", result);

      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default SPRepository;
