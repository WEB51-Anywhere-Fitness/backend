const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets"); // use this secret!
const User = require("../users/users-model");

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

const only = (role_name) => (req, res, next) => {
  console.log(req.decodedJwt);
  if (req.decodedJwt && req.decodedJwt.role_name === role_name) {
    next();
  } else {
    next({ status: 403, message: "Authorized personnel only" });
  }
};

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

async function checkUsernameFree(req, res, next) {
  let [user] = await User.findBy({ username: req.body.username });
  if (user != null) {
    next({ status: 422, message: "Username taken" });
  } else {
    next();
  }
}

const validateRoleName = (req, res, next) => {
  let user = req.body;
  console.log(user.role_name);
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

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  validateRoleName,
  only,
};
