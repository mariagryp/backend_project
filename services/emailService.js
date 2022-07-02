const sgMail = require("@sendgrid/mail");

// config method - development env vars(to be able to use our SENDGRID_KEY)
require("dotenv").config();

const orderConfirmed = (orderInfo) => {
    sgMail.setApiKey(process.env.SENDGRID_KEY);
    const msg = {
        to: `${orderInfo.email}`, // Change to your recipient
        from: 'mia.gripish@gmail.com', // Change to your verified sender
        subject: 'Order confirmed',
        text: 'your order has been confirmed',
        html: `<h1>Hi dear ${orderInfo.firstname}! Thank you for your order!</h1>
        <p>Your order has been confirmed!</p>
        <p>We'll let you know when your order is shipped.</p>`,
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        });
};


module.exports = orderConfirmed;