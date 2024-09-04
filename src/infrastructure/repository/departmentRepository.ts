import DepartmentModel from '../database/departmentModel';

class DepartmentRepository {
  // async findPaginated(page: number, limit: number) {
  //   try {
  //     return await DepartmentModel.find()
  //       .skip((page - 1) * limit)
  //       .limit(limit)
  //       .populate('serviceProvider');
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async count() {
  //   try {
  //     return await DepartmentModel.countDocuments();
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async findPaginated(page: number, limit: number, search: string) {
    try {
      return await DepartmentModel.find({
        name: new RegExp(search, 'i') // Case-insensitive search
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('serviceProvider');
    } catch (error) {
      throw error;
    }
  }

  async count(search: string) {
    try {
      return await DepartmentModel.countDocuments({
        name: new RegExp(search, 'i')
      });
    } catch (error) {
      throw error;
    }
  }
}

export default DepartmentRepository;
