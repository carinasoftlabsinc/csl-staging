const nodemailer = require('nodemailer');

// Create the transporter outside of the class
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

module.exports = class Email {
  constructor() {
    this.to = process.env.EMAIL;
    this.from = process.env.EMAIL;

  }


  async sendContactDetails(
    name,
    email,
    contactNumber,
    address,
    message,
    service,
    budget
  ) {
    try {
      await transporter.sendMail({
        from: this.from,
        to: this.to,
        subject: 'Contact Details - Contact Us Page',
        html: `
          <p>Dear Admin,</p>
          <p>You have received a new contact details submission. Below are the details:</p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Contact Number:</strong> ${contactNumber}</li>
            <li><strong>Service:</strong> ${service}</li>
            <li><strong>Budget:</strong> ${budget}</li>
            <li><strong>Country:</strong> ${address}</li>
            <li><strong>Messge:</strong> ${message}</li>
          </ul>
          <p>Please reach out to the contact as needed.</p>
        `,
      });
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendServiceDetails(name, email, contactNumber, message) {
    try {
      await transporter.sendMail({
        from: this.from,
        to: this.to,
        subject: 'Contact Details - Service Page',
        html: `
         
          <p>Dear Admin,</p>
          <p>You have received a new contact details submission. Below are the details:</p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Contact Number:</strong> ${contactNumber}</li>
            <li><strong>Messge:</strong> ${message}</li>
          </ul>
          <p>Please reach out to the contact as needed.</p>
        `,
      });
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendThankYou(name, email) {
    try {
      await transporter.sendMail({
        from: this.from,
        to: email,
        subject: 'Thank You For Contacting Carina Softlabs Inc.',
        html: `
       <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
        <h3 style="color: #2c3e50;">Hi ${name},</h3>
        <p>Thank you for connecting with <strong>Carina Softlabs</strong>. We appreciate your interest in our services and look forward to assisting you to the best of our expertise!</p>
        <p>Our team will revert to you shortly!</p>
        <p>Regards,<br><strong>Carina Softlabs Inc.</strong></p>
    </div>
        `,
      });
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
};
