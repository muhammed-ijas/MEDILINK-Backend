import User from "../../domain/user";
import UserModel from "../database/userModel";
import UserRepo from "../../useCase/interface/userRepo";
import Otp from "../../domain/otp";
import OtpModel from "../database/otpModel";

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
      console.log("Fetched OTP record:", otpRecord);
      return otpRecord;
    } catch (error) {
      console.error("Error fetching OTP record:", error);
      throw error;
    }
  }

  async deleteOtpByEmail(email: string): Promise<any> {
    console.log("deletee all otps");
    
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

  async chnagePasswordById(Id:string, password:string): Promise<boolean> {
    const result  = await UserModel.updateOne({_id:Id},{$set:{password:password}});
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
      console.log("Fetched password :", user);
      return user?.password;
    } catch (error) {
      console.error("Error fetching current password:", error);
      throw error;
    }
  }
}

export default UserRepository;
