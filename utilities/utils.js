//Get the connection to Heroku Database
let pool = require('./sql_conn.js')

let nodemailer = require('nodemailer');

//We use this create the SHA256 hash
const crypto = require("crypto");

function sendEmail(from, receiver, verification, message) {
 //research nodemailer for sending email from node.
 // https://nodemailer.com/about/
 // https://www.w3schools.com/nodejs/nodejs_email.asp
 //create a burner gmail account
 //make sure you add the password to the environmental variables
 //similar to the DATABASE_URL and PHISH_DOT_NET_KEY (later section of the lab) 
  //fake sending an email for now. Post a message to logs.
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'group4noreply@gmail.com',
      pass: 'Coolpassword1!'
    }
  });
  var mailOptions = {
    from: 'group4noreply@gmail.com',
    to: receiver,
    subject: 'Registration Verification',
    text: 'Your verification code is: ' + verification
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  console.log('Email sent: ' + message);
}

/**
 * Method to get a salted hash.
 * We put this in its own method to keep consistency
 * @param {string} pw the password to hash
 * @param {string} salt the salt to use when hashing
 */
function getHash(pw, salt) {
 return crypto.createHash("sha256").update(pw + salt).digest("hex");
} 


module.exports = {
 pool, getHash, sendEmail 
} 