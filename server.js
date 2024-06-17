const express = require("express");
const Socket = require("socket.io");

const app = express();

const server = require("http").createServer(app);

const io = Socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let PORT = 5000;

server.listen(PORT, () => {
  console.log("Listening on PORT: ", 5000);
});

const users = [];

io.on("connection", (socket) => {
  console.log("Connected to ", socket.id);

  socket.on("addUser", (username) => {
    socket.user = username;
    users.push(username);
    io.sockets.emit("users", users);
  });

  socket.on("message", (message) => {
    io.sockets.emit("message_client", {
      message,
      user: socket.user,
    });
  });

  socket.on("disconnect", () => {
    console.log("We are disconnecting: ", socket.user);

    if (socket.user) {
      users.splice(users.indexOf(socket.user), 1);

      io.sockets.emit("users", users);
      console.log("remaining users: ", users);
    }
  });
});
