import mongoose, {Model,Schema,Document} from "mongoose";
import User from "../../domain/user";

const useSchema:Schema = new Schema<User | Document>(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        phone:{
            type:String
        },
        isBlocked:{
            type:Boolean,
            default:false
        },
        fromGoogle:{
            type:Boolean,
            default:false
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        wallet: [
            {
              appointmentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Appointment", // Assuming you have an Appointment model
              },
              date: {
                type: Date,
              },
              amount: {
                type: Number,
              },
              isPlus:{
                type:Boolean,
              }
            },
          ],
    }
)

const UserModel:Model<User&Document> = mongoose.model<User&Document>(
    "User",
    useSchema
)

export default UserModel;