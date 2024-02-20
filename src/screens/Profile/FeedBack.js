import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import {useSelector} from 'react-redux';
import {CommonHeader} from '../../components';
import {FontSize, color, typography} from '../../theme';
import {Button, Divider, TextField, Vertical} from '../../ui-kit';
import {feedbackSchema} from '../../utils/schema';

export const FeedBack = () => {
  const userData = useSelector(state => state.auth);
  const navigation = useNavigation();
  return (
    <View style={styles.body}>
      {/* <View style={{height: 55}}>
        <View style={styles.headerView}>
          <View style={styles.headerInnView}>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Image
                  source={require('../../assets/icon/left.png')}
                  style={styles.backArrow}
                />
              </Pressable>
              <Text style={styles.title}>Feedback</Text>
            </View>
          </View>
        </View>
        <Divider />
      </View> */}
      <CommonHeader title={'Feedback'} />
      <ScrollView>
        <View style={{marginHorizontal: 15}}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              full_name: '',
              mobile_number: '',
              emailId: '',
              feedback: '',
            }}
            onSubmit={(values, {setSubmitting, setErrors, resetForm}) => {
              setSubmitting(true);

              // navigation?.navigate(Routes.CONFIRM_ORDER);

              Linking.openURL(
                `mailto:${userData?.companyDetail?.company_contact_email}?subject=Customer Feedback&body=Full Name:${values.full_name}%0APhone Number:${values.mobile_number}%0AEmail:${values.emailId}%0AFeedback:${values.feedback}`,
              );
              setSubmitting(false);
              navigation.goBack();
            }}
            validationSchema={feedbackSchema()}
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
              handleSubmit,
              setFieldValue,
              ...restProps
            }) => (
              <>
                <Vertical size={17} />
                <TextField
                  value={values.full_name}
                  label="Full Name"
                  labelStyle={{
                    color: color.palette.textFieldGrey,
                    fontFamily: typography.medium,
                  }}
                  onChangeText={text => {
                    // if (numberValidation.test(text)) {
                    setFieldValue('full_name', text);
                    // }
                  }}
                  onBlur={handleBlur('full_name')}
                  // errorMessage={touched.emailId && errors.emailId}
                  placeholder={'Enter your name'}
                  placeholderStyle={color.palette.black}
                  inputStyle={styles.inputStyle}
                  containerStyle={{
                    // backgroundColor: color.palette.red,
                    height: 55,
                  }}
                  //   keyboardType={'numeric'}
                  required
                  forwardedRef={ref => {
                    // setAlterMobRef(ref);
                  }}
                  onSubmitEditing={() => {
                    // emailRef.focus();
                  }}
                />
                {touched.full_name && errors.full_name ? (
                  <Text style={styles.errMsgTxt}>
                    {touched.full_name && errors.full_name}
                  </Text>
                ) : null}
                <Vertical size={20} />
                <TextField
                  value={values.mobile_number}
                  label="Phone Number"
                  labelStyle={{
                    color: color.palette.textFieldGrey,
                    fontFamily: typography.medium,
                  }}
                  onChangeText={text => {
                    // if (numberValidation.test(text)) {
                    setFieldValue('mobile_number', text);
                    // }
                  }}
                  onBlur={handleBlur('mobile_number')}
                  // errorMessage={touched.emailId && errors.emailId}
                  placeholder={'Enter your phone number'}
                  placeholderStyle={color.palette.black}
                  inputStyle={styles.inputStyle}
                  containerStyle={{
                    // backgroundColor: color.palette.red,
                    height: 55,
                  }}
                  //   keyboardType={'numeric'}
                  required
                  forwardedRef={ref => {
                    // setAlterMobRef(ref);
                  }}
                  onSubmitEditing={() => {
                    // emailRef.focus();
                  }}
                />
                {touched.mobile_number && errors.mobile_number ? (
                  <Text style={styles.errMsgTxt}>
                    {touched.mobile_number && errors.mobile_number}
                  </Text>
                ) : null}
                <Vertical size={20} />
                <TextField
                  value={values.emailId}
                  label="Email"
                  labelStyle={{
                    color: color.palette.textFieldGrey,
                    fontFamily: typography.medium,
                  }}
                  onChangeText={text => {
                    // if (numberValidation.test(text)) {
                    setFieldValue('emailId', text);
                    // }
                  }}
                  onBlur={handleBlur('emailId')}
                  // errorMessage={touched.emailId && errors.emailId}
                  placeholder={'Enter your email id'}
                  placeholderStyle={color.palette.black}
                  inputStyle={styles.inputStyle}
                  containerStyle={{
                    // backgroundColor: color.palette.red,
                    height: 55,
                  }}
                  //   keyboardType={'numeric'}
                  required
                  forwardedRef={ref => {
                    // setAlterMobRef(ref);
                  }}
                  onSubmitEditing={() => {
                    // emailRef.focus();
                  }}
                />
                {touched.emailId && errors.emailId ? (
                  <Text style={styles.errMsgTxt}>
                    {touched.emailId && errors.emailId}
                  </Text>
                ) : null}
                <Vertical size={20} />

                <TextField
                  value={values.feedback}
                  onChangeText={text => {
                    setFieldValue('feedback', text);
                  }}
                  onBlur={handleBlur('feedback')}
                  label="Your feedback"
                  labelStyle={{
                    color: color.palette.textFieldGrey,
                    fontFamily: typography.medium,
                  }}
                  // errorMessage={touched.Address && errors.Address}
                  placeholder={'Enter your feedback....'}
                  placeholderStyle={color.palette.black}
                  inputStyle={[
                    styles.inputStyle,
                    {textAlignVertical: 'top', paddingVertical: 10},
                  ]}
                  containerStyle={{
                    height: 150,
                  }}
                  required
                  multiline={true}
                  numberOfLines={8}
                  forwardedRef={ref => {
                    // setAddresRef(ref);
                  }}
                  onSubmitEditing={() => {
                    // streetRef.focus();
                  }}
                />
                {touched.feedback && errors.feedback ? (
                  <Text style={styles.errMsgTxt}>
                    {touched.feedback && errors.feedback}
                  </Text>
                ) : null}
                <Vertical size={17} />

                <Button
                  title={'Send'}
                  style={styles.button}
                  textStyle={styles.btnTxt}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  //   disabled={!restProps.isValid}
                />
                <Vertical size={30} />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 13,
  },
  backArrow: {height: 24, width: 24},
  title: {
    fontFamily: typography.semiBold,
    color: color.palette.black,
    fontSize: FontSize.font_large_E,
    marginLeft: 20,
  },
  headerInnView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
    backgroundColor: color.palette.white,
  },
  button: {
    backgroundColor: color.palette.btnColor,
    height: 50,
    borderRadius: 5,
  },
  btnTxt: {
    fontSize: FontSize.font_small_E,
    fontFamily: typography.Rubik_tertiary,
    lineHeight: 14,
    letterSpacing: 0.2,
    color: color.palette.white,
  },
  errMsgTxt: {
    top: 10,
    // marginTop: 12,
    fontSize: FontSize.font_small_O,
    fontFamily: typography.Rubik_primary,
    color: color.palette.danger,
  },
});
