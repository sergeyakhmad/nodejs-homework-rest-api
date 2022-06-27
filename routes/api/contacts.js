const express = require("express");

const {
  getContactsController,
  getContactByIdController,
  addContactController,
  deleteContactByIdController,
  changeContactByIdController,
  updateStatusController,
} = require("../../controllers/contactsController");
const { catchErrors } = require("../../middlewares/catch-errors");
const {
  addContactValidation,
  putContactValidation,
} = require("../../middlewares/validation");

const router = express.Router();

router.get("/", catchErrors(getContactsController));
router.get("/:contactId", catchErrors(getContactByIdController));
router.post("/", addContactValidation, catchErrors(addContactController));
router.delete("/:contactId", catchErrors(deleteContactByIdController));
router.put(
  "/:contactId",
  putContactValidation,
  catchErrors(changeContactByIdController)
);
router.patch("/:contactId/favorite", catchErrors(updateStatusController));

module.exports = router;
