const { Contact } = require("../models/contactModel");
const { Conflict } = require("http-errors");

const getContacts = async (owner, { skip, limit, favorite }) => {
  const contacts = await Contact.find({ owner, favorite })
    .select({ _v: 0 })
    .skip(skip)
    .limit(limit);

  return contacts;
};

const getContactById = async (owner, contactId) => {
  const contact = await Contact.findOne({ _id: contactId, owner });
  return contact;
};

const removeContact = async (owner, contactId) => {
  const contact = await Contact.findOneAndRemove({ _id: contactId, owner });
  if (contact.deletedCount === 0) {
    return null;
  }

  return contact;
};

const addContact = async (body, owner) => {
  const existingContact = await Contact.findOne({ email: body.email, owner });
  if (existingContact) {
    throw new Conflict(`Contact with such email already exists`);
  }

  const contact = new Contact({ ...body, owner });
  await contact.save();
  // const contact = await Contact.create({ ...body, owner });
  return contact;
};

const updateContact = async (owner, contactId, body) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    body,
    {
      new: true,
    }
  );

  return contact;
};

const updateStatusContact = async (owner, contactId, status) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    { favorite: status },
    { new: true }
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
