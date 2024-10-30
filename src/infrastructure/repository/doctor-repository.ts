import DoctorModel from '../database/doctor-model';

class DoctorRepository {
 
  async findPaginated(page: number, limit: number, search: string) {
    try {
      return await DoctorModel.find({
        name: new RegExp(search, 'i'), // Case-insensitive search
        $or: [
          { isDeleted: { $exists: false } }, // Doctors without the isDeleted field
          { isDeleted: false }               // Doctors with isDeleted set to false
        ]
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('department');
    } catch (error) {
      throw error;
    }
  }
  
  async count(search: string) {
    try {
      return await DoctorModel.countDocuments({
        name: new RegExp(search, 'i'), // Case-insensitive search
        $or: [
          { isDeleted: { $exists: false } }, // Doctors without the isDeleted field
          { isDeleted: false }               // Doctors with isDeleted set to false
        ]
      });
    } catch (error) {
        throw error;
    }
  }
  
  

  async findDoctorById(id: string) {
    try {
      const result = await DoctorModel.findById({_id:id}).populate('department'); 
  
      return result;
    } catch (error) {
      throw error;
    }
  }


}

export default DoctorRepository;