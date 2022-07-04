const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const { Conflict, Unauthorized } = require("http-errors");
const gravatar = require("gravatar");

const registration = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict("Email in use");
  }

  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "404" });
  const newUser = new User({ email, password, avatarURL });
  await newUser.save();

  return newUser;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Unauthorized("Email or password is wrong");
  }

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );

  const updateUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );
  return updateUser;
};

const logout = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Unauthorized("Not authorized");
  }

  return await User.findByIdAndUpdate(id, { token: null });
};

const currentUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Unauthorized("Not authorized");
  }
  return user;
};

const updateSubscription = async (id, subscription) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Unauthorized("Not authorized");
  }
  return await User.findByIdAndUpdate(id, { subscription }, { new: true });
};

const updateAvatar = async (id, avatarURL) => {
  const user = await User.findByIdAndUpdate(id, { avatarURL }, { new: true });
  return user;
};

module.exports = {
  registration,
  login,
  logout,
  currentUser,
  updateSubscription,
  updateAvatar,
};
