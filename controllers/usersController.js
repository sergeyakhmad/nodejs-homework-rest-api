const fs = require("fs").promises;
const path = require("path");
const getResizeAvatar = require("../middlewares/resizeAvatar");

const {
  registration,
  login,
  logout,
  updateSubscription,
  updateAvatar,
  verification,
  verify,
} = require("../services/usersService");

const FILE_DIR = path.resolve("./public/avatars");

const registrationController = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await registration(email, password);
  res
    .status(201)
    .json({ user: { email: user.email, subscription: user.subscription } });
};

const verificationController = async (req, res, next) => {
  const { verificationToken } = req.params;

  await verification(verificationToken);
  res.status(200).json({ message: "Verification successful" });
};

const verifyController = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "missing required field email" });
  }

  await verify(email);
  res.status(200).json({ message: "Verification email sent" });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await login(email, password);
  res.status(200).json({
    token: user.token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const logoutController = async (req, res) => {
  const { _id } = req.user;
  await logout(_id);
  res.status(204).json();
};

const currentUserController = async (req, res) => {
  const user = req.user;
  res.status(200).json({ email: user.email, subscription: user.subscription });
};

const updateSubscriptionUserController = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const typeSubscription = ["starter", "pro", "business"];
  if (!typeSubscription.includes(subscription)) {
    res.status(400).json({ message: "invalid subscription type" });
  }
  const user = await updateSubscription(_id, subscription);
  res.status(200).json(user);
};

const updateAvatarUserController = async (req, res, next) => {
  const { _id } = req.user;
  const { path: temporaryName, originalname } = req.file;
  await getResizeAvatar(temporaryName);
  const [, extension] = originalname.split(".");
  const fileName = `${_id}_avatar.${extension}`;
  try {
    const resultUpload = path.join(FILE_DIR, fileName);
    await fs.rename(temporaryName, resultUpload);
    const avatarURL = path.join("avatars", fileName);
    const user = await updateAvatar(_id, avatarURL);
    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    await fs.unlink(temporaryName);
    return next(error);
  }

  res.status(200);
};

module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
  updateSubscriptionUserController,
  updateAvatarUserController,
  verificationController,
  verifyController,
};
