import mongoose, { Model, Schema, Document } from "mongoose";

const doctorSchema: Schema<any & Document> = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  specialization: { 
    type: String, 
    required: true 
  },
  availableFrom: { 
    type: String, 
    required: true 
  }, 
  availableTo: { 
    type: String, 
    required: true 
  },   
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    required: true 
  }, 
  contact: { 
    type: String, 
    required: true 
  },
});

const DoctorModel: Model<any & Document> = mongoose.model("Doctor", doctorSchema);

export default DoctorModel;
