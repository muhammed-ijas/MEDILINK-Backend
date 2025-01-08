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
Object.defineProperty(exports, "__esModule", { value: true });
class SPUseCase {
    constructor(SPProfileRepository, SPRegistrationRepository) {
        this.SPProfileRepository = SPProfileRepository;
        this.SPRegistrationRepository = SPRegistrationRepository;
    }
    getProfile(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this.SPRegistrationRepository.findById(Id);
            let data = {
                _id: profile === null || profile === void 0 ? void 0 : profile._id,
                name: profile === null || profile === void 0 ? void 0 : profile.name,
                email: profile === null || profile === void 0 ? void 0 : profile.email,
                phone: profile === null || profile === void 0 ? void 0 : profile.phone,
                isBlocked: profile === null || profile === void 0 ? void 0 : profile.isBlocked,
                area: profile === null || profile === void 0 ? void 0 : profile.area,
                city: profile === null || profile === void 0 ? void 0 : profile.city,
                state: profile === null || profile === void 0 ? void 0 : profile.state,
                pincode: profile === null || profile === void 0 ? void 0 : profile.pincode,
                district: profile === null || profile === void 0 ? void 0 : profile.district,
                latitude: profile === null || profile === void 0 ? void 0 : profile.latitude,
                longitude: profile === null || profile === void 0 ? void 0 : profile.longitude,
                isVerified: profile === null || profile === void 0 ? void 0 : profile.isVerified,
                closingTime: profile === null || profile === void 0 ? void 0 : profile.closingTime,
                openingTime: profile === null || profile === void 0 ? void 0 : profile.openingTime,
                profileImage: profile === null || profile === void 0 ? void 0 : profile.profileImage,
                serviceType: profile === null || profile === void 0 ? void 0 : profile.serviceType,
                firstDocumentImage: profile === null || profile === void 0 ? void 0 : profile.firstDocumentImage,
                secondDocumentImage: profile === null || profile === void 0 ? void 0 : profile.secondDocumentImage,
                departments: profile === null || profile === void 0 ? void 0 : profile.departments,
            };
            return { status: 200, data: data, };
        });
    }
    editProfile(Id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this.SPProfileRepository.editProfile(Id, data);
            if (profile) {
                const data = yield this.SPRegistrationRepository.findById(Id);
                const profileData = {
                    _id: data === null || data === void 0 ? void 0 : data._id,
                    name: data === null || data === void 0 ? void 0 : data.name,
                    email: data === null || data === void 0 ? void 0 : data.email,
                    phone: data === null || data === void 0 ? void 0 : data.phone,
                    isBlocked: data === null || data === void 0 ? void 0 : data.isBlocked,
                    area: data === null || data === void 0 ? void 0 : data.area,
                    city: data === null || data === void 0 ? void 0 : data.city,
                    state: data === null || data === void 0 ? void 0 : data.state,
                    pincode: data === null || data === void 0 ? void 0 : data.pincode,
                    district: data === null || data === void 0 ? void 0 : data.district,
                    latitude: data === null || data === void 0 ? void 0 : data.latitude,
                    longitude: data === null || data === void 0 ? void 0 : data.longitude,
                    isVerified: data === null || data === void 0 ? void 0 : data.isVerified,
                    serviceType: data === null || data === void 0 ? void 0 : data.serviceType,
                    closingTime: data === null || data === void 0 ? void 0 : data.closingTime,
                    openingTime: data === null || data === void 0 ? void 0 : data.openingTime,
                    profileImage: data === null || data === void 0 ? void 0 : data.profileImage,
                    firstDocumentImage: data === null || data === void 0 ? void 0 : data.firstDocumentImage,
                    secondDocumentImage: data === null || data === void 0 ? void 0 : data.secondDocumentImage,
                };
                return { status: 200, data: { message: "Profile updated successfully", user: profileData, }, };
            }
            else {
                return { status: 400, message: "Failed to update the data Please try again", };
            }
        });
    }
    updateImage(Id, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.SPProfileRepository.changeProfileImage(Id, imageUrl);
            if (result) {
                return { status: 200, message: "Password changed successfully", };
            }
            else {
                return { status: 400, message: "Failed please try again !", };
            }
        });
    }
    changeFirstDocumentImage(Id, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.SPProfileRepository.changeFirstDocumentImage(Id, imageUrl);
            if (result) {
                return { status: 200, message: "Password changed successfully", };
            }
            else {
                return { status: 400, message: "Failed please try again !", };
            }
        });
    }
    changeSecondDocumentImage(Id, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.SPProfileRepository.changeSecondDocumentImage(Id, imageUrl);
            if (result) {
                return { status: 200, message: "Password changed successfully", };
            }
            else {
                return { status: 400, message: "Failed please try again !", };
            }
        });
    }
    getRatingsAndReviews(spId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ratings = yield this.SPProfileRepository.findRatingsOfSPById(spId);
                return ratings;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = SPUseCase;
