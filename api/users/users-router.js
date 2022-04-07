const router = require("express").Router();
const User = require("../users/users-model.js");
const { JWT_SECRET } = require("../secrets");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  restricted,
  only,
  checkUsernameFree,
  checkUsernameExists,
  validateRoleName,
} = require("../auth/auth-middleware");

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

router.post(
  "/register",
  validateRoleName,
  checkUsernameFree,
  (req, res, next) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 8);
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

router.post("/login", checkUsernameExists, (req, res, next) => {
  let { username, password } = req.body;

  User.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        console.log(user);
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

router.get("/", restricted, only("instructor"), (req, res, next) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

router.get("/:user_id", restricted, only("instructor"), (req, res, next) => {
  User.findById(req.params.user_id)
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

module.exports = router;
