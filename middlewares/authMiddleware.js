const jwt = require("jsonwebtoken");
const { Unauthorized } = require("http-errors");
const { User } = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [, token] = authorization.split(" ");

    if (!token) {
      next(new Unauthorized("Not authorized"));
    }

    const { _id } = jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findById({ _id });

    if (user.token !== token) {
      next(new Unauthorized("Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new Unauthorized("Not authorized"));
  }
};

module.exports = { authMiddleware };
