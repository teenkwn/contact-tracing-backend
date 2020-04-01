const firestore = require('./utils/Firestore')

const peopleCollection = 'people'
const contactCollection = 'contact'

exports.addContact = async (req, res, next) => {
  const data = {
    deviceId: req.body.deviceId,
    contactId: req.body.contactId,
    timestamp: firestore.serverTimestamp(),
  }

  try {
    await firestore.db.collection(peopleCollection).doc(data.deviceId)
      .collection(contactCollection).doc(data.contactId).set(data)
    
    return res.send(data.deviceId)
  } catch (e) {
    throw e
  }
}

exports.getMyContacts = async (req, res, next) => {
  const deviceId = req.params.deviceId
  const contacts = []

  try {
    const snapshot = await firestore.db
      .collection(peopleCollection).doc(deviceId)
      .collection(contactCollection).orderBy("timestamp").get()
    snapshot.forEach(doc => {
      contacts.push({ deviceId: doc.id, ...doc.data() })
    })
    
    return res.send(contacts)
  } catch (e) {
    throw e
  }
}