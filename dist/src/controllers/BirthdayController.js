"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.BirthdayController = void 0;
const tsoa_1 = require("tsoa");
const db_1 = require("../../db");
const email_1 = require("../services/email"); // make sure this exists
let BirthdayController = class BirthdayController extends tsoa_1.Controller {
    // 🎯 Submit Birthday
    submitBirthday(birthdayData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const submitBirthday = yield db_1.prisma.user.create({
                data: {
                    firstName: birthdayData.firstName,
                    lastName: birthdayData.lastName,
                    email: birthdayData.email,
                    dateOfBirth: new Date(birthdayData.dateOfBirth),
                    consent: (_a = birthdayData.consent) !== null && _a !== void 0 ? _a : false,
                },
            });
            return {
                message: "Birthday data submitted successfully",
                data: submitBirthday,
            };
        });
    }
    // 📅 Get Upcoming Birthdays (Next 7 Days)
    getBirthday() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const next7Days = new Date();
            next7Days.setDate(today.getDate() + 7);
            const users = yield db_1.prisma.user.findMany({
                where: { consent: true },
            });
            const upcoming = users.filter((user) => {
                const dob = new Date(user.dateOfBirth);
                const thisYearBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
                return thisYearBirthday >= today && thisYearBirthday <= next7Days;
            });
            return {
                count: upcoming.length,
                data: upcoming,
            };
        });
    }
    // 🎉 Manual Admin Notification Trigger (for testing or cron)
    postMessage(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
                this.setStatus(401);
                return { error: "Unauthorized" };
            }
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            const users = yield db_1.prisma.user.findMany({
                where: { consent: true },
            });
            const upcoming = users.filter((user) => {
                const dob = new Date(user.dateOfBirth);
                return (dob.getDate() === tomorrow.getDate() &&
                    dob.getMonth() === tomorrow.getMonth());
            });
            if (upcoming.length === 0) {
                return { message: "No birthdays tomorrow" };
            }
            yield (0, email_1.sendAdminNotification)(upcoming);
            return {
                message: "Admin notified successfully",
                count: upcoming.length,
                users: upcoming,
            };
        });
    }
};
exports.BirthdayController = BirthdayController;
__decorate([
    (0, tsoa_1.Post)("/submit-birthday"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BirthdayController.prototype, "submitBirthday", null);
__decorate([
    (0, tsoa_1.Get)("/get-birthday"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BirthdayController.prototype, "getBirthday", null);
__decorate([
    (0, tsoa_1.Post)("/post-message-to-birthday"),
    __param(0, (0, tsoa_1.Header)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BirthdayController.prototype, "postMessage", null);
exports.BirthdayController = BirthdayController = __decorate([
    (0, tsoa_1.Tags)("Birthday APIs"),
    (0, tsoa_1.Route)("birthday")
], BirthdayController);
