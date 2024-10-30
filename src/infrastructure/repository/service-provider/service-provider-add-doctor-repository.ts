import SPModel from "../../database/service-provider-model";
import DepartmentModel from "../../database/department-model";
import DoctorModel from "../../database/doctor-model";
import moment from "moment";

interface TimeSlot {
  slot: string;
  status: "occupied" | "not occupied";
  user?: string; // Reference to the user who booked the slot (optional)
}

interface AvailableDate {
  date: Date;
  timeSlots: TimeSlot[];
}

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
 
  async addDoctorToDepartment(
    spId: string,
    departmentId: string,
    doctors: {
      name: string;
      specialization: string;
      availableFrom: string;
      availableTo: string;
      contact: string;
      dateFrom: string;
      dateEnd: string;
      doctorProfileImage: string ;
      yearsOfExperience:string ; 
      validCertificate:string ;
    }[],
  ): Promise<boolean> {
    try {
      // Check if the department already exists for the given service provider
      const existingDepartment = await DepartmentModel.findOne({
        _id: departmentId,
        serviceProvider: spId,
      });

      const avgTime = existingDepartment.avgTime;

      // Function to generate time slots for a single day
      function generateTimeSlots(
        from: string,
        to: string
      ): { slot: string; status: "not occupied" }[] {
        const slots: { slot: string; status: "not occupied" }[] = [];
        let current = moment(from, "HH:mm");
        const end = moment(to, "HH:mm");

        while (current < end) {
          const next = moment(current).add(existingDepartment.avgTime, "minutes");
          if (next > end) break;

          slots.push({
            slot: `${current.format("HH:mm")} - ${next.format("HH:mm")}`,
            status: "not occupied",
          });

          current = next;
        }

        return slots;
      }

      function generateAvailableDates(
        dateFrom: string,
        dateEnd: string,
        availableFrom: string,
        availableTo: string
      ): AvailableDate[] {
        const dates: AvailableDate[] = [];
        const startDate = moment(dateFrom, "YYYY-MM-DD");
        const endDate = moment(dateEnd, "YYYY-MM-DD");

        let currentDate = startDate;

        // Loop through each date in the range and generate time slots
        while (currentDate <= endDate) {
          const timeSlots = generateTimeSlots(availableFrom, availableTo);
          dates.push({
            date: currentDate.toDate(),
            timeSlots,
          });
          currentDate = currentDate.add(1, "days"); // Move to the next day
        }

        return dates;
      }

      const createDoctor = async (doctor: any, departmentId: string) => {
        // Generate available dates with time slots for each doctor
        const availableDates = generateAvailableDates(
          doctor.dateFrom,
          doctor.dateEnd,
          doctor.availableFrom,
          doctor.availableTo
        );

        return new DoctorModel({
          ...doctor,
          department: departmentId,
          availableDates, // Add the generated available dates and time slots
        }).save();
      };

      if (existingDepartment) {
        // Add doctors to the existing department
        const doctorDocs = await Promise.all(
          doctors.map((doctor) => createDoctor(doctor, existingDepartment._id))
        );

        // Update the existing department with the new doctors
        existingDepartment.doctors.push(...doctorDocs.map((doc) => doc._id));
        await existingDepartment.save();

        return true;
      } else {
        // Create a new department
        const department = new DepartmentModel({
          _id: departmentId,
          serviceProvider: spId,
        });

        await department.save();

        // Add doctors to the new department
        const doctorDocs = await Promise.all(
          doctors.map((doctor) => createDoctor(doctor, department._id))
        );

        department.doctors = doctorDocs.map((doc) => doc._id);
        department.avgTime = avgTime;
        await department.save();

        // Update the service provider with the new department
        await SPModel.findByIdAndUpdate(
          spId,
          { $push: { departments: department._id } },
          { new: true }
        );
        return true;
      }
    } catch (error) {
      console.error("Error in addDepartment:", error);
      return false;
    }
  }
}
export default SPRepository;