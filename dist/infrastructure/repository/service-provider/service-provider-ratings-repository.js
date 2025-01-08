"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_provider_model_1 = __importDefault(require("../../database/service-provider-model"));
const mongoose_1 = __importDefault(require("mongoose"));
class SPRepository {
    findRatingsOfSPById(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Aggregate pipeline to get ratings along with doctor and user details
                const result = yield service_provider_model_1.default.aggregate([
                    // Match the service provider by id
                    { $match: { _id: new mongoose_1.default.Types.ObjectId(spId) } },
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
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = SPRepository;
