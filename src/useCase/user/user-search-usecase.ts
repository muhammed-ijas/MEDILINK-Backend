import DepartmentRepository from "../../infrastructure/repository/department-repository";
import DoctorRepository from "../../infrastructure/repository/doctor-repository";
import SPRepository from "../../infrastructure/repository/service-provider/service-provider-repository";
import SPSearchRepository from "../../infrastructure/repository/service-provider/service-provider-search-repository";

class UserSearchUsecase {
  private DepartmentRepository: DepartmentRepository;
  private DoctorRepository: DoctorRepository;
  private SPRepository: SPRepository;
  private SPSearchRepository: SPSearchRepository;

  constructor(
    DepartmentRepository: DepartmentRepository,
    DoctorRepository: DoctorRepository,
    SPRepository: SPRepository,
    SPSearchRepository: SPSearchRepository,
  ) {
    this.DepartmentRepository = DepartmentRepository;
    this.DoctorRepository = DoctorRepository;
    this.SPRepository = SPRepository;
    this.SPSearchRepository = SPSearchRepository;
  }


  async getDepartments(page: number, limit: number, search: string) {
    try {
      const departments = await this.DepartmentRepository.findPaginated(
        page,
        limit,
        search
      );
      const totalDepartments = await this.DepartmentRepository.count(search);
      const totalPages = Math.ceil(totalDepartments / limit);

      return {
        items: departments,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getDoctors(page: number, limit: number, search: string) {
    try {
      const doctors = await this.DoctorRepository.findPaginated(
        page,
        limit,
        search
      );
      const totalDoctors = await this.DoctorRepository.count(search);
      const totalPages = Math.ceil(totalDoctors / limit);

      return {
        items: doctors,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getHospitals(page: number, limit: number, search: string) {
    try {
      const hospitals = await this.SPSearchRepository.findPaginatedHospitals(
        page,
        limit,
        search
      );
      const totalHospitals = await this.SPSearchRepository.countHospitals(search);
      const totalPages = Math.ceil(totalHospitals / limit);
      
      return {
        items: hospitals,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getClinicks(page: number, limit: number, search: string) {
    try {
      const clinicks = await this.SPSearchRepository.findPaginatedClinicks(
        page,
        limit,
        search
      );
      const totalClinicks = await this.SPSearchRepository.countClinicks(search);
      const totalPages = Math.ceil(totalClinicks / limit);

      return {
        items: clinicks,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAmbulances(page: number, limit: number, search: string) {
    try {
      const ambulances = await this.SPSearchRepository.findPaginatedAmbulances(
        page,
        limit,
        search
      );
      const totalAmbulances = await this.SPSearchRepository.countAmbulances(search);
      const totalPages = Math.ceil(totalAmbulances / limit);

      return {
        items: ambulances,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getHomeNurses(page: number, limit: number, search: string) {
    try {
      const homeNurses = await this.SPSearchRepository.findPaginatedHomeNurses(
        page,
        limit,
        search
      );
      const totalHomeNurses = await this.SPSearchRepository.countHomeNurses(search);
      const totalPages = Math.ceil(totalHomeNurses / limit);

      return {
        items: homeNurses,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async getHospitalClinicDetails(id: string) {
    try {
      const hospitalDetails = await this.SPRepository.findHospitalClinicById(
        id
      );

      if (!hospitalDetails) {
        throw new Error("Hospital/Clinic not found");
      }

      return hospitalDetails;
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentDetails(id: string) {
    try {
      const departmentDetails = await this.SPRepository.findDepartmentById(id);

      if (!departmentDetails) {
        throw new Error("Ddepartment not found");
      }

      return departmentDetails;
    } catch (error) {
      throw error;
    }
  }

  async getDoctorDetails(id: string) {
    try {
      const doctorDetails = await this.DoctorRepository.findDoctorById(id);

      if (!doctorDetails) {
        throw new Error("Doctor not found");
      }

      return doctorDetails;
    } catch (error) {
      throw error;
    }
  }

  async getDoctorDetailsFromSearchPage(id: string) {
    try {
      const doctorDetails =
        await this.SPRepository.getDoctorDetailsFromSearchPage(id);

      if (!doctorDetails) {
        throw new Error("Doctor not found");
      }

      return doctorDetails;
    } catch (error) {
      throw error;
    }
  }

  async getHomeNurseDetails(id: string) {
    try {
      const homeNurseDetails = await this.SPRepository.findHomeNurseById(id);

      if (!homeNurseDetails) {
        throw new Error("Ddepartment not found");
      }

      return homeNurseDetails;
    } catch (error) {
      throw error;
    }
  }

  async getAmbulanceDetails(id: string) {
    try {
      const ambulanceDetails = await this.SPRepository.findAmbulanceById(id);

      if (!ambulanceDetails) {
        throw new Error("Ddepartment not found");
      }

      return ambulanceDetails;
    } catch (error) {
      throw error;
    }
  }

}

export default UserSearchUsecase;
