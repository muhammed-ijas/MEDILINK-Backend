// import {httpServer} from "./infrastructure/config/app"
// import {connectDB} from "./infrastructure/config/connectDB"
// import { Server as SocketIOServer } from 'socket.io';

// const PORT = process.env.PORT

// const startServer = async(): Promise<void> =>{

//     await connectDB()
//     const app = httpServer;

//     const server = httpServer.listen(PORT, () => {
//             console.log(`Server is running on https://127.0.0.1:${PORT}`);
//     });

//     const io = new SocketIOServer(server, {
//         pingTimeout:60000,
//          cors:{
//            origin:process.env.CORS
//          }
//     });

//     io.on("connection",(socket)=>{
//         socket.on('setup',(userData)=>{
//                 socket.join(userData._id)
//                 socket.emit("connected")
//     })

// }

// startServer();

// import dotenv from 'dotenv';
// import express from 'express'; // Import express
// import { createServer } from 'http'; // Import createServer from http
// import { connectDB } from "./infrastructure/config/connectDB";
// import { Server as SocketIOServer } from 'socket.io';
// import cors from 'cors'; // Import CORS

// dotenv.config();

// const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set

// const startServer = async (): Promise<void> => {
//     await connectDB();

//     const app = express(); // Create an Express app instance

//     // Use CORS middleware
//     app.use(cors({
//         origin: process.env.CORS_URL,
//         credentials: true
//     }));

//     // Create HTTP server
//     const server = createServer(app);

//     // Start the server
//     server.listen(PORT, () => {
//         console.log(`Server is running on https://127.0.0.1:${PORT}`);
//     });

//     const io = new SocketIOServer(server, {
//         pingTimeout: 60000,
//         cors: {
//             origin: process.env.CORS_URL,
//             credentials: true
//         }
//     });

//     io.on("connection", (socket) => {

//         socket.on('setup', (userData) => {
//             socket.join(userData._id);
//             socket.emit("connected");
//         });

//         socket.on("newMessage",(response)=>{
//             console.log('response',response);

//         })

//         // Additional event handling can go here
//         // Example: socket.on('join', (room) => { socket.join(room); });
//         // Example: socket.on('newmessage', (message) => { io.to(message.room).emit('message', message); });

//         socket.on("disconnect", () => {
//             console.log(`User disconnected: ${socket.id}`);
//         });
//     });
// };

// startServer().catch(error => {
//     console.error('Error starting the server:', error);
// });

import { httpServer } from "./infrastructure/config/app";
import { connectDB } from "./infrastructure/config/connectDB";
import { Server as SocketIOServer } from "socket.io";

const PORT = process.env.PORT;

const startServer = async (): Promise<void> => {
  await connectDB();
  const app = httpServer;
  const server = httpServer.listen(PORT, () => {
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
      socket.join(userData._id)
    });

    socket.on("newmessage", (newMessageRecieved) => {
      console.log("newMessageRecieved    padaaaa ", newMessageRecieved);
      var chat = newMessageRecieved;
     console.log('chatrecieverid',chat.receiverId);
     
   console.log('chat',chat);
   
 socket.in(chat.receiverId).emit("messageRecieved",chat.message)

     
    });
  });
};

startServer();

// const PORT = process.env.PORT || 3000

// const startServer = async():Promise<void>=>{
//     await connectDB()
//     const app = httpServer;
//     const server = httpServer.listen(PORT, () => {
//         console.log(Server is running on https://127.0.0.1:${PORT});
//       });

//     const io = new SocketIOServer(server, {
//         pingTimeout:60000,
//          cors:{
//            origin:process.env.CORS
//          }
//       });

//       let onlineUsers: Record<string, string> = {};
//       io.on("connection",(socket)=>{
//        socket.on('setup',(userData)=>{
//            socket.join(userData._id)
//            onlineUsers[socket.id] = userData._id;
//            io.emit("userOnline", onlineUsers);
//            socket.emit("connected")
//        })

//        socket.on('joinchat',(room)=>{
//           socket.join(room)
//        })

//        socket.on('newmessage',(newMessageRecieved)=>{

//         var chat = newMessageRecieved.chat;

//            if(!chat.users) return console.log('chat.users not defined');

//            chat.users.forEach((user:any) => {
//             if (user._id == newMessageRecieved.sender._id) return

//             socket.in(user._id).emit("messagerecieved", newMessageRecieved);
//           });

//        })

//        socket.on('deleteMessage',({ messageId,activeChat})=>{
//             activeChat.forEach((user:any)=>{
//               io.in(user._id).emit('messageDeleted',messageId)
//             })

//        })

//        socket.on('videocallInitiated',({roomId,fromUser,toUser,chatId,fromUserName})=>{
//         socket.in(toUser).emit('videoCallNotify',roomId,fromUserName)
//        })

//        socket.on("disconnect", () => {
//         // for (const userId in onlineUsers) {
//         //   if (onlineUsers[userId] === socket.id) {
//         //     delete onlineUsers[userId]; // Remove from the online users list

//         //     // Notify other users that this user is offline
//         //     io.emit("userOffline", userId);
//         //     break;
//           // }
//         // }

//         delete onlineUsers[socket.id]; // Remove user from the online list
//         io.emit('userOnline', onlineUsers);
//       });

//       })

// }

// startServer()
