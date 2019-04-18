const express = require('express');

let db = require('./registration');

const router = express.Router();



/* REACHES TO THIS BY SCANNING QR - ACCEPTS PAYMENTS OR REMOVES AVAILABLE EVENTS */
router.get("/Payment", (req,res)=>{
    
    db.queryParticipant(req.query.phone,res)
    
})

/* HANDLES XHR REQ - ACCEPT PAYMENT ADD PAYMENT AND VOLUNTEER TO DB */

router.post("/AcceptPayment",(req,res)=>{
    
    db.AcceptPayment(req.body,res)
})

/* VLOGIN - VERIFY A VOLUNTEER */

router.get("/login",(req,res)=>{
    res.render("login")
})


/* HANDLES  XHR VERIFICATION FOR VOLUNTEER */
router.post("/login",(req,res)=>{
    db.checkVolunteer(req.body,res);
})

/* HANDLES XHR FOR EVENT REMOVAL FROM DB */
router.post("/eventParticipation",(req,res)=>{
    db.removeRemainingEvent(req.body,res);
})


module.exports = router;