const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const { Conflict, Unauthorized, NotFound, BadRequest } = require("http-errors");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const registration = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict("Email in use");
  }

  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "404" });
  const verificationToken = nanoid();
  const newUser = new User({ email, password, avatarURL, verificationToken });
  await newUser.save();

  const msg = {
    to: email,
    from: "sergan86@ukr.net",
    subject: "Thank you for registration!",
    text: `Please, <a href="http://localhost:3000/api/users/verify/${verificationToken}">confirm</a> your email address`,
    html: `Please, <a href="http://localhost:3000/api/users/verify/${verificationToken}">confirm</a> your email address`,
  };
  await sgMail.send(msg);

  return newUser;
};

const verification = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw new NotFound("User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  const msg = {
    to: user.email,
    from: "sergan86@ukr.net",
    subject: "Thank you for registration!",
    text: "Your email has been successfully verified. Thank you for registration.",
    html: "<h1>Your email has been successfully verified. Thank you for registration.</h1>",
  };
  await sgMail.send(msg);
};

const verify = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Unauthorized("Not authorized");
  }

  if (!user.verificationToken) {
    throw new BadRequest("Verification has already been passed");
  }

  const msg = {
    to: email,
    from: "sergan86@ukr.net",
    subject: "Thank you for registration!",
    text: `Please, <a href="/users/verify/${user.verificationToken}">confirm</a> your email address`,
    html: `Please, <a href="/users/verify/${user.verificationToken}">confirm</a> your email address`,
  };

  await sgMail.send(msg);
};

const login = async (email, password) => {
  const user = await User.findOne({ email, verify: true });

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
  verification,
  verify,
};
