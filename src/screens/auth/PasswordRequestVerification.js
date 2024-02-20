/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Routes} from '../../navigation';
import {
  otpVerifyApi,
  passwordResetApi,
  resetpasswordInterval,
} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import {Button, TextField, Vertical} from '../../ui-kit';
import {LogInSchema, otpVerifySchema} from '../../utils/schema';
import Timer from '../../utils/timer';
import Toast from 'react-native-simple-toast';
import {useSelector} from 'react-redux';

const spaceValidation = new RegExp(/^[^ ]*$/);
export const PasswordRequestVerification = ({route}) => {
  const {phoneNumber} = route?.params ?? {};
  const navigation = useNavigation();
  const lang = useSelector(state => state.auth?.language);
  const languageName = useSelector(state => state.auth?.languageName);
  const [interval, setInterval] = useState();
  const [timer, setTimer] = useState(true);

  useEffect(() => {
    resetpasswordInterval()
      .then(res => {
        setInterval(res?.data?.interval);
      })
      .catch(err => {
        console.log('error', err);
      });
  }, []);

  return (
    <View>
      <Text>Hello</Text>
    </View>
    // <ImageBackground
    //   source={require('../../assets/icon/bg.png')}
    //   style={styles.bg}
    //   resizeMode="stretch">
    //   <Image
    //     source={require('../../assets/icon/logo.png')}
    //     style={{height: 167, width: 167, alignSelf: 'center'}}
    //   />
    //   <Formik
    //     enableReinitialize={true}
    //     initialValues={{
    //       otp: '',
    //     }}
    //     onSubmit={(values, {setSubmitting, setErrors, resetForm}) => {
    //       setSubmitting(true);
    //       let payload = new FormData();
    //       payload.append('phone', phoneNumber);
    //       payload.append('otp', values.otp);
    //       otpVerifyApi(payload)
    //         .then(res => {
    //           if (res?.data?.status) {
    //             setSubmitting(true);
    //             navigation?.navigate(Routes?.PASSWORDCHANGE, {
    //               phone_number: phoneNumber,
    //             });
    //           } else {
    //             setSubmitting(false);
    //             languageName === 'HINDI'
    //               ? Toast.show(res?.data?.message_hindi, Toast.LONG)
    //               : Toast.show(res?.data?.message, Toast.LONG);
    //           }
    //         })
    //         .catch(err => {
    //           console.log('err', err);
    //         });
    //     }}
    //     validationSchema={otpVerifySchema(lang)}
    //     validateOnChange={true}
    //     validateOnBlur={true}
    //     validateOnMount={true}>
    //     {({
    //       handleChange,
    //       values,
    //       isSubmitting,
    //       errors,
    //       touched,
    //       handleBlur,
    //       setErrors,
    //       setTouched,
    //       setFieldValue,
    //       handleSubmit,
    //       resetForm,
    //       setStatus,
    //       initialValues,
    //       ...restProps
    //     }) => (
    //       <View style={{marginHorizontal: 29}}>
    //         <Vertical size={25} />
    //         <Text style={styles?.title}>{lang?.PasswordResetRequest}</Text>
    //         <Vertical size={25} />
    //         <Text style={styles?.subTitle}>
    //           {lang?.AnOtpHasBeenSentToYourMobileNumber_PleaseFillItBelow}
    //         </Text>
    //         <Vertical size={12} />
    //         <TextField
    //           errorStyleHeight={{height: 54}}
    //           style={styles.textField}
    //           placeholder={lang?.PleaseEnterTheOtp}
    //           containerStyle={{height: 48}}
    //           value={values.otp}
    //           inputStyle={{
    //             paddingLeft: 11,
    //             borderColor: color.palette.btnColor,
    //             borderWidth: 1,
    //           }}
    //           keyboardType="numeric"
    //           onChangeText={text => {
    //             if (spaceValidation.test(text)) {
    //               setFieldValue('otp', text);
    //             }
    //           }}
    //           errorMessage={touched.otp && errors.otp}
    //         />
    //         {/* <Vertical size={20} /> */}
    //         {timer ? (
    //           <Timer
    //             timer={`0${interval}`}
    //             // timer={'0.59'}
    //             title={lang?.ResendOtpIn}
    //             setShowTimer={setTimer}
    //           />
    //         ) : (
    //           <Pressable
    //             onPress={() => {
    //               setTimer(true);
    //               let payload = new FormData();
    //               payload.append('phone', phoneNumber);

    //               passwordResetApi(payload)
    //                 .then(res => {
    //                   //   if (res?.data?.status) {
    //                   //     navigation?.navigate(Routes?.PASSWORDRESET, {
    //                   //       phoneNumber: values.mobile_number,
    //                   //     });
    //                   //   }
    //                 })
    //                 .catch(err => {
    //                   console.log('err', err);
    //                 });
    //             }}>
    //             <Text style={styles.frgtpass}>{lang?.ResendOTP}</Text>
    //           </Pressable>
    //         )}

    //         <Button
    //           title={lang?.Submit.toUpperCase()}
    //           style={styles.button}
    //           onPress={handleSubmit}
    //           loading={isSubmitting}
    //           textStyle={styles.btnTxt}
    //         />
    //       </View>
    //     )}
    //   </Formik>
    // </ImageBackground>
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
    color: color.palette.blue,
    fontFamily: typography.secondary,
    fontSize: FontSize.font_double_large_E,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_medium_E,
    lineHeight: 18,
    color: color.palette.txtBlack,
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
    marginTop: 42,
    height: 46,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
    // color: color.palette.black,
  },
  btnTxt: {
    fontSize: FontSize.font_extra_medium_O,
  },
  frgtpass: {
    textAlign: 'right',
    marginTop: 8,
    fontSize: FontSize.font_extra_small_E,
    right: 12,
    color: color.palette.btnColor,
    textDecorationLine: 'underline',
    fontFamily: typography.secondary,
  },
});
