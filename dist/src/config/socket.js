"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);
        // Join a room
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
            console.log(`Client ${socket.id} joined room ${roomId}`);
        });
        // Leave a room
        socket.on("leave_room", (roomId) => {
            socket.leave(roomId);
            console.log(`Client ${socket.id} left room ${roomId}`);
        });
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
// Use this to emit events from anywhere in your app
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
exports.getIO = getIO;
