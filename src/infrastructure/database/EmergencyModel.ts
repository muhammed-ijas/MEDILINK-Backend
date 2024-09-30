import mongoose, { Model, Schema, Document } from "mongoose";
import EmergencyNumbers from "../../domain/EmergencyNumbers";

const EmergencySchema: Schema<EmergencyNumbers> = new Schema({
  emergencyNumber:{
    type: String 
  },
  serviceProvider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SP', 
    required: true 
  }, 
});

const EmergencyModel: Model<any & Document> = mongoose.model("Emergency", EmergencySchema);

export default EmergencyModel;