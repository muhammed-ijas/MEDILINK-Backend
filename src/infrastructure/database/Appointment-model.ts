import mongoose, { Schema, Document, Model } from 'mongoose';


const medicationSchema: Schema = new Schema({
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  route: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String, required: true },
  refills: { type: Number, default: 0 }, 
});

// Define the appointment schema
const appointmentSchema: Schema<any & Document> = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  serviceProvider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SP', 
    required: true 
  }, 
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    required: true 
  }, 
  doctor: {   
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientAge: {
    type: Number,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'Approved', 'rejected','completed','cancelled'],
    default: 'pending',
  },
  qrCode: {
    type: String, 
  },
  prescription: [medicationSchema], 

});

const AppointmentModel: Model<any & Document> = mongoose.model('Appointment', appointmentSchema);

export default AppointmentModel;