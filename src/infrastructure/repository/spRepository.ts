import SP from "../../domain/sp";
import SPModel from "../database/spModel";
import SPRepo from "../../useCase/interface/spRepo";
import SPOtp from "../../domain/SPOtp";
import SPOtpModel from "../database/SPOtpModel";
import DepartmentModel from "../database/departmentModel";
import DoctorModel from "../database/doctorsModel";
import mongoose, { Model, Schema, Document } from "mongoose";

interface Doctor {
  _id?: string; // _id is optional because new doctors won't have one initially
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
  availableTime?: string[]; // Optional field
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

  async addDepartment(
    spId: string,
    departmentName: string,
    doctors: {
      name: string;
      specialization: string;
      availableFrom: string;
      availableTo: string;
      contact: string;
    }[]
  ): Promise<boolean> {
    try {
      // Check if the department already exists for the given service provider
      const existingDepartment = await DepartmentModel.findOne({
        name: departmentName,
        serviceProvider: spId,
      });

      if (existingDepartment) {
        const doctorDocs = await Promise.all(
          doctors.map((doctor) => {
            return new DoctorModel({
              ...doctor,
              department: existingDepartment._id,
            }).save();
          })
        );

        existingDepartment.doctors.push(...doctorDocs.map((doc) => doc._id));
        await existingDepartment.save();

        return true;
      } else {
        const department = new DepartmentModel({
          name: departmentName,
          serviceProvider: spId,
        });

        await department.save();

        const doctorDocs = await Promise.all(
          doctors.map((doctor) => {
            return new DoctorModel({
              ...doctor,
              department: department._id,
            }).save();
          })
        );

        department.doctors = doctorDocs.map((doc) => doc._id);
        await department.save();

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

  // async findPaginatedHospitals(page: number, limit: number) {
  //   try {
  //     return await SPModel.find({ isVerified: true , serviceType:"hospital" })
  //       .skip((page - 1) * limit)
  //       .limit(limit);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async countHospitals() {
  //   try {
  //     return await SPModel.countDocuments({isVerified: true , serviceType:"hospital"});
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findPaginatedClinicks(page: number, limit: number) {
  //   try {
  //     return await SPModel.find({ isVerified: true , serviceType:"clinick" })
  //       .skip((page - 1) * limit)
  //       .limit(limit);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async countClinicks() {
  //   try {
  //     return await SPModel.countDocuments({isVerified: true , serviceType:"clinick"});
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findPaginatedAmbulances(page: number, limit: number) {
  //   try {
  //     return await SPModel.find({ isVerified: true , serviceType:"ambulance" })
  //       .skip((page - 1) * limit)
  //       .limit(limit);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async countAmbulances() {
  //   try {
  //     return await SPModel.countDocuments({isVerified: true , serviceType:"ambulance"});
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findPaginatedHomeNurses(page: number, limit: number) {
  //   try {
  //     return await SPModel.find({ isVerified: true , serviceType:"homeNurse" })
  //       .skip((page - 1) * limit)
  //       .limit(limit);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async countHomeNurses() {
  //   try {
  //     return await SPModel.countDocuments({isVerified: true , serviceType:"homeNurse"});
  //   } catch (error) {
  //     throw error;
  //   }
  // }


  async findPaginatedHospitals(page: number, limit: number, search: string) {
    try {
      return await SPModel.find({
        isVerified: true,
        serviceType: "hospital",
        name: new RegExp(search, 'i') // Case-insensitive search
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
        name: new RegExp(search, 'i')
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
        name: new RegExp(search, 'i')
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
        name: new RegExp(search, 'i')
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
        name: new RegExp(search, 'i')
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
        name: new RegExp(search, 'i')
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
        name: new RegExp(search, 'i')
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
        name: new RegExp(search, 'i')
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
  //   doctors: any[]
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

  //     // Update each doctor
  //     const updateDoctorPromises = doctors.map((doctor: any) => {
  //       return DoctorModel.findByIdAndUpdate(
  //         doctor._id,
  //         {
  //           name: doctor.name,
  //           specialization: doctor.specialization,
  //           availableFrom: doctor.availableFrom,
  //           availableTo: doctor.availableTo,
  //           contact: doctor.contact,
  //         },
  //         { new: true }
  //       );
  //     });

  //     // Execute all update promises
  //     const updatedDoctors = await Promise.all(updateDoctorPromises);

  //     const newDoctors = doctors.filter((doctor: any) => !doctor._id);
  //     console.log("newDoctors :",newDoctors)

  //     // Fetch the updated department with populated doctors
  //     const departmentWithDoctors = await DepartmentModel.findById(departmentId)
  //       .populate("doctors")
  //       .exec();

  //     // Return the updated department and doctors
  //     return {
  //       department: departmentWithDoctors,
  //       doctors: updatedDoctors,
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

      // Create a list of new doctors (those without _id)
      const newDoctors = doctors.filter((doctor: Doctor) => !doctor._id);

      // Save new doctors and collect their IDs
      const addedDoctorsPromises = newDoctors.map((doctor: Doctor) => {
        return new DoctorModel({
          ...doctor,
          department: departmentId,
        }).save();
      });

      const addedDoctors = await Promise.all(addedDoctorsPromises);

      // Collect the IDs of the new doctors
      const newDoctorIds = addedDoctors.map((doctor: any) => doctor._id);

      // Existing doctor IDs for update and removal
      const existingDoctorIds = updatedDepartment.doctors.map((doc: any) =>
        doc.toString()
      );

      const existingDoctors = doctors.filter((doctor: Doctor) => doctor._id);
      for (const doctor of existingDoctors) {
        await DoctorModel.findByIdAndUpdate(
          doctor._id,
          {
            ...doctor, // Update with all fields from the provided doctor object
            department: departmentId, // Ensure the department field is updated as well
          },
          { new: true }
        );
      }

      console.log("existingDoctorIds :", existingDoctorIds);

      // Collect IDs of doctors to be removed
      const doctorIdsToRemove = existingDoctorIds.filter(
        (id: string) =>
          !doctors.some(
            (doctor: Doctor) => doctor._id && doctor._id.toString() === id
          )
      );

      const doctorIdsToStay = existingDoctorIds.filter((id: string) =>
        doctors.some(
          (doctor: Doctor) => doctor._id && doctor._id.toString() === id
        )
      );
      console.log("doctorIdsToStay :", doctorIdsToStay);

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
}

export default SPRepository;
