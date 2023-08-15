const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const events = require("events");
// const { listenerCount } = require("process");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let likes = 0;

eventEmitter = new events.EventEmitter();

setInterval(() => {
  likes++;
  eventEmitter.emit("newdata");
}, 2000);
io.on("connection", (socket) => {
  console.log(`User Connected : ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("recieve_message", data);
  });

  socket.emit("likeupdate", likes);
  socket.on("liked", () => {
    likes++;
    socket.emit("likeupdate", likes);
    socket.broadcast.emit("likeupdate", likes);
  });

  eventEmitter.on("newData", () => {
    socket.broadcast.emit("likeupdate", likes);
  });
});

server.listen(3001, () => {
  console.log(`Server Running   on port ${3001}`);
});
