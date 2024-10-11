import mongoose, { Model, Schema, Document } from "mongoose";

// Interface for TimeSlot, now with a user reference
interface TimeSlot {
  slot: string; // e.g., "10:10 - 10:30"
  status: 'occupied' | 'not occupied';
  user?: mongoose.Schema.Types.ObjectId; // Reference to the user who booked the slot
}

// Interface for AvailableDate
interface AvailableDate {
  date: Date; // Each date in the range
  timeSlots: TimeSlot[]; // Array of time slots for that date
}

// Updated TimeSlot schema with a user reference
const timeSlotSchema: Schema = new Schema<TimeSlot>({
  slot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['occupied', 'not occupied'],
    default: 'not occupied',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: function (this: any) {
      return this.status === 'occupied';
    },
  },
}); // Prevents creating an additional `_id` for each time slot

// Schema for available dates
const availableDateSchema: Schema = new Schema<AvailableDate>({
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [timeSlotSchema], // Each date has an array of time slots
});


// Reuse the rating schema
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

// Doctor schema
const doctorSchema: Schema<any & Document> = new Schema({
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  availableFrom: {
    type: String,
    required: true,
  },
  availableTo: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  dateFrom: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  availableDates: [availableDateSchema], // Array of available dates with time slots
  ratings: [ratingSchema], // Add the ratings array here
  doctorProfileImage:{
    type:String,
    required:true,
  },
  yearsOfExperience:{
    type:String,
    required:true,
  },
  validCertificate:{
    type:String,
    required:true,
  },
  isDeleted:{
    type:Boolean,
    default:false,
  }
});

// Create the Doctor model
const DoctorModel: Model<any & Document> = mongoose.model("Doctor", doctorSchema);

export default DoctorModel;
