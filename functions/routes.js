const register = require('./src/register')
const contact = require('./src/contact')

module.exports = [
  {
    path: '/register',
    method: 'post',
    controller: register.register,
    auth: false,
  },
  {
    path: '/addcontact',
    method: 'post',
    controller: contact.addContact,
    auth: false,
  },
  {
    path: '/:deviceId/contacts',
    method: 'get',
    controller: contact.getMyContacts,
    auth: false,
  },
]