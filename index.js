const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const { PORT = 5000 } = process.env;

const app = express();
const server = http.createServer(app);
const corsOptions = {
  cors: true,
  origins: ["http://localhost:3000"],
};
const io = socketio(server, corsOptions);

const router = require("./router");

app.use(router);

io.on("connection", (socket) => {
  console.log("We have new connection" + socket.id);

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    // if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    socket.join(user.room);

    // callback();
  });

  socket.on("sendMessage", (message, calllback) => {
    const user = getUser(socket.id);
    const currDate = new Date().toLocaleDateString();
    const currTime = new Date().toLocaleTimeString().slice(0, 5);
    io.to(user.room).emit("message", {
      user: user.name,
      date: currDate + currTime,
      text: message,
    });
    calllback();
  });

  socket.on("disconnect", () => {
    console.log("User had left!");
  });
});

server.listen(PORT, () => console.log(`Server run on PORT ${PORT}`));