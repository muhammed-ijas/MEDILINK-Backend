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

  async addDepartment(
    spId: string,
    departmentName: string,
    avgTime: string
  ): Promise<{ status: boolean; message: string }> {
    try {
      // Check if the department already exists for the given service provider
      const existingDepartment = await DepartmentModel.findOne({
        name: departmentName,
        serviceProvider: spId,
      });

      if (existingDepartment) {
        return { status: false, message: "Department already added" }; // Return a clear message
      } else {
        // Create a new department
        const department = new DepartmentModel({
          name: departmentName,
          serviceProvider: spId,
        });
        department.avgTime = avgTime;

        await department.save();

        // Update the service provider with the new department
        await SPModel.findByIdAndUpdate(
          spId,
          { $push: { departments: department._id } },
          { new: true }
        );
        return { status: true, message: "Department added successfully" }; // Successful addition
      }
    } catch (error) {
      console.error("Error in addDepartment:", error);
      throw new Error("Failed to add department");
    }
  }

  async getAllDoctorDetailsInsideADepartment(departmentId: string) {
    try {
      const department = await DepartmentModel.findById(departmentId)
      .populate('doctors');
      if (!department) {
        throw new Error('Department not found');
      }
      return department.doctors; 
    } catch (error) {
      console.error('Error in addPrescriptionToAppointment:', error);
      throw error; 
    }
  }

  async getDoctorSlotsDetails(doctorId: string) {
    try {
      
      const doctor = await DoctorModel.findById(doctorId)
        .populate({
          path: 'availableDates.timeSlots.user',
          model: 'User', 
          select: 'name email', 
        })
        .exec();

      return doctor?.availableDates || []; 
    } catch (error) {
      console.error('Error in getDoctorSlotsDetails:', error);
      throw error;
    }
  }
}
export default SPRepository;