/* eslint-disable react-native/no-inline-styles */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {authToken, verifiedUserData} from '../../redux/slices/authSlice';
import {getSmsList, login_verify, sendSms, signUp} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import {Button, OtpInput, Vertical} from '../../ui-kit';
import Timer from '../../utils/timer';

const spaceValidation = new RegExp(/^[^ ]*$/);
export const OtpVerification = () => {
  const userData = useSelector(state => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const otpRef = useRef();
  const [code, setCode] = React.useState('');
  const [errMsg, setErrMsg] = useState(null);
  const authData = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [smsTemplate, setSmsTemplate] = useState();
  const [showTimer, setShowTimer] = useState(true);

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

  const otpSubmit = () => {
    setLoading(true);
  };

  const resendSms = url => {
    sendSms(url)
      .then(response => {
        console.log('resend otp response', response);
      })
      .catch(err => {
        console.log('err data', err);
      });
  };

  const resendOtp = () => {
    setShowTimer(true);
    if (authData.type === 'Login') {
      const url = `https://bhashsms.com/api/sendmsg.php?user=${smsTemplate?.sms_list[0]?.sms_details?.BOSSMS_USER}&pass=${smsTemplate?.sms_list[0]?.sms_details?.BOSSMS_PASS}&sender=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.sender_id}&phone=${authData.mobileNumber}&text=${authData.otp} is your OTP to Login JBJ Ananatha Bhavan Sweets and Cakes&priority=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.priority}&stype=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.smstype}`;
      resendSms(url);
    } else {
      const url = `https://bhashsms.com/api/sendmsg.php?user=${smsTemplate?.sms_list[0]?.sms_details?.BOSSMS_USER}&pass=${smsTemplate?.sms_list[0]?.sms_details?.BOSSMS_PASS}&sender=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.sender_id}&phone=${authData.mobileNumber}&text=${authData.otp} is your OTP to Login JBJ Ananatha Bhavan Sweets and Cakes&priority=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.priority}&stype=${smsTemplate?.sms_list[0]?.sms_details?.sms_template?.LOGINTPSMS?.smstype}`;
      resendSms(url);
    }
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
        style={{flex: 1, justifyContent: 'center', paddingHorizontal: 17}}>
        <Vertical size={20} />
        <View
          style={{
            backgroundColor: color.palette.white,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: color.palette.btnColor,
          }}>
          <Vertical size={20} />
          <Image
            //   source={require('../../assets/icon/logo.png')}
            source={{uri: userData?.companyDetail?.company_logo}}
            //   style={{height: 100, width: 100, alignSelf: 'center'}}
            style={{
              height: 50,
              width: Dimensions.get('screen').width / 2,
              alignSelf: 'center',
            }}
          />
          <Formik
            enableReinitialize={true}
            initialValues={{}}
            onSubmit={(values, {setSubmitting, setErrors, resetForm}) => {
              setSubmitting(true);

              if (code === authData.otp) {
                if (authData.type === 'Login') {
                  const payload = new FormData();
                  payload.append('customer_user_name', authData.mobileNumber);
                  payload.append('customer_password', authData.otp);
                  login_verify(payload)
                    .then(res => {
                      Object.entries(res?.login).map((item, index) => {
                        console.log(item);
                        // if (index === 1) {
                        AsyncStorage.setItem(
                          'userData',
                          JSON.stringify(item[1]),
                        );
                        dispatch(authToken(true));
                        dispatch(verifiedUserData(item[1]));
                        setSubmitting(false);
                        // }
                      });
                    })
                    .catch(err => {
                      setSubmitting(false);
                      console.log('err', err);
                    });
                } else {
                  const payload = new FormData();
                  payload.append('customer_first_name', authData.fullName);
                  payload.append('customer_mobile_no', authData.mobileNumber);
                  signUp(payload)
                    .then(res => {
                      console.log('res', res);
                      Object.entries(res?.signup).map((item, index) => {
                        console.log('item', item[1].customer_first_name);
                        //   if (index === 1) {
                        AsyncStorage.setItem(
                          'userData',
                          JSON.stringify(item[1]),
                        );
                        dispatch(authToken(true));
                        dispatch(verifiedUserData(item[1]));
                        setSubmitting(false);
                        //   }
                      });
                      // dispatch(authToken(true));
                    })
                    .catch(err => {
                      // dispatch(authToken(true));
                      setSubmitting(false);
                      console.log('err', err);
                    });
                }
              } else {
                setLoading(false);
                console.log('entet else');
                setErrMsg('Wrong OTP');
                setSubmitting(false);
              }
            }}
            // validationSchema={LogInSchema()}
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
              <View style={{marginHorizontal: 29}}>
                <Vertical size={25} />

                <Text style={styles?.title}>{'Enter OTP'}</Text>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <Text
                    style={[styles?.title, {fontSize: FontSize.font_small_E}]}>
                    OTP has been send to
                    <Text
                      style={[
                        styles?.title,
                        {
                          fontSize: FontSize.font_small_E,
                          color: color.palette.black,
                        },
                      ]}>
                      {' '}
                      {authData.mobileNumber}
                    </Text>
                  </Text>
                  <Pressable
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    <Image
                      source={require('../../assets/icon/edit.png')}
                      style={{height: 20, width: 20, bottom: 5, marginLeft: 11}}
                    />
                  </Pressable>
                </View>
                <Vertical size={25} />
                <OtpInput
                  ref={otpRef}
                  callbackOnInput={(ready, value) => {
                    setCode(value);
                    setErrMsg(null);
                  }}
                  error={errMsg}
                  pinCount={4}
                  style={styles.otp}
                  errorStyle={styles.otpErrorStyle}
                />
                {showTimer ? (
                  <Timer timer={1} setShowTimer={setShowTimer} />
                ) : (
                  <Text
                    onPress={() => {
                      resendOtp();
                    }}
                    style={styles.otpText}>
                    Resend OTP
                  </Text>
                )}
                <Button
                  title={'SUBMIT'}
                  style={styles.button}
                  //   onPress={() => {
                  //     otpSubmit();
                  //   }}
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
  title: {
    color: color.palette.textColor,
    fontFamily: typography.medium,
    fontSize: FontSize.font_extra_medium_O,
    // textAlign: 'center',
  },

  button: {
    // marginTop: 42,
    height: 46,
    marginBottom: 40,
    marginTop: 96,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
    // color: color.palette.black,
  },
  btnTxt: {
    fontSize: FontSize.font_extra_medium_O,
    color: color.palette.white,
  },
  otp: {
    // marginVertical: 10,
    // backgroundColor: 'red',
    // marginHorizontal: 18,
    // paddingHorizontal: spacing[1],
    // marginLeft: 53,
    // marginRight: 59,
    // textAlign: 'center',
  },
  otpErrorStyle: {
    // paddingTop: 30,
    marginLeft: 20,
    textAlign: 'center',
    fontFamily: typography.Rubik_primary,
    color: color.palette.danger,

    // flex: 1,
    // backgroundColor: 'red',
  },
  otpText: {
    color: color.palette.textColor,
    fontFamily: typography.medium,
    fontSize: FontSize.font_medium_E,
    textAlign: 'center',
    marginTop: 30,
  },
});
