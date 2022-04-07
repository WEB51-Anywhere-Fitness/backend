// jwt import from npm
const jwt = require("jsonwebtoken");

// secret import for JWT decoding
const { JWT_SECRET } = require("../secrets");

// User model import
const User = require("../users/users-model");

// Middleware that requires user making request to pass a valid JWT in header
const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedJwt) => {
      if (err) {
        next({ status: 401, message: "Token invalid" });
      } else {
        req.decodedJwt = decodedJwt;
        next();
      }
    });
  } else {
    next({ status: 401, message: "Token required" });
  }
};

// Higher order middleware function that restricts access to a specific role, must be called after restricted because it requires an already decoded JWT
const only = (role_name) => (req, res, next) => {
  if (req.decodedJwt && req.decodedJwt.role_name === role_name) {
    next();
  } else {
    next({ status: 403, message: "Authorized personnel only" });
  }
};

// Middleware function to validate that username actually exists
const checkUsernameExists = async (req, res, next) => {
  try {
    let user = await User.findBy({ username: req.body.username });

    if (!user) {
      next({ status: 401, message: "Invalid credentials" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

// Middleware function to validate that username doesn't exist in database
async function checkUsernameFree(req, res, next) {
  let [user] = await User.findBy({ username: req.body.username });
  if (user != null) {
    next({ status: 422, message: "Username taken" });
  } else {
    next();
  }
}

// Simple parsing to make sure the role name is correct, don't want whacky entries in the database
const validateRoleName = (req, res, next) => {
  let user = req.body;
  if (!user.role_name || user.role_name.trim() == "") {
    user.role_name = "client";
  } else if (user.role_name !== "instructor" && user.role_name !== "client") {
    res.status(422).json({
      message: "Invalid role name"
    });
  } else if (user.role_name.trim().length > 32) {
    res.status(422).json({
      message: "Role name can not be longer than 32 characters",
    });
  } else {
    next()
  }
};

// Middleware exports
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  validateRoleName,
  only,
};
