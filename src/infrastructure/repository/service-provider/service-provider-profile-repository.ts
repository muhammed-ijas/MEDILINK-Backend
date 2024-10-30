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
  async editProfile(
    Id: string,
    data: {
      name: string;
      email: string;
      phone: string;
      area: string;
      city: string;
      latitude: number;
      longitude: number;
      state: string;
      pincode: number;
      district: string;
      serviceType: string;
      closingTime: string;
      openingTime: string;
      profileImage: string;
      firstDocumentImage: string;
      secondDocumentImage: string;
    }
  ): Promise<boolean> {
    const update = await SPModel.updateOne({ _id: Id },
      {
        $set: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          area: data.area,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          state: data.state,
          pincode: data.pincode,
          district: data.district,
          serviceType: data.serviceType,
          closingTime: data.closingTime,
          openingTime: data.openingTime,
          profileImage: data.profileImage,
          firstDocumentImage: data.firstDocumentImage,
          secondDocumentImage: data.secondDocumentImage,
        },
      }
    );
    return update.modifiedCount > 0;
  }

  async changeProfileImage(Id: string, imageUrl: string): Promise<boolean> {
    const result = await SPModel.updateOne(
      { _id: Id },
      { $set: { profileImage: imageUrl } }
    );
    return result.modifiedCount > 0;
  }

  async changeFirstDocumentImage(Id: string,imageUrl: string): Promise<boolean> {
    const result = await SPModel.updateOne(
      { _id: Id },
      { $set: { firstDocumentImage: imageUrl } }
    );
    return result.modifiedCount > 0;
  }

  async changeSecondDocumentImage(Id: string,imageUrl: string): Promise<boolean> {
    const result = await SPModel.updateOne(
      { _id: Id },
      { $set: { secondDocumentImage: imageUrl } }
    );
    return result.modifiedCount > 0;
  }


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