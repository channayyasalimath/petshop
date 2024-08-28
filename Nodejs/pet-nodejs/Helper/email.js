const sendEmail = function(options){
    var nodemailer = require('nodemailer');
     var transporter = nodemailer.createTransport({
        // host: 'smtp.ethereal.email',
        // secure: true,
        port: 587,
        service: 'zoho',
        // service: 'gmail',
         auth: {
             user: 'info@clearstreamsolutions.in',
             pass: '7wLAvnzqrCqF'
            //  pass: 'QMtRa8UYVKTB'
         }
     });
    // options.user_name = "sirajmh.0111@gmail.com";
     let mailOptions = {
         from: 'info@clearstreamsolutions.in',
         to: options.email,
         subject: 'Order Confirmation',
         html: '<h1>'+ options.message+'</h1>',
     };
     console.log(mailOptions)
     transporter.sendMail(mailOptions, function (error, info) {
         if (error) {
             console.log(error);
            // callback(options);
         } else {
             console.log('Email sent: ' + info.response);
         //    callback(options);
         }
     });
  }

  module.exports = sendEmail;