const {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../services/contacts");

const getContactsController = async (req, res, next) => {
  const contacts = await getContacts();
  res.status(200).json(contacts);
};

const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(contact);
};

const addContactController = async (req, res, next) => {
  const { body } = req;
  const newContact = await addContact(body);
  res.status(201).json(newContact);
};

const deleteContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await removeContact(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({ message: "contact deleted" });
};

const changeContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  const { name, email, phone } = body;

  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }

  const updContact = await updateContact(contactId, body);
  if (!updContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updContact);
};

const updateStatusController = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  if (!favorite) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  const updStatusContact = await updateStatusContact(contactId, favorite);
  if (!updStatusContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updStatusContact);
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  deleteContactByIdController,
  changeContactByIdController,
  updateStatusController,
};
