import { Message, validate, mapRecipients } from "../../model/Message"
import { send } from "../../services/mailer"
import { log } from "../../model/LogEntry"

const handler = async (req, res) => {
  const token = req.headers.authorization?.substring(7)
  const group = (JSON.parse(process.env.SENDER_KEYS) || {})[token]

  if (!group) return res.status(401).json({ response: 'error', message: 'Not authenticated, please provide API key' })

  const message: Message = { from: group, body: req.body.message || "", to: mapRecipients(req.body.phonenumbers) }
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