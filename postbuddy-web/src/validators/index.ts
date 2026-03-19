import * as Yup from 'yup';

export const validationContactusForm = Yup.object({
  fullName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Full Name can only contain alphabets and spaces')
    .required('Full Name is required'),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Provided Email is not valid',
    )
    .email('Invalid email address')
    .required('Email is required'),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().required('Message is required'),
});

export const validationTalkToSalesForm = Yup.object({
  fullName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Provided Name is not valid')
    .required('Full Name is required'),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Provided Email is not valid',
    )
    .email('Invalid email address')
    .required('Email is required'),
  companyName: Yup.string()
    .matches(
      /^[A-Za-z0-9\s]+$/,
      'Company Name cannot contain special characters',
    )
    .required('Company Name is required'),
  teamSize: Yup.string().required('Team Size is required'),
  message: Yup.string().required('Message is required'),
});
