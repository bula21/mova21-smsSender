import { unstable_getServerSession } from "next-auth/next"
import { Message, validate } from "../../model/Message"
import { authOptions } from "./auth/[...nextauth]"
import { send } from "../../services/mailer"
import { log } from "../../model/LogEntry"

const SMS_DOMAIN = process.env.SMS_DOMAIN

function mapRecipients(phonenumbers?: string): string[] {
  return phonenumbers?.split(',')?.map(number => `${number}@${SMS_DOMAIN}`) || []
}

const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const email = session?.user?.email

  if (!email) return res.status(401).json({ response: 'error', message: 'Not signed in' })

  const message: Message = { from: email, body: req.body.message, to: mapRecipients(req.body.phonenumbers) }
  const validationResult = validate(message)

  if (!validationResult.ok) return res.status(400).json({ response: 'error', message: validationResult.message })

  try {
    await send(message)
    await log(message)
    console.log("Info: Message sent")
    res.status(200).json({ response: 'success', message: 'Message sent successful' })
  }
  catch (ex) {
    console.error("Error: " + ex)
    res.status(500).json({ response: 'error', message: ex })
  }
}

export default handler
