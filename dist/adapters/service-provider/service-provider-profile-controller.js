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
class spController {
    constructor(spUseCase) {
        this.spUseCase = spUseCase;
    }
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { Id } = req.body;
                let profile = yield this.spUseCase.getProfile(Id);
                return res.status(profile.status).json(profile.data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { Id, data } = req.body;
                let profile = yield this.spUseCase.editProfile(Id, data);
                if (profile.status == 200) {
                    return res.status(profile.status).json(profile.data);
                }
                return res.status(profile.status).json(profile.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { Id, imageUrl } = req.body;
                let update = yield this.spUseCase.updateImage(Id, imageUrl);
                if (update) {
                    return res.status(update.status).json(update.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    changeFirstDocumentImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { Id, imageUrl } = req.body;
                let update = yield this.spUseCase.changeFirstDocumentImage(Id, imageUrl);
                if (update) {
                    return res.status(update.status).json(update.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    changeSecondDocumentImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { Id, imageUrl } = req.body;
                let update = yield this.spUseCase.changeSecondDocumentImage(Id, imageUrl);
                if (update) {
                    return res.status(update.status).json(update.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    getRatingsAndReviews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.spUseCase.getRatingsAndReviews(id);
                return res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = spController;
