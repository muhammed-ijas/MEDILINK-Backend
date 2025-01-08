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
const app_1 = require("./infrastructure/config/app");
const connect_DB_1 = require("./infrastructure/config/connect-DB");
const socket_io_1 = require("socket.io");
const PORT = process.env.PORT;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connect_DB_1.connectDB)();
    const app = app_1.httpServer;
    const server = app.listen(PORT, () => {
        console.log(`server running`);
    });
    const io = new socket_io_1.Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: process.env.CORS_URL,
        },
    });
    io.on("connection", (socket) => {
        socket.on("setup", (userData) => {
            socket.join(userData._id);
        });
        socket.on("newmessage", (newMessageRecieved) => {
            var chat = newMessageRecieved;
            socket.in(chat.receiverId).emit("messageRecieved", chat.message);
        });
    });
});
startServer();
