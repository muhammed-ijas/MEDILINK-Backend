import SPModel from "../../database/service-provider-model";
import mongoose from "mongoose";

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
 
  async findRatingsOfSPById(spId: string) {
    try {
      // Aggregate pipeline to get ratings along with doctor and user details
      const result = await SPModel.aggregate([
        // Match the service provider by id
        { $match: { _id: new mongoose.Types.ObjectId(spId) } },

        // Unwind the departments array
        { $unwind: "$departments" },

        // Lookup the department data
        {
          $lookup: {
            from: "departments",
            localField: "departments",
            foreignField: "_id",
            as: "departmentDetails",
          },
        },

        // Unwind the departmentDetails array
        { $unwind: "$departmentDetails" },

        // Unwind the doctors array inside departmentDetails
        { $unwind: "$departmentDetails.doctors" },

        // Lookup the doctor data
        {
          $lookup: {
            from: "doctors",
            localField: "departmentDetails.doctors",
            foreignField: "_id",
            as: "doctorDetails",
          },
        },

        // Unwind the doctorDetails array
        { $unwind: "$doctorDetails" },

        // Unwind the ratings array inside doctorDetails
        { $unwind: "$doctorDetails.ratings" },

        // Lookup the user data for ratings
        {
          $lookup: {
            from: "users",
            localField: "doctorDetails.ratings.userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },

        // Unwind the userDetails array
        { $unwind: "$userDetails" },

        // Project the desired fields
        {
          $project: {
            _id: 0,
            doctorName: "$doctorDetails.name",
            patientName: "$userDetails.name",
            rating: "$doctorDetails.ratings.rating",
            review: "$doctorDetails.ratings.review",
            createdAt: "$doctorDetails.ratings.createdAt",
          },
        },
      ]);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
export default SPRepository;