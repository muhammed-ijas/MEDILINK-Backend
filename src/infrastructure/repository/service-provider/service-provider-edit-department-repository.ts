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

interface Doctor {
  _id?: string; // _id is optional because new doctors won't have one initially
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
  dateFrom: Date; // New fields for date range
  dateEnd: Date; // New fields for date range
  availableDates: AvailableDate[]; // Array of available dates, each containing time slots
  doctorProfileImage: string;
  validCertificate: string ;
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
  async editDepartment(
    spId: string,
    departmentId: string,
    name: string,
    doctors: Doctor[] // Use the defined interface here
  ) {
    try {
      // Update the department details
      const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
        departmentId,
        { name },
        { new: true }
      );
      if (!updatedDepartment) {
        throw new Error("Department not found");
      }

      // Helper function to generate time slots for a single day
      function generateTimeSlots(
        from: string,
        to: string
      ): { slot: string; status: "not occupied" }[] {
        const slots: { slot: string; status: "not occupied" }[] = [];
        let current = moment(from, "HH:mm");
        const end = moment(to, "HH:mm");

        while (current < end) {
          const next = moment(current).add(
            updatedDepartment.avgTime,
            "minutes"
          );
          if (next > end) break;
          slots.push({
            slot: `${current.format("HH:mm")} - ${next.format("HH:mm")}`,
            status: "not occupied",
          });
          current = next;
        }
        return slots;
      }

      // Helper function to generate available dates and their time slots
      function generateAvailableDates(
        dateFrom: Date | string,
        dateEnd: Date | string,
        availableFrom: string,
        availableTo: string
      ): AvailableDate[] {
        const dates: AvailableDate[] = [];

        // Convert Date to string if needed
        const startDate = moment(dateFrom instanceof Date ? dateFrom.toISOString() : dateFrom,"YYYY-MM-DD");
        const endDate = moment(
          dateEnd instanceof Date ? dateEnd.toISOString() : dateEnd,
          "YYYY-MM-DD"
        );

        let currentDate = startDate;

        while (currentDate <= endDate) {
          const timeSlots = generateTimeSlots(availableFrom, availableTo);
          dates.push({
            date: currentDate.toDate(),
            timeSlots,
          });
          currentDate = currentDate.add(1, "days");
        }
        return dates;
      }

      // Create a list of new doctors (those without _id)
      const newDoctors = doctors.filter((doctor: Doctor) => !doctor._id);

      // Save new doctors and collect their IDs
      const addedDoctorsPromises = newDoctors.map(async (doctor: Doctor) => {
        const availableDates = generateAvailableDates(doctor.dateFrom,doctor.dateEnd,doctor.availableFrom,doctor.availableTo);

        return new DoctorModel({...doctor,department: departmentId,availableDates,}).save();
      });

      const addedDoctors = await Promise.all(addedDoctorsPromises);

      // Collect the IDs of the new doctors
      const newDoctorIds = addedDoctors.map((doctor: any) => doctor._id);

      // Existing doctor IDs for update and removal
      const existingDoctorIds = updatedDepartment.doctors.map((doc: any) =>
        doc.toString()
      );

      // Process existing doctors
      const existingDoctors = doctors.filter((doctor: Doctor) => doctor._id);
      for (const doctor of existingDoctors) {
        // Check if available dates or slots were edited
        const availableDates = generateAvailableDates(doctor.dateFrom,doctor.dateEnd,doctor.availableFrom,doctor.availableTo);

        // Update the doctor with new available dates and time slots
        await DoctorModel.findByIdAndUpdate(
          doctor._id,
          {
            ...doctor, // Update all fields from the provided doctor object
            department: departmentId, // Ensure the department field is updated as well
            availableDates, // Update with newly generated available dates and slots
          },
          { new: true }
        );
      }

      // Collect IDs of doctors to be removed
      const doctorIdsToRemove = existingDoctorIds.filter(
        (id: string) =>
          !doctors.some(
            (doctor: Doctor) => doctor._id && doctor._id.toString() === id
          )
      );

      // IDs of doctors that should stay
      const doctorIdsToStay = existingDoctorIds.filter((id: string) =>
        doctors.some(
          (doctor: Doctor) => doctor._id && doctor._id.toString() === id
        )
      );

      // Remove doctors that are no longer in the list
      await DoctorModel.deleteMany({ _id: { $in: doctorIdsToRemove } }).exec();

      // Update the department's doctors field with new and existing doctor IDs
      const allDoctorIds = [...doctorIdsToStay, ...newDoctorIds];
      await DepartmentModel.findByIdAndUpdate(departmentId, {
        $set: { doctors: allDoctorIds },
      }).exec();

      // Fetch the updated department with populated doctors
      const departmentWithDoctors = await DepartmentModel.findById(departmentId)
        .populate("doctors")
        .exec();

      return {department: departmentWithDoctors,doctors: [...addedDoctors],};
    } catch (error) {
      console.error("Error in editDepartment:", error);
      return null;
    }
  }
}
export default SPRepository;