import SPModel from "../../database/service-provider-model";

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
  //saving provider details to database
 
  async findPaginatedHospitals(page: number, limit: number, search: string) {
    try {
      return await SPModel.find({
        isVerified: true,
        serviceType: "hospital",
        name: new RegExp(search, "i"),
      })
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async countHospitals(search: string) {
    try {
      return await SPModel.countDocuments({
        isVerified: true,
        serviceType: "hospital",
        name: new RegExp(search, "i"),
      });
    } catch (error) {
      throw error;
    }
  }

  async findPaginatedClinicks(page: number, limit: number, search: string) {
    try {
      return await SPModel.find({
        isVerified: true,
        serviceType: "clinic",
        name: new RegExp(search, "i"),
      })
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async countClinicks(search: string) {
    try {
      return await SPModel.countDocuments({
        isVerified: true,
        serviceType: "clinic",
        name: new RegExp(search, "i"),
      });
    } catch (error) {
      throw error;
    }
  }

  async findPaginatedAmbulances(page: number, limit: number, search: string) {
    try {
      return await SPModel.find({
        isVerified: true,
        serviceType: "ambulance",
        name: new RegExp(search, "i"),
      })
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async countAmbulances(search: string) {
    try {
      return await SPModel.countDocuments({
        isVerified: true,
        serviceType: "ambulance",
        name: new RegExp(search, "i"),
      });
    } catch (error) {
      throw error;
    }
  }

  async findPaginatedHomeNurses(page: number, limit: number, search: string) {
    try {
      return await SPModel.find({
        isVerified: true,
        serviceType: "homeNurse",
        name: new RegExp(search, "i"),
      })
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async countHomeNurses(search: string) {
    try {
      return await SPModel.countDocuments({
        isVerified: true,
        serviceType: "homeNurse",
        name: new RegExp(search, "i"),
      });
    } catch (error) {
      throw error;
    }
  }

}
export default SPRepository;