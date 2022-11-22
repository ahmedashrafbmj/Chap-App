const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

// chat box
io.on("connection", (socket) => {
  socket.emit("your id", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send message", (body) => {
    io.emit("message", body);
  });

  socket.on("send id", (userID) => {
    io.emit("userid", userID);
  });
  socket.on("send Form", (userForm) => {
    io.emit("userFormInfo", userForm);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.get("/", (req, res, next) => {
  res.send("Hello world")
})

server.listen(process.env.PORT || 8000, (port) => console.log("server is running on port 8000"));
