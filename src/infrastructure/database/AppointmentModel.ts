import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the appointment schema
const appointmentSchema: Schema<any & Document> = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the user making the appointment
  serviceProvider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SP', 
    required: true 
  }, // Reference to the service provider
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    required: true 
  }, // Reference to the department
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  }, // Reference to the doctor being booked
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
    enum: ['pending', 'Approved', 'rejected','completed'],
    default: 'pending',
  },
  qrCode: {
    type: String, 
  },

});

// Create the Appointment model
const AppointmentModel: Model<any & Document> = mongoose.model('Appointment', appointmentSchema);

export default AppointmentModel;