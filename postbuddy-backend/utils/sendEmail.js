import { SendMailClient } from 'zeptomail';

export const sendEmail = async (template, subject, email) => {
  try {
    const url = process.env.EMAIL_URL;
    const token = process.env.EMAIL_TOKEN
    let client = new SendMailClient({ url, token });

    const response = await client.sendMail({
      from: {
        address: process.env.EMAIL,
        name: process.env.NAME,
      },
      to: [
        {
          email_address: {
            address: email,
            name: 'Recipient Name',
          },
        },
      ],
      subject: subject,
      htmlbody: template,
    });

    console.log('Email sent: ' + response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.error);
    return false;
  }
};

export const sendOTP = async (template, subject, email) => {
  try {
    const url = process.env.EMAIL_URL
    const token =  process.env.EMAIL_TOKEN
    let client = new SendMailClient({ url, token });

    const response = await client.sendMail({
      from: {
        address: process.env.EMAIL,
        name: process.env.NAME,
      },
      to: [
        {
          email_address: {
            address: email,
            name: 'Recipient Name',
          },
        },
      ],
      subject: subject,
      htmlbody: template,
    });

    console.log('Email sent: ' + response);
    return true
  } catch (error) {
    console.error('Error sending email:', error.error);
    return false;
  }
};
