import EmergencyModel from "../../database/emergency-model";

// Define the Medication and Prescription types
export interface Medication {
  medication: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  instructions?: string;
  refills?: number;
}

export interface Prescription {
  medications: Medication[];
}

class SPRepository  {
 
  async findEmergencyNumber(spId: string) {
    try {
      const EmergencyNumbers = await EmergencyModel.find({
        serviceProvider: spId,
      }).populate("serviceProvider", "name profileImage");
      return EmergencyNumbers;
    } catch (error) {
      throw error;
    }
  }

  async updateEmergencyNumber(spId: string, emergencyNumber: string) {
    try {
      const existingEmergencyNumber = await EmergencyModel.findOne({
        serviceProvider: spId,
      });

      if (existingEmergencyNumber) {
        existingEmergencyNumber.emergencyNumber = emergencyNumber;
        await existingEmergencyNumber.save();
        return existingEmergencyNumber;
      } else {
        const newEmergencyNumber = await EmergencyModel.create({
          serviceProvider: spId,
          emergencyNumber: emergencyNumber,
        });
        return newEmergencyNumber;
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteEmergencyNumber(spId: string) {
    try {
      const deletedEmergencyNumber = await EmergencyModel.findOneAndDelete({
        serviceProvider: spId,
      });

      if (!deletedEmergencyNumber) {
        throw new Error(
          "Emergency number not found for the specified service provider."
        );
      }

      return deletedEmergencyNumber;
    } catch (error) {
      throw error;
    }
  }


}
export default SPRepository;