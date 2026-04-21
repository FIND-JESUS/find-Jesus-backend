"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("./generated/prisma/client"); // adjust path if needed
const globalForPrisma = globalThis;
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
exports.prisma = globalForPrisma.prisma || new client_1.PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
