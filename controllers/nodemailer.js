const path = require("path")

let basePath = path.parse(__dirname).dir;
    console.log(basePath)

const nodemailer = require('nodemailer');

function sendPassInfo(userDetails){

    console.log(userDetails)

    let transporter = nodemailer.createTransport({
        service:'gmail',
           auth: {
            user: "hydermufti3@gmail.com", // generated ethereal user
            pass: "Mufti@1998" // generated ethereal password
        }
    });
    
    let htmlData = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        
          
           <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

           <style>
           
          

           .responsive {
               max-width: 100%;
               height: auto;
           }
           
           </style>
    </head>
    <body style="background-color: black;color:white;padding:10px;">
    
    
            <div style="margin:auto;text-align:center;">
                    <div >
                            <img src="http://funfest19.openode.io/img/banner/mobileBanner.jpg" class="responsive"  alt="">
                    </div>
                    <h4 style="color:green;font-size:35px;">Registration Successful.</h4>
                    <p style="font-size:18px;line-height: 35px;">Dear ${userDetails.name}, this is an auto generated email. We wish to inform you that your registration for the event has been Successful. Following is an 
                        attachment of your event Pass in the form of a QR-CODE. You need to show this QR-CODE at Help Desk for making Payment for your registered events. Incase you find some error please contact immidiately.
                    </p>
                    <img src="http://funfest19.openode.io/qrcodePasses/${userDetails.phone}.png"   alt="QR">
                    <h5 style="font-size:20px;">Hope to see you at the Event!</h5>
    
                    <a href="http://facebook.com/mhaf4krr">Developed by Mufti Hyder Ali</a>
            </div>
    
            
    </body>
    </html>`;

    


    // setup email data with unicode symbols
    let mailOptions = {
        from: 'EVENT @ DOCSE | IUST <hyderdevelops>', // sender address
        to: userDetails.email, // list of receivers
        subject: 'REGISTRATION DETAILS | PASS GENERATED', // Subject line

        html: htmlData, // html body
        
        attachments : [
            {   // file on disk as an attachment
                filename: 'QRPASS.png',
                path: `http://funfest19.openode.io/qrcodePasses/${userDetails.phone}.png` // stream this file
            }
        ]


    };
    
    //send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
        
    })
}

module.exports = sendPassInfo;