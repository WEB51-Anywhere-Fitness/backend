const express = require("express");

const clientRouter = require("./auth/client-router.js");
const instructorRouter = require("./users/instructor-router.js");

const server = express();

server.use(express.json());

server.use("/api/client", clientRouter);
server.use("/api/instructor", instructorRouter);

server.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
