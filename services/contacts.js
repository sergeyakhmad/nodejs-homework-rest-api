const { Contact } = require("../models/contactModel");
const { Conflict } = require("http-errors");

const getContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

const removeContact = async (contactId) => {
  const contact = await Contact.deleteOne({ _id: contactId });

  if (contact.deletedCount === 0) {
    return null;
  }

  return contact;
};

const addContact = async (body) => {
  const existingContact = await Contact.findOne({ email: body.email });
  if (existingContact) {
    throw new Conflict(`Contact with such email already exists`);
  }

  const contact = await Contact.create(body);
  return contact;
};

const updateContact = async (contactId, body) => {
  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  return contact;
};

const updateStatusContact = async (contactId, status) => {
  const contact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite: status },
    {
      new: true,
    }
  );

  return contact;
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
