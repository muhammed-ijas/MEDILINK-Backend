import User from "../../domain/user";
import UserModel from "../database/userModel";
import UserRepo from "../../useCase/interface/userRepo";
import Otp from "../../domain/otp";
import OtpModel from "../database/otpModel";

import AppointmentModel from "../database/AppointmentModel";
import DoctorModel from "../database/doctorsModel";
import SPModel from "../database/spModel";
import EmergencyModel from "../database/EmergencyModel";

class UserRepository implements UserRepo {
  //saving user details to database
  async save(user: User): Promise<User> {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await UserModel.findOne({ email: email });

    return userData;
  }

  async findById(_id: string): Promise<User | null> {
    const userData = await UserModel.findById(_id);

    return userData;
  }

  async saveOtp(
    email: string,
    otp: number,
    name?: string,
    phone?: string,
    password?: string
  ): Promise<any> {
    const otpDoc = new OtpModel({
      name: name,
      email: email,
      phone: phone,
      password: password,
      otp: otp,
      otpGeneratedAt: new Date(),
    });

    const savedDoc = await otpDoc.save();

    return savedDoc;
  }

  async findOtpByEmail(email: string): Promise<any> {
    try {
      const otpRecord = await OtpModel.findOne({ email })
        .sort({ otpGeneratedAt: -1 })
        .exec();
      return otpRecord;
    } catch (error) {
      console.error("Error fetching OTP record:", error);
      throw error;
    }
  }

  async deleteOtpByEmail(email: string): Promise<any> {
    return OtpModel.deleteMany({ email });
  }

  async changePassword(email: string, password: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      {
        email: email,
      },
      { $set: { password: password } }
    );

    return result.modifiedCount > 0;
  }

  async chnagePasswordById(Id: string, password: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id: Id },
      { $set: { password: password } }
    );
    return result.modifiedCount > 0;
  }

  async editProfile(
    Id: string,
    data: { name: string; email: string; phone: string }
  ): Promise<boolean> {
    const update = await UserModel.updateOne(
      { _id: Id },
      { $set: { name: data.name, email: data.email, phone: data.phone } }
    );

    return update.modifiedCount > 0;
  }

  async findPasswordById(Id: string): Promise<any> {
    try {
      const user = await UserModel.findOne({ _id: Id });
      return user?.password;
    } catch (error) {
      console.error("Error fetching current password:", error);
      throw error;
    }
  }



  async addReview(appointmentId: string, rating: number, review: string) {
    try {
      // Find the appointment and populate relevant fields
      const appointment = await AppointmentModel.findById(appointmentId)
        .populate("serviceProvider")
        .populate("doctor")
        .populate("user");
  
      // Check if the appointment exists and is completed
      if (!appointment || appointment.bookingStatus !== "completed") {
        throw new Error("Appointment must be completed to add a review.");
      }
  
      const userId = appointment.user._id;
  
      // Create the new review object
      const newReview = {
        userId, 
        rating,
        review,
        createdAt: new Date(),
      };
  
      // Check if the service provider exists
      if (appointment.serviceProvider) {
        const existingReview = await SPModel.findOne({
          _id: appointment.serviceProvider._id,
          "ratings.userId": userId,  // Check if the user already has a review
        });
  
        if (existingReview) {
          // If the review exists, update it
          await SPModel.updateOne(
            { _id: appointment.serviceProvider._id, "ratings.userId": userId },
            {
              $set: {
                "ratings.$.rating": rating,
                "ratings.$.review": review,
                "ratings.$.createdAt": new Date(),
              },
            }
          );
        } else {
          // If no review exists, add a new one
          await SPModel.findByIdAndUpdate(appointment.serviceProvider._id, {
            $push: { ratings: newReview },
          });
        }
      }
  
      // Repeat the same logic for doctors
      if (appointment.doctor) {
        const existingDoctorReview = await DoctorModel.findOne({
          _id: appointment.doctor._id,
          "ratings.userId": userId,  // Check if the user already has a review
        });
  
        if (existingDoctorReview) {
          // If the review exists, update it
          await DoctorModel.updateOne(
            { _id: appointment.doctor._id, "ratings.userId": userId },
            {
              $set: {
                "ratings.$.rating": rating,
                "ratings.$.review": review,
                "ratings.$.createdAt": new Date(),
              },
            }
          );
        } else {
          // If no review exists, add a new one
          await DoctorModel.findByIdAndUpdate(appointment.doctor._id, {
            $push: { ratings: newReview },
          });
        }
      }
  
      return { message: "Review added or updated successfully!", review: newReview };
    } catch (error) {
      throw new Error(`Error adding review: ${error}`);
    }
  }


  
  
  async findAllEmergencyNumber() {
    try {
      const EmergencyNumbers = await EmergencyModel.find({})
        .populate("serviceProvider", "name profileImage");
      return EmergencyNumbers;

    } catch (error) {
      throw error;
    }
  }
  
  
}

export default UserRepository;
