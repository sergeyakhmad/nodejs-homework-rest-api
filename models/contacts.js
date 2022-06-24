const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, "UTF8");
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => id === contactId);
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contact = await getContactById(contactId);
  const newContacts = contacts.filter(({ id }) => id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(newContacts));
  return contact;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { ...body, id: nanoid() };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);
  if (idx === -1) {
    return null;
  }
  contacts[idx] = { ...contacts[idx], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contacts[idx];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
