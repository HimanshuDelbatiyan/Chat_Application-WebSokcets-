"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const PORT = process.env.port || 3000;
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
const server = app.listen(PORT, () => {
    console.log(`Chat Server Listening on port ${PORT}`);
});
const io = new socket_io_1.Server(server);
let socketsConnected = new Set();
io.on("connection", function (socket) {
    console.log(socket.id + " is connected");
    socketsConnected.add(socket.id);
    io.emit("clients-total", socketsConnected.size);
    socket.on("message", (data) => {
        console.log(data);
        socket.broadcast.emit("chat-message", data);
    });
    socket.on("feedback", (data) => {
        socket.broadcast.emit("feedback", data);
    });
    socket.on("disconnect", () => {
        socketsConnected.delete(socket.id);
        console.log(`${socket.id} is Disconnected`);
        io.emit("clients-total", socketsConnected.size);
    });
});
//# sourceMappingURL=app.js.map