/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Routes} from '../../navigation';
import {passwordResetApi} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import {Button, TextField, Vertical} from '../../ui-kit';
import {passwordResetRequestSchema} from '../../utils/schema';
import {useSelector} from 'react-redux';

const spaceValidation = new RegExp(/^[^ ]*$/);
export const ForgotPassword = () => {
  const navigation = useNavigation();
  const lang = useSelector(state => state.auth?.language);

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
    //       mobile_number: '',
    //     }}
    //     onSubmit={(values, {setSubmitting, setErrors, resetForm}) => {
    //       setSubmitting(true);
    //       let payload = new FormData();
    //       payload.append('phone', values.mobile_number);
    //       passwordResetApi(payload)
    //         .then(res => {
    //           if (res?.data?.status) {
    //             setSubmitting(false);
    //             navigation?.navigate(Routes?.PASSWORDRESET, {
    //               phoneNumber: values.mobile_number,
    //             });
    //           }
    //         })
    //         .catch(err => {
    //           setSubmitting(false);
    //           console.log('err', err);
    //         });
    //     }}
    //     validationSchema={passwordResetRequestSchema(lang)}
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
    //         <TextField
    //           errorStyleHeight={{height: 54}}
    //           style={styles.textField}
    //           placeholder={lang?.PleaseEnterYourMobileNumber}
    //           containerStyle={{height: 48}}
    //           value={values.mobile_number}
    //           inputStyle={{
    //             paddingLeft: 11,
    //             borderColor: color.palette.btnColor,
    //             borderWidth: 1,
    //           }}
    //           keyboardType="numeric"
    //           onChangeText={text => {
    //             if (spaceValidation.test(text)) {
    //               setFieldValue('mobile_number', text);
    //             }
    //           }}
    //           errorMessage={touched.mobile_number && errors.mobile_number}
    //         />
    //         <Vertical size={20} />
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
    fontSize: FontSize.font_very_large_E,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_extra_medium_O,
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
    marginTop: 42,
    height: 46,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnTxt: {
    fontSize: FontSize.font_extra_medium_O,
  },
  frgtpass: {
    textAlign: 'right',
    marginTop: 13,
    right: 12,
  },
});
