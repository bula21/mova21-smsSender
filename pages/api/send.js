const nodemailer = require('nodemailer')

const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD =  process.env.SMTP_PASSWORD
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT

const SMS_DOMAIN = process.env.SMS_DOMAIN

export default function handler(req, res) {
  const transporter = nodemailer.createTransport({
    port: SMTP_PORT,
    host: SMTP_HOST,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    secure: false,
  })

  const body = req.body
  let phonenumber = body.phonenumber
  let message = body.message

  console.log('Info: Body - Phonenumber: ', phonenumber + ', Message: ', message)

  if (!phonenumber || !message) return res.status(400).json({ response: 'error', message: 'Please provide correct Phonenumber and Message' })

  if (message.length >= 160) return res.status(400).json({ response: 'error', message: 'Message is too long' })

  phonenumber = phonenumber + "@" + SMS_DOMAIN
  const mailData = {
    from: SMTP_USER,
    to: "james.levell@bula21.ch",
    subject: "",
    text: message
  }

  transporter.sendMail(mailData, function (err, info) {
    if(err) {
      console.error("Error: " + err)
      return res.status(400).json({ response: 'error', message: err })
    }
    else {
      console.log("Info: Message sent")
      res.status(200).json({ response: 'success', message: 'Message sent successful' })
    }
  })
}
