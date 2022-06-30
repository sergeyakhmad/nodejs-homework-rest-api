const {
  registration,
  login,
  logout,
  updateSubscription,
} = require("../services/usersService");

const registrationController = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await registration(email, password);
  res
    .status(201)
    .json({ user: { email: user.email, subscription: user.subscription } });
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

module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
  updateSubscriptionUserController,
};
