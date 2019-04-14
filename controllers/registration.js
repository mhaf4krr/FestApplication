const express = require("express");
const qrcode= require("qrcode");
const router = express.Router();
const path = require("path")
const mongoose = require('mongoose');

/* Import Nodemailer for sending pass through emails */
const sendEmail = require("./nodemailer");


/* DATABASE CONNECT */
/* Database connect */

mongoose.connect('mongodb://rootuser:rootfunfest19@ds157187.mlab.com:57187/funfest',{useNewUrlParser:true},function(error){if(error)console.log(error);else console.log("Connected to MLAB - REGISTRATION")})


/* Pass Schema */

const passSchema = new mongoose.Schema({
    name:String,
    phone:Number,
    gender:String,
    email:String,
    passChoice:String,
    single_event:Array,
    paymentReceived:Boolean,
    eventParticipated:Array,
    paymentAcceptedVolunteer:String,
    paymentAmountReceived:Number,
    department:String,
    university:String,
    semester:Number

})


const PASS = mongoose.model('passes',passSchema)



/* Volunteer Schema */


const volunteerSchema = new mongoose.Schema({
    name:String,
    phone:Number,
    semester:String,
    department:String,
    event:String,
    designation:String,
    email:String,
    password:String
})

const VOLUNTEER = new mongoose.model('volunteer',volunteerSchema);



/* FUNCTION ADDS A NEW VOLUNTEER TO DB */

async function addVolunteer(body,res){
    let newVolunteer = new VOLUNTEER({
        name:body.name,
        phone:body.phone,
        semester:body.semester,
        department:body.department,
        event:"toBeAssigned",
        designation:"Volunteer",
        email:body.email,
        password:body.password
    })
    

    let result = await VOLUNTEER.find({phone:body.phone});
    if(result[0]){
        let data = {
            msg:"You have already Registered Once",
            styleName:"color:red;font-size:16px;"}
        res.render("vRegister",{data:data})
    }

    else {
    const volunteer = await newVolunteer.save();
    let data = {
        msg:"You have been Registered",
        styleName:"color:green;font-size:16px;"}
    
    res.render("vRegister",{data:data}) 
    }
}


/* VERIFIES IDENTITY OF VLOGIN - VOLUNTEER LOGIN */

async function checkVolunteer(body,res){
    try {

        let result = await VOLUNTEER.find({phone:body.phone});
        
        if(result[0]){
            if(body.password === result[0].password){
                res.send(JSON.stringify({
                    volunteer:result[0],
                    verified:true
                }))
            }

            else{
                res.send(JSON.stringify({
                    volunteer:"",
                    verified:false
                }))
            }
        }
      
        
           else {
            res.send(JSON.stringify({
                volunteer:"",
                verified:false
            }))
           }
        

    } catch (error) {
        console.log(error)
    }
}


/* GENERATES A NEW PASS FOR PARTICIPANT AND STORES IT IN DB*/

async function generatePass(body,res) {

   
    let newPass = new PASS({
        name:body.name,
        phone:body.phone,
        gender:body.gender,
        email:body.email,
        passChoice:body.passChoice,
        single_event:body.single_event,
        paymentReceived:false,
        eventParticipated:[],
        university:body.university,
        department:body.department,
        semester:body.semester,

    })
        
    if(newPass.passChoice === "gaming-pass")
        newPass.single_event = ['PUBG','COUNTER-STRIKE','FIFA-19']
        else if(newPass.passChoice === "squad-pass")
        newPass.single_event = ['PUBG','COUNTER-STRIKE','FIFA-19']
    else if(newPass.passChoice === "single-pass"){
        
    }


         const result = await newPass.save();

        
            try{
               
                /* FUNCTION CALL SENDS AN EMAIL */
                sendEmail(body);

                let basePath = path.parse(__dirname).dir;
             
              qrcode.toFile(`${basePath}/public/qrcodePasses/${body.phone}.png`,`VOLUNTEER_LINK:http://funfest19.openode.io/api/Payment?phone=${body.phone}`)
            }
            catch(err){
                console.log(err)
            }
            let msg="You have successfully registered!"
            res.render("register",{msg:msg})  
    
}



/* PREVENTS A USER FROM CREATING 2 ENTRIES IN DB , CHECKS FOR EXISTING USER IN DB */
async function checkIfAlreadyRegistered(body,res){
    try {
        let result = await PASS.find({phone:body.phone});
        
        
        if(result[0]){
            res.render("register",{msg:"This number is already Registered"})
        }

        else {
            generatePass(body,res);
        }

    } catch (error) {
        console.log(error)
    }
}

/* EXTRACTS DETAILS OF A PARTICIPANT FROM DB , TEMPLATED */
 async function queryParticipant(number,res){
    
   
    try {
        let result = await PASS.find({phone:number});
        
        
        if(result[0]){
            
            
            if(!result[0].paymentReceived){

            let totalCost = 0;
            if(result[0].passChoice === "gaming-pass")
            totalCost=300;
            else if(result[0].passChoice === "squad-pass")
            totalCost = 150;
            else if(result[0].passChoice === "single-pass"){
                totalCost = result[0].single_event.length;
                totalCost = totalCost*50;
            }
            
            res.render("pannel",{user:result[0],cost:totalCost});
           
          
        }

        else {
            res.render("pannel",{user:result[0],cost:result[0].paymentAmountReceived});
        }
        }

        else {
            res.send("No such Participant")
        }

    } catch (error) {
        console.log(error)
    }
}

/* ACCEPTS PAYMENT AGAINST A PARTICIPANT AND UPDATES DB */

async function AcceptPayment(body,res){
    try {
        let result = await PASS.find({phone:body.participantNumber});
        
        result[0].paymentAcceptedVolunteer = body.volunteer;
        result[0].paymentReceived = true;
        result[0].paymentAmountReceived = body.paymentAmountReceived;
        await result[0].save();
        
        

        res.send("Updated!")


    } catch (error) {
        console.log(error)
    }
}

/* REMOVES EVENTS FROM EVENT LIST TO KEEP TRACK OF AVAILABLE EVENT ENTRIES A PARTICIPANT HAS */

async function removeRemainingEvent(body,res){
    try {
        let result = await PASS.find({phone:body.participantNumber});
        
        let remainingEvents = result[0].single_event;

        remainingEvents = remainingEvents.filter((event)=>{
            return event!== body.event
        })

        result[0].single_event = remainingEvents;


        console.log(body.eve)
        let participatedEvents = result[0].eventParticipated;
        participatedEvents.push(`${body.event}`);

        result[0].eventParticipated = participatedEvents;
        
         await result[0].save();
        
        // console.log("Updated!")

        res.send("Updated!")


    } catch (error) {
        console.log(error)
    }
}



router.get("/register",(req,res)=>{
    res.render("register",{msg:""})
})


/* ROUTER - PARTICIPANT REGISTER */
router.post('/register',(req,res)=>{

    checkIfAlreadyRegistered(req.body,res);
})


/* ROUTER - VOLUNTEER REGISTER */

router.get("/vRegister",(req,res)=>{
    let data = {}
    res.render("vRegister",{data:data})
})

/* ROUTER - HANDLES XHR REQ */
router.post("/vRegister",(req,res)=>{
    addVolunteer(req.body,res);
})



module.exports = {
    router:router,
    queryParticipant:queryParticipant,
    checkVolunteer:checkVolunteer,
    AcceptPayment:AcceptPayment,
    removeRemainingEvent:removeRemainingEvent
}