import DoctorModel from '../database/doctorsModel';

class DoctorRepository {
  async findPaginated(page: number, limit: number) {
    try {
      return await DoctorModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('department');
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      return await DoctorModel.countDocuments();
    } catch (error) {
      throw error;
    }
  }
}

export default DoctorRepository;
