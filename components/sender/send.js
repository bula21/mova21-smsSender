import { useState } from 'react';

export default function Send() {
    const MAX_LENGTH = 160;

    const [phonenumber, setPhonenumber] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault()

        const data = {
            phonenumber: phonenumber,
            message: message,
        }
        const JSONdata = JSON.stringify(data)
        const endpoint = '/api/send'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONdata,
        }

        try {
            const response = await fetch(endpoint, options)
            const json = await response.json()
            if (json.response === 'success') {
                setError(false)
                setResult('Message sent!')

                setPhonenumber('')
                setMessage('')
            } else {
                setError(true)
                setResult('Error sending message!')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onChange = (event) => {
        const { name, value } = event.target
        if (name === 'phonenumber') {
            setPhonenumber(value)
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
                        <label htmlFor="phonenumber" >Phone Number</label>
                        <input type="tel" id="phonenumber" className="form-control" name="phonenumber" placeholder="Please provide Phonenumber" value={phonenumber} onChange={onChange} required />
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
