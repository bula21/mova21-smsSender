import { Message } from "../model/Message"
import nodemailer from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport"

const smtpOptions: SMTPTransport = {
	port: process.env.SMTP_PORT,
	host: process.env.SMTP_HOST,
	auth: {
		// @ts-ignore
		user: process.env.SMTP_USER || '',
		// @ts-ignore
		pass: process.env.SMTP_PASSWORD || '',
	},
	secure: false,
}
const SPONSORED_BY = process.env.SPONSORED_BY || ''

export function send(message: Message) {
	return new Promise((resolve, reject) => {
		nodemailer.createTransport(smtpOptions).sendMail({
			from: smtpOptions.auth.user,
			to: message.to,
			subject: "",
			text: message.body + " - " + SPONSORED_BY,
		}, (err, info) => {
			if (err) reject(err)
			resolve(info)
		})
	})

}
