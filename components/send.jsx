import { useState } from 'react';
import { useSession } from "next-auth/react"

export default function Send() {
    const MAX_LENGTH = 160 - 27; // for sponsored by
    const MAX_LENGTH_RECIPIENTS = 250;

    const { data: session } = useSession()

    const [phonenumbers, setPhonenumbers] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = async (event) => {
        if (phonenumbers.split(',').length < MAX_LENGTH_RECIPIENTS) {
            event.preventDefault()

            const data = {
                phonenumbers: phonenumbers,
                message: message,
            }
            const JSONdata = JSON.stringify(data)
            const endpoint = '/api/send'
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.token}`
                },
                body: JSONdata,
            }

            try {
                const response = await fetch(endpoint, options)
                const json = await response.json()
                if (json.response === 'success') {
                    setError(false)
                    setResult('Message sent!')

                    setPhonenumbers('')
                    setMessage('')
                } else {
                    setError(true)
                    setResult('Error sending message!')
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            setError(true)
            setResult('Error too many Recepients max allowed ' + MAX_LENGTH_RECIPIENTS + '!')
        }
    }

    const onChange = (event) => {
        const { name, value } = event.target
        if (name === 'phonenumbers') {
            setPhonenumbers(value)
        } else if (name === 'message') {
            setMessage(value)
        }

        setError(false)
        setResult('')
    }

    return (
        <div className="container">
            <div className="row">
                <form onSubmit={handleSubmit}>
                    <div className="form-group mt-2">
                        <label htmlFor="phonenumbers" >Phone Numbers (comma separated)</label>
                        <input type="tel" id="phonenumbers" className="form-control" name="phonenumbers" placeholder="Please provide Phonenumbers" value={phonenumbers} onChange={onChange} required />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="message">Message</label>
                        <textarea className="form-control" id="message" name="message" rows="3" value={message} onChange={onChange} maxLength={MAX_LENGTH} required></textarea>
                    </div>
                    <div className="form-group mt-3">
                        <button type="submit" className="btn btn-primary">Send SMS</button>
                    </div>
                </form>
            </div>
            <div className="row mt-3">
                {error && <div className="alert alert-danger" role="alert">{result}</div>}
                {!error && result.length > 0  && <div className="alert alert-success" role="alert">{result}</div>}
            </div>
        </div>
    )
}
