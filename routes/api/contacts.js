const express = require("express");

const {
  getContactsController,
  getContactByIdController,
  addContactController,
  deleteContactByIdController,
  changeContactByIdController,
} = require("../../controllers/contactsController");
const { catchErrors } = require("../../middlewares/catch-errors");
const { addContactValidation, putContactValidation } = require("./validation");

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

module.exports = router;
