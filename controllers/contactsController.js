const {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../services/contactsService");

const getContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  let { page = 1, limit = 20, favorite = [true, false] } = req.query;

  page = parseInt(page);
  limit = parseInt(limit) > 20 ? 20 : parseInt(limit);
  const skip = (page - 1) * limit;

  const contacts = await getContacts(userId, { skip, limit, favorite });
  res.status(200).json(contacts);
};

const getContactByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const contact = await getContactById(userId, contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(contact);
};

const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { body } = req;
  const newContact = await addContact(body, userId);
  res.status(201).json(newContact);
};

const deleteContactByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const contact = await removeContact(userId, contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({ message: "contact deleted" });
};

const changeContactByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const { body } = req;
  const { name, email, phone } = body;

  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }

  const updContact = await updateContact(userId, contactId, body);
  if (!updContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updContact);
};

const updateStatusController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const { favorite } = req.body;
  if (!favorite) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  const updStatusContact = await updateStatusContact(
    userId,
    contactId,
    favorite
  );
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
