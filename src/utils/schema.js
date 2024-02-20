import * as Yup from 'yup';
const numberValidation = new RegExp(/^[0-9]{10}$/);
const nameValidation = new RegExp(/^[^\s*]{1,}[a-zA-Z0-9-_/.&\s*@'"]{1,}$/);
const addressValidation = new RegExp(
  /^[^]{1,}[a-zA-Z0-9]{1,}[a-zA-Z0-9-/.:,()\s*]{1,}$/,
);
const valueValidation = new RegExp(/^[^0]{1,}[0-9]{0,8}(.[0-9]{1,3})?$/);
const aadhaarValidation = new RegExp(
  /^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
);
const panValidation = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
// const pinCodeValidaiton = new RegExp(/^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/);

export const LogInSchema = () =>
  Yup.object({
    mobileNumber: Yup.string().required('Enter valid phone number'),
    fullName: Yup.string().required('Enter your name'),
  });

export const passwordResetRequestSchema = language =>
  Yup.object({
    mobile_number: Yup.string()
      .required(language?.PleaseEnterYourMobileNumber)
      .matches(numberValidation, language?.MobileNumberIsInvalid),
  });

export const otpVerifySchema = language =>
  Yup.object({
    otp: Yup.string().required(language?.PleaseEnterYourOtp),
  });

export const ResetPasswordSchema = language =>
  Yup.object({
    password: Yup.string().required(language?.PleaseEnterYourPassword).min(6),
    confirm_password: Yup.string()
      .required(language?.PleaseEnterYourConfirmPassword)
      .min(6)
      .oneOf([Yup.ref('password')], language?.PasswordsDoNotMatch),
  });

export const addressSchema = () =>
  Yup.object({
    full_name: Yup.string()
      .required('Please enter your name')
      .matches(nameValidation, 'Enter valid name'),
    mobile_number: Yup.string()
      .required('Please enter your mobile number')
      .matches(numberValidation, 'Phone number is not valid'),
    // houseno: Yup.string().required('Please enter your house number'),
    address: Yup.string()
      .required('please enter your Address')
      .matches(addressValidation, 'Enter valid address'),
    landmark: Yup.string().required('please enter your landmark'),
    //   .matches(addressValidation, 'Enter valid address'),
    city: Yup.string().required('please enter your City'),
    state: Yup.string().required('please enter your state'),
    district: Yup.string().required('please select a district'),

    country: Yup.string().required('please enter a country'),

    pincode: Yup.string().required('Please enter your pincode number'),
    //   .matches(pinCodeValidaiton, 'Enter valid pin code number'),
    type: Yup.string().required('please select a type'),
  });

export const feedbackSchema = () =>
  Yup.object({
    mobile_number: Yup.string()
      .required('Please enter your mobile number')
      .matches(numberValidation, 'Phone number is not valid'),
    emailId: Yup.string()
      .required('please enter your email id')
      .email('Enter a valid email address'),
    full_name: Yup.string()
      .required('Please enter your name')
      .matches(nameValidation, 'Enter valid name'),
    feedback: Yup.string()
      .required('please enter your Address')
      .matches(addressValidation, 'Enter valid address'),
  });

export const profileSchema = () =>
  Yup.object({
    mobile_number: Yup.string()
      .required('Please enter your mobile number')
      .matches(numberValidation, 'Phone number is not valid'),
    first_name: Yup.string()
      .required('Please enter your first name')
      .matches(nameValidation, 'Enter valid first name'),
    last_name: Yup.string()
      .required('Please enter your last name')
      .matches(nameValidation, 'Enter valid last name'),
    gender: Yup.string().required('please select your gender'),
    dob: Yup.string().required('please select your date'),
  });
