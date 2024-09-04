import DoctorModel from '../database/doctorsModel';

class DoctorRepository {
  // async findPaginated(page: number, limit: number) {
  //   try {
  //     return await DoctorModel.find()
  //       .skip((page - 1) * limit)
  //       .limit(limit)
  //       .populate('department');
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async count() {
  //   try {
  //     return await DoctorModel.countDocuments();
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  async findPaginated(page: number, limit: number, search: string) {
    try {
      return await DoctorModel.find({
        name: new RegExp(search, 'i') // Case-insensitive search
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
        name: new RegExp(search, 'i')
      });
    } catch (error) {
      throw error;
    }
  }
}

export default DoctorRepository;
