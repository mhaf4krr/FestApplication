var unirest = require("unirest");

var req = unirest("GET", "https://www.fast2sms.com/dev/bulk");

req.query({
  "authorization": "PX5WelrL1QkEQt2aURW9eLpAfqxK9eRzYQJ9fa5xqSwMxAQ8FRtIoFbfTILb",
  "sender_id": "FSTSMS",
  "message": "This is a test message from server",
  "language": "english",
  "route": "p",
  "numbers": "7006225524",
});

req.headers({
  "cache-control": "no-cache"
});


req.end(function (res) {
  if (res.error) throw new Error(res.error);

  console.log(res.body);
});