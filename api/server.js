// express import
const express = require("express");

// router imports
const classRouter = require("./class/class-router");
const usersRouter = require("./users/users-router");

// server declaration
const server = express();

// allows for json to be used for transfer
server.use(express.json());

// router middleware usage
server.use("/api/class", classRouter);
server.use("/api/auth", usersRouter);

// global error handling middleware
server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

// server export
module.exports = server;
