import SPModel from "../../database/service-provider-model";
import DepartmentModel from "../../database/department-model";
import DoctorModel from "../../database/doctor-model";

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

class SPRepository {
  //saving provider details to database
 
  async deleteDepartment(spId: string, departmentId: string) {
    try {
      const department = await DepartmentModel.findOne({
        _id: departmentId,
        serviceProvider: spId,
      });
      const result = await DepartmentModel.deleteOne({
        _id: departmentId,
        serviceProvider: spId,
      });

      await SPModel.updateMany(
        { departments: departmentId },
        { $pull: { departments: departmentId } }
      );

      if (result.deletedCount > 0) {
        const doctorsDeleted = await DoctorModel.deleteMany({
          _id: { $in: department?.doctors || [] },
        });
        if (doctorsDeleted.deletedCount > 0) {
          return {success: true,message: "Department and associated doctors deleted successfully",};
        } else {
          return {success: true,message:"Department deleted, but no associated doctors found or deleted",};
        }
      } else {
        return { success: false, message: "Failed to delete the department" };
      }
    } catch (error) {
      console.log("Error in deleteDepartment:", error);
      return {
        success: false,
        message: "An error occurred while deleting the department",
      };
    }
  }

}
export default SPRepository;