import SP from "../../domain/sp";
import SPModel from "../database/spModel";
import SPRepo from "../../useCase/interface/spRepo";
import SPOtp from "../../domain/SPOtp";
import SPOtpModel from "../database/SPOtpModel";
import DepartmentModel from "../database/departmentModel";
import DoctorModel from "../database/doctorsModel";
import mongoose, { Model, Schema, Document } from "mongoose";

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
    } catch (error) {
      console.error("Error in addDepartment:", error);
      return false;
    }
  }

  async findPaginated(page: number, limit: number) {
    try {
      return await SPModel.find({isVerified:true})
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      return await SPModel.countDocuments();
    } catch (error) {
      throw error;
    }
  }
}

export default SPRepository;
