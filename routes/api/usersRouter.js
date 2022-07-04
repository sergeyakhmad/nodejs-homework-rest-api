const express = require("express");

const {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
  updateSubscriptionUserController,
  updateAvatarUserController,
} = require("../../controllers/usersController");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { catchErrors } = require("../../middlewares/catch-errors");
const { userValidation } = require("../../middlewares/validation");
const { uploadMiddleware } = require("../../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/signup", userValidation, catchErrors(registrationController));
router.post("/login", userValidation, catchErrors(loginController));
router.get("/logout", authMiddleware, catchErrors(logoutController));
router.get("/current", authMiddleware, catchErrors(currentUserController));
router.patch(
  "/",
  authMiddleware,
  catchErrors(updateSubscriptionUserController)
);
router.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  catchErrors(updateAvatarUserController)
);

module.exports = router;
