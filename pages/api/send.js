import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import LogEntry from "../../model/LogEntry"
import mongoose, { Types } from 'mongoose';

const nodemailer = require('nodemailer')

const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD =  process.env.SMTP_PASSWORD
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT

const SMS_DOMAIN = process.env.SMS_DOMAIN
const SPONSORED_BY = process.env.SPONSORED_BY

const MAX_LENGTH = 160
const MAX_LENGTH_RECIPIENTS = 250

const transporter = nodemailer.createTransport({
  port: SMTP_PORT,
  host: SMTP_HOST,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  secure: false,
})

mongoose.connect(process.env.MONGO_DB_STRING)
.then(() => {
  console.log("Info: Connected to MongoDB")
})

let handler = async (req, res) => {
  const getRecepientsEmail = (phonenumbers) => {
    phonenumbers = phonenumbers.split(',')
    return phonenumbers.map(number => `${number}@${SMS_DOMAIN}`)
  }

  const writeLog = (email, phonenumbers, message) => {
    let log = new LogEntry({
      _id: new Types.ObjectId(),
      email: email,
      phonenumbers: phonenumbers,
      message: message,
    })
    log.save()
  }

  return new Promise((resolve, reject) => {
    unstable_getServerSession(req, res, authOptions)
    .then(session => {
      if (!session) {
        res.status(401).json({ response: 'error', message: 'Not signed in' })
        resolve()
      }

      const body = req.body
      let { phonenumbers, message } = body

      writeLog(session.user.email, phonenumbers, message)
      console.log('Info: User: ' + session.user.email + ', Phonenumbers: ', phonenumbers + ', Message: ', message)

      if (!phonenumbers || !message) return res.status(400).json({ response: 'error', message: 'Please provide correct phonenumbers and Message' })
      if (message.length >= MAX_LENGTH - SPONSORED_BY.length) return res.status(400).json({ response: 'error', message: 'Message is too long' })
      if (phonenumbers.split(',').length >= MAX_LENGTH_RECIPIENTS) return res.status(400).json({ response: 'error', message: 'Too many phonenumbers' })

      phonenumbers = getRecepientsEmail(phonenumbers)
      const mailData = {
        from: SMTP_USER,
        to: "james.levell@bula21.ch",
        subject: "",
        text: message + " - " + SPONSORED_BY,
      }

      transporter.sendMail(mailData, function (err, info) {
        if(err) {
          console.error("Error: " + err)
          res.status(500).json({ response: 'error', message: err })
          resolve()
        }
        else {
          console.log("Info: Message sent")
          res.status(200).json({ response: 'success', message: 'Message sent successful' })
          resolve()
        }
      })
    })
  })
}

export default handler
