import * as Yup from 'yup';

export const RegisterValidation = Yup.object().shape({
  fullName: Yup.string().required('Full name is required').min(3, 'Enter a valid name'),
  email: Yup.string().required('Email is required').email('Email must be valid'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{8,15}$/, 'Enter a valid phone number'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});
