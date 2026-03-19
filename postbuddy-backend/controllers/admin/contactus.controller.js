import { response } from 'express';
import { ContactUs } from '../../models/admin/contactus.models.js'
import { errorHandler, responseHandler } from '../../utils/responseHandler.js';
import { contactUsSubmissionTemplate } from '../../template/email.js';
import { sendEmail } from '../../utils/sendEmail.js';

export const createContactUs = async (req, res) => {
  try {
    const value = req.body;
    const contact = await ContactUs.create(value);
    const temp = contactUsSubmissionTemplate(contact.fullName, contact.email, contact.subject, contact.message)
    const subject = `Contact us Message for Postbuddy from ${contact.fullName} `
    await sendEmail(temp, subject, "saurav12bytive@gmail.com")
    responseHandler(null, res, 'Message sent successfully', 201)
  } catch (error) {
    console.log('Error: ', error)
    errorHandler(error.message, res, 500)
  }
}