const express = require('express');
var mysql = require('mysql');
const ValidateJWB = require('../middelware/check_authenticate');
const nodemailer = require('nodemailer');

const router = express.Router();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port : 3306,
  database : 'e_learning'
});


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // e.g., 'smtp.gmail.com'
  port: 587 , // e.g., 587
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'education.center.eu@gmail.com' ,
    pass: 'sbocyfyywuhzbngp',
  },
});


async function sendEmail(email_expéditeur,email_destinataire,text,sujet) {

// Create a transporter using SMTP

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      //from: email_expéditeur +"<youssef.aoutir2004@gmail.com>",
      from: email_expéditeur+" (Education Center) <no-reply.education-center@gmail.com>",
      // from:{
      // name: email_expéditeur,
      // address: email_expéditeur
      // },
      to: email_destinataire,
      subject: sujet,
      text: text,
      html: text +'<br><br><br>Education Center',
    });
    const val = "../../src/assets/default-image/logo1.png"
    console.log('Message sent:', info.messageId);
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
}

router.post('/',ValidateJWB('administrator former student'),(req,rep,next)=>{
 console.log(req.userData.email," ",req.body.email_destinataire);
 sendEmail(req.userData.email,req.body.email_destinataire,req.body.text,req.body.sujet);

 })




module.exports = router;
