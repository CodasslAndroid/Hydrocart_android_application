/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Routes} from '../../navigation';
import {setPassswordApi} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import {Button, TextField, Vertical} from '../../ui-kit';
import {ResetPasswordSchema} from '../../utils/schema';
import {useSelector} from 'react-redux';

const spaceValidation = new RegExp(/^[^ ]*$/);
export const PasswordReset = ({route}) => {
  const {phone_number} = route?.params ?? {};
  const navigation = useNavigation();
  const lang = useSelector(state => state.auth?.language);
  const [userNameFocus, setuserNameFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);

  return (
    <View>
      <Text>Hello</Text>
    </View>
    // <ImageBackground
    //   source={require('../../assets/icon/bg.png')}
    //   style={styles.bg}
    //   resizeMode="stretch">
    //   {/* <Image
    //     source={require('../../assets/icon/logo.png')}
    //     style={{height: 167, width: 167, alignSelf: 'center'}}
    //   /> */}
    //   <Formik
    //     enableReinitialize={true}
    //     initialValues={{
    //       password: '',
    //       confirm_password: '',
    //     }}
    //     onSubmit={(values, {setSubmitting, setErrors, resetForm}) => {
    //       setSubmitting(true);
    //       const payload = new FormData();
    //       payload.append('phone', phone_number);
    //       payload.append('password', values.password);
    //       setPassswordApi(payload)
    //         .then(res => {
    //           if (res?.data?.status) {
    //             navigation?.navigate(Routes.PASSWORDSUCCESS);
    //           }
    //         })
    //         .catch(err => {
    //           console.log('err', err);
    //         });
    //     }}
    //     validationSchema={ResetPasswordSchema(lang)}
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
    //           placeholder={lang?.AddPassword}
    //           containerStyle={{height: 48}}
    //           value={values.password}
    //           inputStyle={{
    //             paddingLeft: 11,
    //             borderColor: color.palette.btnColor,
    //             borderWidth: 1,
    //           }}
    //           onChangeText={text => {
    //             if (spaceValidation.test(text)) {
    //               setFieldValue('password', text);
    //             }
    //           }}
    //           handleFocus={() => {
    //             setuserNameFocus(true);
    //           }}
    //           onBlur={() => {
    //             setuserNameFocus(false);
    //             handleBlur('password');
    //           }}
    //           errorMessage={touched.password && errors.password}
    //         />

    //         <Vertical size={20} />
    //         <TextField
    //           errorStyleHeight={{height: 54}}
    //           value={values.confirm_password}
    //           style={styles.textField}
    //           placeholder={lang?.ConfirmPassword}
    //           containerStyle={{height: 48}}
    //           onChangeText={text => {
    //             if (spaceValidation.test(text)) {
    //               setFieldValue('confirm_password', text);
    //             }
    //           }}
    //           inputStyle={{
    //             paddingLeft: 11,
    //             borderColor: color.palette.btnColor,
    //             borderWidth: 1,
    //           }}
    //           secureTextEntry={secureEntry}
    //           handleFocus={() => {
    //             setPasswordFocus(true);
    //           }}
    //           onBlur={() => {
    //             setPasswordFocus(false);
    //             handleBlur('confirm_password');
    //           }}
    //           errorMessage={touched.confirm_password && errors.confirm_password}
    //         />

    //         <Button
    //           title={lang?.Submit?.toUpperCase()}
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
    fontSize: FontSize.font_medium_E,
    // lineHeight: 18,
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
  },
});
