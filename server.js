const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

// chat box
io.on("connection", (socket) => {
  socket.emit("your id", socket.id);

  socket.on("send message", (body) => {
    io.emit("message", body);
  });

  socket.on("send id", (userID) => {
    io.emit("userid", userID);
  });
  socket.on("send Form", (userForm) => {
    io.emit("userFormInfo", userForm);
  });
});

app.get("/", (req, res, next) => {
  res.send("Hello world")
})

server.listen(3000, (port) => console.log("server is running on port 8000"));
