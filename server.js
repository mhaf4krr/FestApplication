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





app.listen(80);
