import mongoose, {Model,Schema,Document} from "mongoose";
import SPOtp from "../../domain/SPOtp";

const spOtpSchema:Schema = new Schema<SPOtp>({
  name:{type:String},  
  email: { type: String, required: true },
  phone:{type:String},
  password:{type:String},
  area:{type:String},
  city:{type:String},
  latitude:{ type:Number},
  longitude: { type:Number},
  state: {type:String},
  pincode: { type:Number},
  district: {type:String},
  otp: { type: Number, required: true },
  otpGeneratedAt: { type: Date, required: true },
});

const SPOtpModel : Model<SPOtp|Document>=mongoose.model<SPOtp&Document>("SPOtp",spOtpSchema)

export default SPOtpModel;
