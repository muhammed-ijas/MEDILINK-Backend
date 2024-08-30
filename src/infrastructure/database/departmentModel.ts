import mongoose, { Model, Schema, Document } from "mongoose";

const departmentSchema: Schema<any & Document> = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  serviceProvider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SP', 
    required: true 
  }, 
  doctors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor' 
  }] 
});

const DepartmentModel: Model<any & Document> = mongoose.model("Department", departmentSchema);

export default DepartmentModel;
