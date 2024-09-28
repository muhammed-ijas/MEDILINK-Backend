import mongoose, { Model, Schema, Document } from "mongoose";
import SP from "../../domain/sp"; 


const ratingSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const spSchema: Schema<any & Document> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: false,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '', 
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  openingTime: {
    type: String,
    default: "09:00",
    required: true,
  },
  closingTime: {
    type: String,
    default: "17:00",
    required: true,
  },
  isVerified:{
    type:Boolean,
    default:false,
    required:true,
  },
  serviceType:{
    type:String,
  },
  latitude:{
    type:Number,
    required:true
  },
  longitude:{
    type:Number,
    required:true
  },
  departments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  }],
  firstDocumentImage:{
    type:String
  },
  secondDocumentImage:{
    type:String
  },
  ratings: [ratingSchema], //for ratings 
});

const SPModel: Model<SP & Document> = mongoose.model<SP & Document>(
  "SP",
  spSchema
);

spSchema.index({ location: '2dsphere' });

export default SPModel;
