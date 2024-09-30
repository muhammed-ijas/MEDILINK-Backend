import { ObjectId } from "mongoose";

interface EmergencyNumbers{
    emergencyNumber:string,
    serviceProvider:ObjectId;
}

export default EmergencyNumbers;