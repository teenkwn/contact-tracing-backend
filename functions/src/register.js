const firestore = require('./utils/Firestore')

const peopleCollection = 'people'

exports.register = async (req, res, next) => {
  const data = {
    phone: req.body.phone,
    deviceId: req.body.deviceId,
  }

  try {
    const existsDoc = await firestore.db.collection(peopleCollection).doc(data.deviceId).get()
    if (existsDoc.exists) {
      throw Error(`${data.deviceId} is already exists`)
    }

    await firestore.db.collection(peopleCollection).doc(data.deviceId).set(data)
    return res.send(data.deviceId)
  } catch (e) {
    throw e
  }
}
