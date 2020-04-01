const nodemailer = require('nodemailer')
const admin = require('firebase-admin')

exports.sendJoinUs = async (data) => {
  const docRef = await admin.firestore().collection('settings').doc('emailSetting').get()
  const emailSetting = docRef.data()
  const emailBody = JSON.stringify(data)
  const mailOptions = {
    from: emailSetting.fromEmail,
    to: emailSetting.toEmail,
    subject: `Join us: from ${data.name}`,
    html: emailBody,
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailSetting.fromEmail,
      pass: emailSetting.fromPassword,
    },
  })

  await transport.sendMail(mailOptions)
}

exports.sendContactUs = async (data) => {
  const docRef = await admin.firestore().collection('settings').doc('emailSetting').get()
  const emailSetting = docRef.data()
  const emailBody = JSON.stringify(data)
  const mailOptions = {
    from: emailSetting.fromEmail,
    to: emailSetting.toEmail,
    subject: `Contact us: from ${data.name}`,
    html: emailBody,
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailSetting.fromEmail,
      pass: emailSetting.fromPassword,
    },
  })

  await transport.sendMail(mailOptions)
}

