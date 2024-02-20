/* eslint-disable react-native/no-inline-styles */

import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Routes} from '../../navigation';
import {
  getSmsList,
  login,
  sendSms,
  sendSmscall,
  signUp,
  signUpCheck,
} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import {Button, TextField, Vertical} from '../../ui-kit';
import {LogInSchema} from '../../utils/schema';
import Toast from 'react-native-simple-toast';
import {verifyUserData} from '../../redux/slices/authSlice';

// const spaceValidation = new RegExp(/^[^ ]*$/);
const spaceValidation = new RegExp(/^(?!\s*$).*$/);
export const Login = () => {
  const userData = useSelector(state => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [secureEntry, setSecureEntry] = useState(true);
  const [clickedLogin, setClickedLogin] = useState(false);
  const [smsTemplate, setSmsTemplate] = useState();

  useEffect(() => {
    const getSmsTemplate = () => {
      getSmsList()
        .then(res => {
          //   console.log('res', res);
          setSmsTemplate(res);
        })
        .catch(err => {
          console.log('err', err);
        });
    };
    getSmsTemplate();
  }, []);

  const sendSmsApi = (otp, mobileNumber, template) => {
    return new Promise((resolve, reject) => {
      const payload = new FormData();
      payload.append('otp', otp);
      payload.append('phone_no', mobileNumber);
      payload.append('sms_template', template);
      console.log('sdad', payload);
      sendSmscall(payload)
        .then(res => {
          console.log('res', res);
          resolve(res);
        })
        .catch(err => {
          reject(err);
          console.log('err', err);
        });
    });
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={color.palette.btnColor}
        translucent={true}
      />

      <ImageBackground
        source={require('../../assets/icon/bg.png')}
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 17,
        }}>
        <Vertical size={20} />
        <View
          style={{
            backgroundColor: color.palette.white,
            // backgroundColor: color.palette.red,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: color.palette.btnColor,
          }}>
          <Vertical size={20} />

          <Image
            //   source={require('../../assets/icon/logo.png')}
            source={{uri: userData?.companyDetail?.company_logo}}
            style={{
              height: 50,
              //   width: Dimensions.get('screen').width / 2,
              width: '70%',
              //   width: 'auto',
              alignSelf: 'center',
            }}
          />

          <Formik
            enableReinitialize={true}
            initialValues={{
              mobileNumber: '',
              fullName: '',
              //   mobileNumber: '',
              //   fullName: '',
            }}
            onSubmit={(values, {setSubmitting, setErrors, resetForm}) => {
              setSubmitting(true);
              const payload = new FormData();
              if (!clickedLogin) {
                payload.append('customer_first_name', values.fullName);
                payload.append('customer_mobile_no', values.mobileNumber);
                signUpCheck(payload)
                  .then(res => {
                    console.log('res', res);
                    if (res.response === 'success') {
                      var otp = '';
                      for (var i = 0; i < 4; i++) {
                        otp += Math.floor(Math.random() * 10);
                      }

                      dispatch(
                        verifyUserData({
                          otp: otp,
                          mobileNumber: values.mobileNumber,
                          type: 'SignUp',
                          fullName: values.fullName,
                        }),
                      );

                      //   const url = `https://bhashsms.com/api/sendmsg.php?user=${smsTemplate?.sms_list[0]?.sms_details?.BOSSMS_USER}&pass=${smsTemplate?.sms_list[0]?.sms_details?.BOSSMS_PASS}&sender=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.sender_id}&phone=${values.mobileNumber}&text=${otp} is your OTP to Login JBJ Ananatha Bhavan Sweets and Cakes&priority=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.priority}&stype=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.smstype}`;

                      //   sendSms(url)
                      //     .then(response => {
                      //       navigation.navigate(Routes.OTPVERIFICATION);
                      //       Toast.show('Login Successfully', Toast.LONG);
                      //       setSubmitting(false);
                      //     })
                      //     .catch(err => {
                      //       console.log('err from "sns', err);
                      //     });
                      //   navigation.navigate(Routes.OTPVERIFICATION);
                      sendSmsApi(
                        otp,
                        values.mobileNumber,
                        smsTemplate?.sms_list[0]?.sms_details?.sms_template
                          ?.SIGNOTPSMS?.sms_temp_code,
                      )
                        .then(res => {
                          navigation.navigate(Routes.OTPVERIFICATION);
                          Toast.show('Login Successfully', Toast.LONG);
                          setSubmitting(false);
                        })
                        .catch(err => {
                          setSubmitting(false);
                          console.log('err from "sns', err);
                          Toast.show('Something went wrong', Toast.LONG);
                        });
                    } else if (
                      res?.error_msg[0] === 'Phone No already exists'
                    ) {
                      setErrors({mobileNumber: 'Phone Number already exists'});
                      Toast.show('Phone Number already exists', Toast.LONG);
                      setSubmitting(false);
                    } else {
                      Toast.show('Something went wrong', Toast.LONG);
                      setSubmitting(false);
                    }
                  })
                  .catch(err => {
                    setSubmitting(false);
                    Toast.show('Something went wrong', Toast.LONG);
                    console.log('err data', err);
                  });
              } else {
                // payload.append('customer_first_name', values.fullName);
                payload.append('customer_user_name', values.mobileNumber);
                login(payload)
                  .then(res => {
                    console.log('loag', res);
                    if (res.response === 'success') {
                      var otp = '';
                      for (var i = 0; i < 4; i++) {
                        otp += Math.floor(Math.random() * 10);
                      }

                      dispatch(
                        verifyUserData({
                          otp: res?.login[0]?.customer_otp,
                          mobileNumber: values.mobileNumber,
                          type: 'Login',
                        }),
                      );

                      //   const url = `https://bhashsms.com/api/sendmsg.php?user=${smsTemplate?.sms_list[0]?.sms_details?.BOSSMS_USER}&pass=${smsTemplate?.sms_list[0]?.sms_details?.BOSSMS_PASS}&sender=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.sender_id}&phone=${values.mobileNumber}&text=${res?.login[0]?.customer_otp} is your OTP to Login JBJ Ananatha Bhavan Sweets and Cakes&priority=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.priority}&stype=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.smstype}`;

                      //   sendSms(url)
                      //     .then(response => {
                      //       setSubmitting(false);
                      //       navigation.navigate(Routes.OTPVERIFICATION);
                      //       Toast.show('Login Successfully', Toast.LONG);
                      //     })
                      //     .catch(err => {
                      //       console.log('err data', err);
                      //     });
                      //   navigation.navigate(Routes.OTPVERIFICATION);
                      sendSmsApi(
                        res?.login[0]?.customer_otp,
                        values.mobileNumber,
                        smsTemplate?.sms_list[0]?.sms_details?.sms_template
                          ?.LOGINTPSMS?.sms_temp_code,
                      )
                        .then(res => {
                          navigation.navigate(Routes.OTPVERIFICATION);
                          Toast.show('Login Successfully', Toast.LONG);
                          setSubmitting(false);
                        })
                        .catch(err => {
                          setSubmitting(false);
                          console.log('err from "sns', err);
                          Toast.show('Something went wrong', Toast.LONG);
                        });
                    } else if (
                      res?.error_msg[0]?.includes(
                        'Email ID / Phone No does not exist',
                      )
                    ) {
                      setSubmitting(false);
                      Toast.show('Please register your number', Toast.LONG);
                    } else {
                      setSubmitting(false);
                      console.log('err');
                      Toast.show('Something went wrong', Toast.LONG);
                    }
                  })
                  .catch(err => {
                    setSubmitting(false);
                    Toast.show('Something went wrong', Toast.LONG);
                    console.log('err', err);
                  });
              }
              // console.log('payload', payload);
            }}
            validationSchema={!clickedLogin ? LogInSchema() : null}
            validateOnChange={true}
            validateOnBlur={true}
            validateOnMount={true}>
            {({
              handleChange,
              values,
              isSubmitting,
              errors,
              touched,
              handleBlur,
              setErrors,
              setTouched,
              setFieldValue,
              handleSubmit,
              resetForm,
              setStatus,
              initialValues,
              ...restProps
            }) => (
              <View
                style={{
                  marginHorizontal: 29,
                }}>
                <Vertical size={25} />

                <Text style={styles?.title}>
                  {clickedLogin
                    ? 'Login for our better service'
                    : 'Sign Up for our better service'}
                </Text>
                <Vertical size={25} />
                <TextField
                  lftSymbol="+91"
                  keyboardType="phone-pad"
                  label="Mobile Number"
                  errorStyleHeight={{height: 54}}
                  style={styles.textField}
                  placeholder={'Enter your mobile number'}
                  // containerStyle={{height: 48}}
                  value={values.mobileNumber}
                  inputStyle={{
                    paddingLeft: 41,
                    top: 1,
                    borderColor: color.palette.borderColor,
                    borderWidth: 1,
                  }}
                  onChangeText={text => {
                    // console.log('text', text);
                    if (spaceValidation.test(text) && text?.length <= 10) {
                      setFieldValue('mobileNumber', text);
                    } else if (text === '') {
                      setFieldValue('mobileNumber', text);
                    }
                  }}
                  handleFocus={() => {
                    // setuserNameFocus(true);
                  }}
                  onBlur={() => {
                    // setuserNameFocus(false);
                    handleBlur('mobileNumber');
                  }}
                  errorMessage={touched.mobileNumber && errors.mobileNumber}
                />
                <Vertical size={25} />
                {!clickedLogin ? (
                  <TextField
                    value={values.fullName}
                    style={styles.textField}
                    placeholder={'Enter your full name'}
                    label="Full Name"
                    onChangeText={text => {
                      //   let data = text?.trim();
                      console.log(
                        'spaceValidation.test(text)',
                        spaceValidation.test(text),
                      );
                      if (spaceValidation.test(text) && text?.length < 40) {
                        setFieldValue('fullName', text);
                      } else if (text === '') {
                        setFieldValue('fullName', text);
                      }
                    }}
                    inputStyle={{
                      paddingLeft: 11,
                      borderColor: color.palette.btnColor,
                      borderWidth: 1,
                      //   top: 1,
                      paddingTop: 1,
                    }}
                    handleFocus={() => {}}
                    onBlur={() => {
                      handleBlur('fullName');
                    }}
                    onIconPress={() => {
                      setSecureEntry(!secureEntry);
                    }}
                    errorMessage={touched.fullName && errors.fullName}
                  />
                ) : null}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 28,
                    marginTop: 50,
                  }}>
                  <Text
                    style={{
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_small_E,
                      color: color.palette.black,
                      alignSelf: 'flex-end',
                    }}>
                    {clickedLogin
                      ? `I don't have a account ? `
                      : 'I’m already a user, '}
                  </Text>
                  <Text
                    onPress={() => {
                      setClickedLogin(!clickedLogin);
                    }}
                    style={{
                      fontFamily: typography.semiBold,
                      fontSize: FontSize.font_medium_E,
                      color: color.palette.labelColor,
                      textDecorationLine: 'underline',
                    }}>
                    {clickedLogin ? 'SIGN UP' : 'LOGIN'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                  <Text
                    style={{
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_small_E,
                      color: color.palette.black,
                    }}>
                    By going forward you accept{' '}
                  </Text>
                  <Text
                    style={{
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_small_E,
                      color: color.palette.labelColor,
                    }}>
                    Terms & Conditions
                  </Text>
                </View>
                <Button
                  title={'SEND OTP'}
                  style={styles.button}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  textStyle={styles.btnTxt}
                />
              </View>
            )}
          </Formik>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: color.palette.white},
  bg: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
  },
  title: {
    color: color.palette.textColor,
    fontFamily: typography.semiBold,
    fontSize: FontSize.font_large_E,
    // textAlign: 'center',
  },
  subTitle: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_extra_medium_O,
    fontWeight: '500',
    // lineHeight: 18,
  },
  container: {
    position: 'absolute',
    top: Dimensions.get('screen').height / 2.5,
    marginLeft: 60,
  },
  textField: {
    borderRadius: 20,
    height: 46,
  },
  button: {
    // marginTop: 42,
    height: 46,
    marginBottom: 40,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
    // color: color.palette.black,
  },
  btnTxt: {
    fontSize: FontSize.font_large_E,
    color: color.palette.white,
  },
  frgtpass: {
    textAlign: 'right',
    marginTop: 13,
    right: 12,
    fontSize: FontSize.font_extra_small_E,
    fontFamily: typography.primary,
  },
  changeLangView: {
    marginHorizontal: 5,
    flexDirection: 'row',
    marginTop: 13,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  globeIcon: {
    width: 15,
    height: 15,
    tintColor: '#5A5A5A',
  },
  langsView: {
    flex: 1,
    flexDirection: 'row',
  },
  chnageLang: {
    fontSize: FontSize.font_small_O,
    fontFamily: typography.secondary,
    color: '#5A5A5A',
  },
  selectLang: {
    fontSize: FontSize.font_small_O,
    fontFamily: typography.secondary,
    color: color.palette.green,
    textDecorationLine: 'underline',
  },
});
