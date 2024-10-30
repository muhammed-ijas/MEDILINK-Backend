import { httpServer } from "./infrastructure/config/app";
import { connectDB } from "./infrastructure/config/connect-DB";
import { Server as SocketIOServer } from "socket.io";

const PORT = process.env.PORT;

const startServer = async (): Promise<void> => {
  await connectDB();
  const app = httpServer;
  const server = app.listen(PORT, () => {
    console.log(`server running`);
  });
  const io = new SocketIOServer(server, {
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
};

startServer();
