SMS Sender Interface

to start run:

```
npm run dev
```

Send sms example request

```
$params = @{
    "phonenumbers"="test";
    "message"="test";
}
$token = "logistik"
$url = "http://localhost:3000/api/sendApi"

Invoke-WebRequest -Uri $url -Method POST -Header @{ Authorization="Bearer " + $token } -Body $params

```