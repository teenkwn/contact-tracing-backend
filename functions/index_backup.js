const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')
const app = require('express')()
const bodyParser = require('body-parser')
const Busboy = require('busboy')
const uuid = require('uuidv4')

const mailerService = require('./mailerService')

app.use(bodyParser.json())
app.use(cors())

admin.initializeApp()

const uploadToStorage = (data) => {
  if (!data) {
    return "No file";
  }
  const bucket = admin.storage().bucket('scb10x-web.appspot.com');
  const fileName = `${Date.now()}_${data.fileName.replace(/\s/g, '-')}`
  const objectName = fileName.replace(/\//g, '%2F')
  const fileUpload = bucket.file(fileName)

  const accessToken = uuid.uuid()
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: data.mimeType,
      metadata: { firebaseStorageDownloadTokens: accessToken }
    }
  })
  blobStream.end(data.data);
  return `https://firebasestorage.googleapis.com/v0/b/scb10x-web.appspot.com/o/${objectName}?alt=media&token=${accessToken}`
}

app.post('/uploadcv', (req, res) => {
  const busboy = new Busboy({ headers: req.headers })
  let filePath = null;

  busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
    file.on('data', (data) => {
      data = {
        data,
        fieldName,
        fileName,
        encoding,
        mimeType,
      }
      filePath = uploadToStorage(data)
    })
  })
  busboy.on('finish', () => {
    res.send(filePath)
  })
  busboy.end(req.rawBody)
})

app.post('/join', async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    cvUrl: req.body.cvUrl,
    message: req.body.message,
  }

  await admin.firestore().collection('candidates').add(data)
  await mailerService.sendJoinUs(data)

  res.send('ok')
})

app.post('/question', async (req, res) => {
  console.log(req.body);
  const data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    message: req.body.message,
  }

  await admin.firestore().collection('questions').add(data)
  await mailerService.sendContactUs(data)

  res.send('ok')
})

exports.api = functions.region('asia-northeast1').https.onRequest(app)
