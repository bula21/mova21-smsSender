const nodemailer = require('nodemailer')

const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD =  process.env.SMTP_PASSWORD
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT

const SMS_DOMAIN = process.env.SMS_DOMAIN

const SPONSORED_BY = process.env.SPONSORED_BY

const MAX_LENGTH = 160
const MAX_LENGTH_RECIPIENTS = 250

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
  let phonenumbers = body.phonenumbers
  let message = body.message

  console.log('Info: Body - phonenumbers: ', phonenumbers + ', Message: ', message)

  if (!phonenumbers || !message) return res.status(400).json({ response: 'error', message: 'Please provide correct phonenumbers and Message' })

  if (message.length >= MAX_LENGTH - SPONSORED_BY.length) return res.status(400).json({ response: 'error', message: 'Message is too long' })
  if (phonenumbers.split(',').length >= MAX_LENGTH_RECIPIENTS) return res.status(400).json({ response: 'error', message: 'Too many phonenumbers' })

  phonenumbers = phonenumbers.split(',')
  phonenumbers = phonenumbers.map(number => `${number}@${SMS_DOMAIN}`)
  const mailData = {
    from: SMTP_USER,
    to: "james.levell@bula21.ch",
    subject: "",
    text: message + " - " + SPONSORED_BY,
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
