const express = require("express");

const classRouter = require("./class/class-router");
const usersRouter = require("./users/users-router");
const server = express();

server.use(express.json());

server.use("/api/class", classRouter);
server.use("/api/auth", usersRouter);

server.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
