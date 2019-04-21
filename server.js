const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(express.static("public"));

app.set("view engine","ejs");

// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded


const api = require("./controllers/api");
app.use('/api',api);

const registration = require("./controllers/registration");

app.use("/registration",registration.router);


app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})



/* HANDLE TEMPLATING FOR SINGLE EVENT */
app.get("/event",(req,res)=>{
    registration.getEventDetails(req.query.eventName,res);
})

app.post("/addEvent",(req,res)=>{
    console.log(req.body)
    registration.addEvent(req.body,res);
})

app.get("/listAll",(req,res)=>{
    let html = `/registration/register *Participant Register <br>
    
    /registration/vRegister *Volunteer Register <br>

    /registration/details *Get all details of participation <br>

    /registration/vDetails *Get cash each volunteer has accepted
    `
    res.send(html)
})

app.listen(80);
