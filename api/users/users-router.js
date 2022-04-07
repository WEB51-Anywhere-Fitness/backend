// npm express import and router declaration from it
const router = require("express").Router();

// users-model function import object
const User = require("../users/users-model.js");

// secret for json web token use
const { JWT_SECRET } = require("../secrets");

// bcryptjs import for use in password hashing
const bcrypt = require("bcryptjs");

// jwt import, for sessions
const jwt = require("jsonwebtoken");

// auth middleware imports to keep it DRY
const {
  restricted,
  only,
  checkUsernameFree,
  checkUsernameExists,
  validateRoleName,
} = require("../auth/auth-middleware");

// jwt generation function hoisted to be accessible whenever needed
function generateToken(user) {
  const payload = {
    subject: user.user_id,
    username: user.username,
    role_name: user.role,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

// registration endpoint, hashes password
router.post(
  "/register",
  validateRoleName,
  checkUsernameFree,
  (req, res, next) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    User.add(user)
      .then((newUser) => {
        res.status(201).json({
          user_id: newUser.user_id,
          username: newUser.username,
          role_name: newUser.role_name.trim(),
        });
      })
      .catch(next);
  }
);

// login endpoint, issues JWT in response that a frontend would have to add to local storage and use in auth headers
router.post("/login", checkUsernameExists, (req, res, next) => {
  let { username, password } = req.body;

  User.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
      } else {
        next({ status: 401, message: "Invalid Login Credentials" });
      }
    })
    .catch(next);
});

// get all users, only instructor can do it but it would be better in a real application for an admin role- restricted
router.get("/", restricted, only("instructor"), (req, res, next) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

// get user by id, restricted to instructor
router.get("/:user_id", restricted, only("instructor"), (req, res, next) => {
  User.findById(req.params.user_id)
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

// router export
module.exports = router;
