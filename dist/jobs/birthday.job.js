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
exports.startBirthdayCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../db"); // adjust path
const email_1 = require("../services/email");
const startBirthdayCron = () => {
    node_cron_1.default.schedule("0 9 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Running birthday check...");
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const users = yield db_1.prisma.user.findMany({
            where: { consent: true }
        });
        const upcoming = users.filter((user) => {
            const dob = new Date(user.dateOfBirth);
            return (dob.getDate() === tomorrow.getDate() &&
                dob.getMonth() === tomorrow.getMonth());
        });
        if (upcoming.length > 0) {
            yield (0, email_1.sendAdminNotification)(upcoming);
        }
    }));
};
exports.startBirthdayCron = startBirthdayCron;
