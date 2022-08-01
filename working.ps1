# Example powershell API request
$params = @{
    "phonenumbers"="test";
    "message"="test";
}
$token = "logistik"
$url = "http://localhost:3000/api/sendApi"

Invoke-WebRequest -Uri $url -Method POST -Header @{ Authorization="Bearer " + $token } -Body $params
