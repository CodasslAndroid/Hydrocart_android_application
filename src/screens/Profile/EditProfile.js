import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CommonHeader} from '../../components';
import {Routes} from '../../navigation';
import {authToken, verifiedUserData} from '../../redux/slices/authSlice';
import {deleteAccountApi, getProfile, setProfile} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import {Button, Divider, Loader, TextField, Vertical} from '../../ui-kit';
import {DatePickers} from '../../ui-kit/date-picker';
import {Select} from '../../ui-kit/select';
import {profileSchema} from '../../utils/schema';

export const EditProfile = ({route}) => {
  const {images = null} = route?.params ?? {};
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth);
  const [showDel, setShowDel] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [profileLoad, setProfileLoad] = useState(false);
  const [profileData, setProfileData] = useState();
  const [ind_date, setIndexDate] = useState();
  const [delLoad, setDelLoad] = useState(false);

  useEffect(() => {
    setProfileLoad(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    getProfile(payload)
      .then(res => {
        setProfileLoad(false);
        setProfileData(res?.customer_profile[0]);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [userData?.userData?.customer_ref_no]);

  const handleDelAccount = () => {
    setDelLoad(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    deleteAccountApi(payload)
      .then(async res => {
        setDelLoad(false);
        if (res?.response === 'success') {
          await AsyncStorage.removeItem('userData');
          dispatch(authToken(null));
          dispatch(verifiedUserData(null));
          setDelModal(false);
        }
      })
      .catch(err => {
        setDelLoad(false);
      });
  };

  return (
    <View style={{backgroundColor: color.palette.white, flex: 1}}>
      <CommonHeader
        title={'Edit Profile'}
        settingIcon={true}
        setDelModal={setDelModal}
      />
      <Divider />
      <Vertical size={17} />

      {images ? (
        <Image
          source={{uri: images[0]?.media?.uri}}
          style={styles.profile_image}
        />
      ) : (
        <Image
          source={
            profileData?.customer_profile_image
              ? {uri: `${profileData?.customer_profile_image}?${new Date()}`}
              : require('../../assets/icon/profileIcon.png')
          }
          style={[styles.profile_image, {backgroundColor: color.palette.grey}]}
        />
      )}

      <View style={styles.editIcon}>
        <TouchableOpacity
          onPress={() => {
            navigation?.navigate(Routes?.LAUNCH_CAMERA_MODAL, {
              source: Routes?.EDITPROFILE,
            });
          }}>
          <View
            style={{
              backgroundColor: color.palette.disableColor,
              padding: 8,
              borderRadius: 30,
            }}>
            <Image
              source={require('../../assets/icon/edit1.png')}
              style={{
                width: 18,
                height: 19,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>

      <Vertical size={25} />
      {!profileLoad ? (
        <ScrollView>
          <View style={{marginHorizontal: 20}}>
            <Formik
              enableReinitialize={true}
              initialValues={{
                first_name:
                  profileData?.customer_first_name !== ''
                    ? profileData?.customer_first_name
                    : '',
                last_name:
                  profileData?.customer_last_name !== ''
                    ? profileData?.customer_last_name
                    : '',
                mobile_number:
                  profileData?.customer_mobile_no !== ''
                    ? profileData?.customer_mobile_no
                    : '',
                emailId:
                  profileData?.customer_email_id !== ''
                    ? profileData?.customer_email_id
                    : '',
                dob:
                  profileData?.customer_dateofbirth !== '0000-00-00'
                    ? profileData?.customer_dateofbirth
                    : '',
                gender:
                  profileData?.customer_gender !== ''
                    ? profileData?.customer_gender
                    : '',
              }}
              onSubmit={(values, {setSubmitting, setErrors, resetForm}) => {
                setSubmitting(true);
                const payload = new FormData();
                payload.append(
                  'customer_ref_no',
                  userData?.userData?.customer_ref_no,
                );
                payload.append('customer_first_name', values.first_name);
                payload.append('customer_last_name', values.last_name);
                payload.append('customer_gender', values.gender);
                payload.append('customer_dateofbirth', values.dob);
                // payload.append("customer_profile_image",)

                if (images?.length) {
                  images.map((item, index) => {
                    payload.append('customer_profile_image', {
                      uri: item?.media?.uri,
                      type: item?.media?.type,
                      name: item?.media?.fileName ?? item?.media?.name,
                    });
                  });
                } else {
                  payload.append('profile_image', '');
                }

                console.log('payload', payload);
                setProfile(payload)
                  .then(res => {
                    console.log('res', res);
                    setSubmitting(false);
                    // navigation.goBack();
                    navigation.navigate(Routes.MANAGE_ACCOUNT, {
                      flag: Math.random(),
                    });
                  })
                  .catch(err => {
                    console.log('err', err);
                    setSubmitting(false);
                  });
              }}
              validationSchema={profileSchema()}
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
                  <TextField
                    value={values.first_name}
                    onChangeText={text => {
                      setFieldValue('first_name', text);
                    }}
                    onBlur={handleBlur('first_name')}
                    // errorMessage={touched.Street && errors.Street}
                    placeholder={'Enter your first name'}
                    label="First Name"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    placeholderStyle={color.palette.black}
                    inputStyle={styles.inputStyle}
                    containerStyle={{
                      height: 55,
                    }}
                    required
                    forwardedRef={ref => {
                      // setStreetRef(ref);
                    }}
                    onSubmitEditing={() => {
                      // pincodeRef?.focus();
                    }}
                  />
                  {touched.first_name && errors.first_name ? (
                    <Text style={styles.errMsgTxt}>
                      {touched.first_name && errors.first_name}
                    </Text>
                  ) : null}

                  <Vertical size={17} />

                  <TextField
                    value={values.last_name}
                    onChangeText={text => {
                      setFieldValue('last_name', text);
                    }}
                    onBlur={handleBlur('last_name')}
                    // errorMessage={touched.Street && errors.Street}
                    placeholder={'Enter your last name'}
                    label="Last Name"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    placeholderStyle={color.palette.black}
                    inputStyle={styles.inputStyle}
                    containerStyle={{
                      height: 55,
                    }}
                    required
                    forwardedRef={ref => {
                      // setStreetRef(ref);
                    }}
                    onSubmitEditing={() => {
                      // pincodeRef?.focus();
                    }}
                  />
                  {touched.last_name && errors.last_name ? (
                    <Text style={styles.errMsgTxt}>
                      {touched.last_name && errors.last_name}
                    </Text>
                  ) : null}

                  <Vertical size={17} />

                  <TextField
                    value={values.mobile_number}
                    onChangeText={text => {
                      setFieldValue('mobile_number', text);
                    }}
                    onBlur={handleBlur('mobile_number')}
                    // errorMessage={touched.Street && errors.Street}
                    placeholder={'Enter your mobile number'}
                    label="Mobile Number"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    placeholderStyle={color.palette.black}
                    inputStyle={styles.inputStyle}
                    containerStyle={{
                      height: 55,
                    }}
                    disabled
                    required
                    forwardedRef={ref => {
                      // setStreetRef(ref);
                    }}
                    onSubmitEditing={() => {
                      // pincodeRef?.focus();
                    }}
                  />
                  {touched.mobile_number && errors.mobile_number ? (
                    <Text style={styles.errMsgTxt}>
                      {touched.mobile_number && errors.mobile_number}
                    </Text>
                  ) : null}

                  <Vertical size={17} />
                  {/* <TextField
                    value={values.emailId}
                    onChangeText={text => {
                      setFieldValue('emailId', text);
                    }}
                    onBlur={handleBlur('emailId')}
                    // errorMessage={touched.Street && errors.Street}
                    placeholder={'Enter your email id'}
                    label="Email"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    placeholderStyle={color.palette.black}
                    inputStyle={styles.inputStyle}
                    containerStyle={{
                      height: 55,
                    }}
                    required
                    forwardedRef={ref => {
                      // setStreetRef(ref);
                    }}
                    onSubmitEditing={() => {
                      // pincodeRef?.focus();
                    }}
                  />
                  {touched.emailId && errors.emailId ? (
                    <Text style={styles.errMsgTxt}>
                      {touched.emailId && errors.emailId}
                    </Text>
                  ) : null}

                  <Vertical size={17} /> */}

                  {/* <Vertical size={17} /> */}
                  <Select
                    options={['Male', 'Female', 'Others']}
                    value={values?.gender}
                    onPress={(value, index) => {
                      setFieldValue('gender', value);
                    }}
                    inputStyle={[
                      styles.inputStyle,
                      {paddingLeft: 10, height: 40},
                    ]}
                    textStyle={{
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_large_E,
                    }}
                    label="Gender"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    //   variant={'underline'}
                    // placeholder="state *"
                    placeholderStyle={{
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_extra_medium_O,
                      color: color.palette.black,
                    }}
                  />
                  {touched.gender && errors.gender ? (
                    <Text style={styles.errMsgTxt}>
                      {touched.gender && errors.gender}
                    </Text>
                  ) : null}

                  <Vertical size={17} />
                  {/* <View style={styles.rowView}> */}
                  <Text
                    style={{
                      fontSize: FontSize.font_extra_medium_E,
                      color: color.palette.textFieldGrey,
                      fontFamily: typography.primary,
                    }}>
                    Birthday
                  </Text>

                  {/* <DatePickers
                    variant={'underline'}
                    value={values.dob}
                    placeholder="adsds"
                    maxDate={moment()?.subtract(10, 'years').toDate()}
                    inputStyle={[styles.dateView]}
                    textStyle={{fontFamily: typography.secondary}}
                    onDatePress={value => {
                      setIndexDate(0);
                    }}
                    index={ind_date}
                    onPress={(date, bool, source, index) => {
                      if (index === 0) {
                        // sets_date(date);
                        setFieldValue('dob', moment(date).format('YYYY-MM-DD'));
                      }
                    }}
                    errorMessage={touched.dob && errors.dob}
                    source={'sDate'}
                    miniDate={moment()?.subtract(50, 'years').toDate()}
                    // icon={require('../../assets/icons/dateIcon.png')}
                  /> */}
                  <DatePickers
                    // variant={'underline'}
                    value={values.dob}
                    maxDate={moment()?.subtract(10, 'years').toDate()}
                    inputStyle={[
                      {
                        paddingLeft: 5,
                        height: 36,
                        borderRadius: 5,
                        flex: 0,
                        fontSize: FontSize.font_medium_E,
                        color: color.palette.black,

                        lineHeight: 14,
                        // borderBottomWidth: 1,
                        borderColor: color.palette.grey,
                        borderWidth: 1,
                      },
                    ]}
                    textStyle={{fontFamily: typography.secondary}}
                    onDatePress={value => {
                      setIndexDate(0);
                    }}
                    index={ind_date}
                    onPress={(date, bool, source, index) => {
                      if (index === 0) {
                        // sets_date(date);
                        setFieldValue('dob', moment(date).format('YYYY-MM-DD'));
                      }
                    }}
                    errorMessage={touched.startDate && errors.startDate}
                    source={'sDate'}
                    miniDate={moment()?.subtract(100, 'years').toDate()}
                    // icon={require('../../assets/icons/dateIcon.png')}
                  />
                  {/* </View> */}

                  <Vertical size={17} />
                  <Button
                    title={'Save'}
                    style={styles.button}
                    textStyle={styles.btnTxt}
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    // disabled={!restProps.isValid}
                  />
                  <Vertical size={30} />
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      ) : (
        <Loader />
      )}

      {delModal ? (
        <Modal
          transparent={true}
          visible={delModal}
          animationType="fade"
          style={{alignSelf: 'center'}}>
          <View style={styles.modalSheet}>
            <View style={styles.modalBack}>
              <Pressable
                onPress={() => {
                  setDelModal(!delModal);
                }}>
                <Image
                  source={require('../../assets/icon/b_close.png')}
                  style={styles.modalClose}
                />
              </Pressable>

              <Image
                source={require('../../assets/icon/deleteImg.png')}
                style={{width: 90, height: 72.32, alignSelf: 'center'}}
              />
              <Text style={styles.modalTxt}>
                Are you sure you want to proceed with deleting your account?
              </Text>
              <View style={styles.btnView}>
                <Button
                  variant="outline"
                  title="Cancel"
                  onPress={() => {
                    setDelModal(false);
                  }}
                  style={[
                    styles.button,
                    {
                      borderColor: color.palette.btnColor,
                      backgroundColor: color.palette.white,
                    },
                  ]}
                  textStyle={[styles.btnTxt, {color: color.palette.btnColor}]}
                />
                <Button
                  title="Delete"
                  loading={delLoad}
                  onPress={() => {
                    handleDelAccount();
                  }}
                  style={styles.button}
                  textStyle={styles.btnTxt}
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
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
  innrCardView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  titleTxt: {
    fontFamily: typography.semiBold,
    color: color.palette.black,
    fontSize: FontSize.font_large_E,
    marginLeft: 20,
  },

  modalTxt: {
    fontFamily: typography.semiBold,
    textAlign: 'center',
    color: color.palette.black,
    marginHorizontal: 16,
    marginTop: 15,
  },
  modalClose: {
    height: 25,
    width: 25,
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10,
    // tintColor: color.palette.btnColor,
  },
  modalSheet: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  button: {
    backgroundColor: color.palette.btnColor,
    borderRadius: 5,
    height: 35,
  },
  btnTxt: {
    fontSize: FontSize.font_small_E,
    fontFamily: typography.Rubik_tertiary,
    lineHeight: 14,
    letterSpacing: 0.2,
    color: color.palette.white,
  },
  modalBack: {
    backgroundColor: color.palette.white,
    marginHorizontal: 30,
    borderRadius: 10,
  },
  dateView: {
    paddingLeft: 5,
    height: 36,
    borderRadius: 5,
    flex: 0,
    fontSize: FontSize.font_small_E,
    color: color.palette.black,
    fontFamily: typography?.primary,
    lineHeight: 14,

    borderColor: color.palette.grey,
    borderWidth: 1,
  },
  inputStyle: {
    flex: 1,
    fontSize: FontSize.font_medium_E,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: color.palette.grey,
    color: color.palette.black,
  },
  errMsgTxt: {
    marginTop: 10,
    fontSize: FontSize.font_small_O,
    fontFamily: typography.Rubik_primary,
    color: color.palette.danger,
  },
  profile_image: {
    width: 127,
    height: 130,
    alignSelf: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: color.palette.white,
    // tintColor: color.palette.white,
  },
  editIcon: {
    height: 46,
    width: 46,
    borderRadius: 30,
    backgroundColor: color?.palette.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: Platform?.OS === 'android' ? 150 : 180,
    left: Dimensions?.get('window').width / 1.8,
    zIndex: 2,
  },
});
