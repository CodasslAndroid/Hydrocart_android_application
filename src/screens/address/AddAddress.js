import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {CommonHeader} from '../../components';
import {Routes} from '../../navigation';
import {
  addAddressApi,
  editAddress,
  getCityList,
  getPincodeAddress,
  getStateList,
  getTypeList,
} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import {Button, Divider, Loader, TextField, Vertical} from '../../ui-kit';
import {Select} from '../../ui-kit/select';
import {addressSchema} from '../../utils/schema';

const numberValidation = new RegExp(/^[0-9]{1,10}$/);
export const AddAddress = () => {
  const userData = useSelector(state => state.auth);
  const addressData = useSelector(state => state.dash);
  const navigation = useNavigation();
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [stateLoad, setStateLoad] = useState(true);
  const [pincodeList, setPincodeList] = useState([]);

  const [pincodeLoad, setPincodeLoad] = useState(false);

  useEffect(() => {
    setStateLoad(true);
    setPincodeList([]);
    getPincodeAddress()
      .then(res => {
        res?.pincode?.map((item, index) => {
          let data = item;
          data[
            'district_name'
          ] = `${item?.pincode} (${item?.location}, ${item?.district})`;
          setPincodeList(pincodeList => [...pincodeList, item]);
        });
      })
      .catch(err => {
        console.log('pincode err', err);
      });
    getTypeList()
      .then(res => {
        setTypeList(res?.address_type);
      })
      .catch(err => {});
    const payload = new FormData();
    payload.append('country_id', 1);
    getStateList(payload)
      .then(res => {
        setStateLoad(false);
        setStateList(res?.state);
        const data = new FormData();
        data.append('country_id', 1);
        data.append('state_id', res?.state[0]?.state_id);
        getCityList(data)
          .then(res => {
            console.log('res', res);
            setCityList(res?.district);
          })
          .catch(err => {
            console.log('err', err);
          });
      })
      .catch(err => {
        console.log('err', err);
        setStateLoad(false);
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.palette.white,
      }}>
      <CommonHeader title={'Enter Your Address'} />
      {stateLoad ? (
        <Loader />
      ) : (
        <ScrollView>
          <View style={{marginHorizontal: 15}}>
            <Formik
              enableReinitialize={true}
              initialValues={{
                full_name: addressData?.addressDetail?.customer_firstname ?? '',
                mobile_number:
                  addressData?.addressDetail?.customer_mobile_no ?? '',
                // houseno: '6/3',
                address:
                  addressData?.addressDetail?.customer_address_line_1 ?? '',
                address2:
                  addressData?.addressDetail?.customer_address_line_2 ?? '',
                landmark: addressData?.addressDetail?.customer_landmark ?? '',
                city: addressData?.addressDetail?.customer_city ?? '',
                state:
                  addressData?.addressDetail?.state_name ??
                  stateList[0]?.state_name,
                stateId:
                  addressData?.addressDetail?.state_id ??
                  stateList[0]?.state_id,
                district: addressData?.addressDetail?.district_name ?? '',
                districtId: addressData?.addressDetail?.district_id ?? '',
                pincode: addressData?.addressDetail?.pincode ?? '',
                country: addressData?.addressDetail?.country_name ?? 'India',
                countryId: addressData?.addressDetail?.country_id ?? 1,
                type:
                  addressData?.addressDetail?.customer_address_type_name ?? '',
                typeId: addressData?.addressDetail?.customer_address_type ?? '',
                gstNo: addressData?.addressDetail?.gst ?? '',
              }}
              onSubmit={(values, {setSubmitting, setErrors, resetForm}) => {
                setSubmitting(true);
                if (addressData?.addressDetail) {
                  const payload = new FormData();
                  payload.append('customer_firstname', values.full_name);
                  payload.append('customer_mobile_no', values.mobile_number);
                  payload.append('customer_address_line_1', values.address);
                  if (values.address2 !== '') {
                    payload.append('customer_address_line_2', values.address2);
                  }
                  if (values.gstNo !== '') {
                    payload.append('gst', values.gstNo);
                  }
                  payload.append('customer_address_type', values.typeId);
                  payload.append('customer_landmark', values.landmark);
                  payload.append('customer_city', values.city);
                  payload.append('country_id', values.countryId);
                  payload.append('state_id', values.stateId);
                  payload.append('district_id', values.districtId);

                  payload.append('pincode', values.pincode);
                  payload.append(
                    'customer_address_id',
                    addressData?.addressDetail?.customer_address_id,
                  );
                  payload.append(
                    'customer_ref_no',
                    userData?.userData?.customer_ref_no,
                  );

                  editAddress(payload)
                    .then(res => {
                      setSubmitting(false);
                      if (res?.response === 'success') {
                        navigation.navigate(Routes.ADDRESS_LIST, {
                          refresh: Math.random(),
                        });
                      }
                    })
                    .catch(err => {
                      setSubmitting(false);
                      console.log('err', err);
                    });
                } else {
                  const payload = new FormData();
                  payload.append('customer_firstname', values.full_name);
                  payload.append('customer_mobile_no', values.mobile_number);
                  payload.append('customer_address_line_1', values.address);
                  if (values.address2 !== '') {
                    payload.append('customer_address_line_2', values.address2);
                  }
                  if (values.gstNo !== '') {
                    payload.append('gst', values.gstNo);
                  }
                  payload.append('customer_address_type', values.typeId);
                  payload.append('customer_landmark', values.landmark);
                  payload.append('customer_city', values.city);
                  payload.append('country_id', values.countryId);
                  payload.append('state_id', values.stateId);
                  payload.append('district_id', values.districtId);
                  payload.append('pincode', values.pincode);
                  payload.append(
                    'customer_ref_no',
                    userData?.userData?.customer_ref_no,
                  );

                  console.log('payload', payload);
                  addAddressApi(payload)
                    .then(res => {
                      setSubmitting(false);
                      if (res?.response === 'success') {
                        navigation.navigate(Routes.ADDRESS_LIST, {
                          refresh: Math.random(),
                        });
                      }
                    })
                    .catch(err => {
                      setSubmitting(false);
                      console.log('err', err);
                    });
                }
                // navigation?.navigate(Routes.CONFIRM_ORDER);
              }}
              validationSchema={addressSchema()}
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
                    labelStyle={{color: color.palette.textFieldGrey}}
                    onChangeText={text => {
                      // if (numberValidation.test(text)) {
                      setFieldValue('full_name', text);
                      // }
                    }}
                    onBlur={handleBlur('full_name')}
                    // errorMessage={touched.emailId && errors.emailId}
                    placeholder={'Enter your name (required)'}
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
                  <Vertical size={17} />

                  <TextField
                    value={values.mobile_number}
                    label="Mobile Number"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    onChangeText={text => {
                      if (numberValidation.test(text)) {
                        setFieldValue('mobile_number', text);
                      }
                    }}
                    onBlur={handleBlur('mobile_number')}
                    // errorMessage={touched.emailId && errors.emailId}
                    placeholder={'Enter your mobilenumber (required)'}
                    placeholderStyle={color.palette.black}
                    inputStyle={styles.inputStyle}
                    containerStyle={{
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
                  <Vertical size={17} />

                  <TextField
                    value={values.address}
                    onChangeText={text => {
                      setFieldValue('address', text);
                    }}
                    onBlur={handleBlur('address')}
                    label="Area name / Street name"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    // errorMessage={touched.Address && errors.Address}
                    placeholder={'Enter your address (required)'}
                    placeholderStyle={color.palette.black}
                    inputStyle={[
                      styles.inputStyle,
                      {textAlignVertical: 'top', paddingVertical: 10},
                    ]}
                    containerStyle={{
                      height: 100,
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
                  {touched.address && errors.address ? (
                    <Text style={styles.errMsgTxt}>
                      {touched.address && errors.address}
                    </Text>
                  ) : null}
                  <Vertical size={17} />

                  <TextField
                    value={values.address2}
                    onChangeText={text => {
                      setFieldValue('address2', text);
                    }}
                    onBlur={handleBlur('address2')}
                    label="Address 2"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    // errorMessage={touched.Address && errors.Address}
                    placeholder={'Enter your address (Optional)'}
                    placeholderStyle={color.palette.black}
                    inputStyle={[
                      styles.inputStyle,
                      {textAlignVertical: 'top', paddingVertical: 10},
                    ]}
                    containerStyle={{
                      height: 100,
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

                  <Vertical size={17} />

                  <TextField
                    value={values.landmark}
                    onChangeText={text => {
                      setFieldValue('landmark', text);
                    }}
                    onBlur={handleBlur('landmark')}
                    // errorMessage={touched.Street && errors.Street}
                    placeholder={'Enter your landmark (required)'}
                    label="Landmark"
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
                  {touched.landmark && errors.landmark ? (
                    <Text style={styles.errMsgTxt}>
                      {touched.landmark && errors.landmark}
                    </Text>
                  ) : null}

                  <Vertical size={17} />

                  <Select
                    options={pincodeList}
                    value={values?.pincode}
                    onPress={(value, index) => {
                      // console.log('value', value);
                      // setselectedState(value?.state);
                      // setState(value?.state);
                      //   setFieldValue('district', value?.district_name);
                      //   setFieldValue('districtId', value?.district_id);

                      setFieldValue('city', value?.location);
                      setFieldValue('pincode', value?.pincode);

                      setFieldValue('state', value?.state_code);
                      setFieldValue('stateId', value?.state_id);

                      setFieldValue('district', value?.district);
                      setFieldValue('districtId', value?.district_id);

                      setFieldValue('country', value?.country_code);
                      setFieldValue('countryId', value?.country_id);
                    }}
                    inputStyle={[
                      styles.inputStyle,
                      {paddingLeft: 10, height: 40},
                    ]}
                    textStyle={{
                      fontFamily: typography.Rubik_primary,
                      fontSize: FontSize.font_large_E,
                    }}
                    label="Pincode"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    //   variant={'underline'}
                    //   placeholder="state *"
                    placeholderStyle={{
                      fontFamily: typography.Rubik_primary,
                      fontSize: FontSize.font_extra_medium_O,
                      color: color.palette.black,
                    }}
                  />
                  {touched.pincode && errors.pincode ? (
                    <Text style={styles.errMsgTxt}>
                      {touched.pincode && errors.pincode}
                    </Text>
                  ) : null}

                  {/* <TextField
                    value={values.pincode}
                    onChangeText={text => {
                      if (text?.length <= 6) {
                        if (text?.length === 6) {
                          setFieldValue('pincode', text);
                          const data = new FormData();
                          data.append('pincode', text);

                          setPincodeLoad(true);
                          getPincodeAddress(data)
                            .then(res => {
                              //   console.log('respincode', res?.pincode[0]?.);
                              setFieldValue('city', res?.pincode[0]?.location);

                              setFieldValue(
                                'state',
                                res?.pincode[0]?.state_code,
                              );
                              setFieldValue(
                                'stateId',
                                res?.pincode[0]?.state_id,
                              );

                              setFieldValue(
                                'district',
                                res?.pincode[0]?.district,
                              );
                              setFieldValue(
                                'districtId',
                                res?.pincode[0]?.district_id,
                              );

                              setFieldValue(
                                'country',
                                res?.pincode[0]?.country_code,
                              );
                              setFieldValue(
                                'countryId',
                                res?.pincode[0]?.country_id,
                              );
                              setPincodeLoad(false);
                            })
                            .catch(err => {
                              console.log('err', err);
                              setPincodeLoad(false);
                            });
                        } else {
                          setFieldValue('pincode', text);
                        }
                        //   setPinCode(text);
                      }
                    }}
                    onBlur={handleBlur('Pincode')}
                    placeholder={'Enter your pincode (required)'}
                    label="Pincode"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    placeholderStyle={color.palette.black}
                    inputStyle={styles.inputStyle}
                    containerStyle={{
                      height: 55,
                    }}
                    required
                    keyboardType="numeric"
                    forwardedRef={ref => {
                      // setPincodeRef(ref);
                    }}
                    onSubmitEditing={() => {
                      // cityRef.focus();
                    }}
                  />
                  {touched.pincode && errors.pincode ? (
                    <Text style={styles.errMsgTxt}>
                      {touched.pincode && errors.pincode}
                    </Text>
                  ) : null} */}

                  <Vertical size={17} />
                  {pincodeLoad ? (
                    <Loader />
                  ) : (
                    <>
                      <TextField
                        value={values.city}
                        onChangeText={text => {
                          setFieldValue('city', text);
                        }}
                        onBlur={handleBlur('city')}
                        // errorMessage={touched.Street && errors.Street}
                        placeholder={'Enter your city (required)'}
                        label="City"
                        labelStyle={{color: color.palette.textFieldGrey}}
                        placeholderStyle={color.palette.black}
                        inputStyle={styles.inputStyle}
                        containerStyle={{
                          height: 55,
                        }}
                        disabled={true}
                        required
                        forwardedRef={ref => {
                          // setStreetRef(ref);
                        }}
                        onSubmitEditing={() => {
                          // pincodeRef?.focus();
                        }}
                      />
                      {touched.city && errors.city ? (
                        <Text style={styles.errMsgTxt}>
                          {touched.city && errors.city}
                        </Text>
                      ) : null}

                      <Vertical size={17} />

                      <TextField
                        value={values?.district}
                        placeholderStyle={color.palette.black}
                        inputStyle={[
                          styles.inputStyle,
                          {backgroundColor: color.palette.disableColor},
                        ]}
                        placeholder={'Enter your district (required)'}
                        label="District"
                        labelStyle={{color: color.palette.textFieldGrey}}
                        containerStyle={{
                          height: 55,
                        }}
                        required
                        disabled={true}
                      />

                      <Vertical size={17} />
                      <TextField
                        value={values.state}
                        placeholderStyle={color.palette.black}
                        inputStyle={[
                          styles.inputStyle,
                          {backgroundColor: color.palette.disableColor},
                        ]}
                        label="State"
                        labelStyle={{color: color.palette.textFieldGrey}}
                        containerStyle={{
                          height: 55,
                        }}
                        required
                        disabled={true}
                      />

                      <Vertical size={17} />

                      <TextField
                        value={values?.country}
                        placeholderStyle={color.palette.black}
                        inputStyle={[
                          styles.inputStyle,
                          {backgroundColor: color.palette.disableColor},
                        ]}
                        label="Country"
                        labelStyle={{color: color.palette.textFieldGrey}}
                        containerStyle={{
                          height: 55,
                        }}
                        required
                        disabled={true}
                      />
                    </>
                  )}
                  <Vertical size={17} />
                  <TextField
                    value={values.gstNo}
                    onChangeText={text => {
                      setFieldValue('gstNo', text);
                    }}
                    onBlur={handleBlur('gstNo')}
                    // errorMessage={touched.Street && errors.Street}
                    placeholder={'Enter your GST No (Optional)'}
                    label="Gst No"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    placeholderStyle={color.palette.black}
                    inputStyle={styles.inputStyle}
                    containerStyle={{
                      height: 55,
                    }}
                    // disabled={true}
                    required
                    forwardedRef={ref => {
                      // setStreetRef(ref);
                    }}
                    onSubmitEditing={() => {
                      // pincodeRef?.focus();
                    }}
                  />
                  <Vertical size={20} />

                  <FlatList
                    data={typeList}
                    key="Z"
                    keyExtractor={(item, index) => {
                      return 'Z' + index;
                    }}
                    horizontal
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index}) => {
                      return (
                        <Pressable
                          style={
                            item?.customer_address_type_id === values.typeId
                              ? [
                                  styles.typeView,
                                  {backgroundColor: color.palette.btnColor},
                                ]
                              : styles.typeView
                          }
                          onPress={() => {
                            setFieldValue(
                              'typeId',
                              item?.customer_address_type_id,
                            );
                            setFieldValue(
                              'type',
                              item?.customer_address_type_name,
                            );
                          }}>
                          <Text
                            style={
                              item?.customer_address_type_id === values.typeId
                                ? [
                                    styles.typeText,
                                    {color: color.palette.white},
                                  ]
                                : styles.typeText
                            }>
                            {item?.customer_address_type_name}
                          </Text>
                        </Pressable>
                      );
                    }}
                  />
                  {touched.type && errors.type ? (
                    <Text style={styles.errMsgTxt}>
                      {touched.type && errors.type}
                    </Text>
                  ) : null}
                  <Vertical size={16} />

                  {/* <Vertical size={65} /> */}
                  <Button
                    title={
                      addressData?.addressDetail
                        ? 'Update Address'
                        : 'Add Address'
                    }
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flex: 1,
    // justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 13,
    // height: 50,
  },
  backArrow: {height: 24, width: 24},
  content: {
    flex: 1,
    backgroundColor: color.palette.white,
    paddingHorizontal: 20,
  },
  noTxt: {
    fontSize: FontSize.font_Ex_Large_E,
    fontFamily: typography.Rubik_tertiary,
    color: color.palette.red,
    lineHeight: 21,
    letterSpacing: 0.2,
  },
  TitleTxt: {
    fontSize: FontSize.font_medium_E,
    fontFamily: typography.Rubik_tertiary,
    color: color.palette.back8,
    lineHeight: 16,
    letterSpacing: 0.2,
    marginLeft: 16,
  },
  noCircleView: {
    width: 32,
    height: 32,
    borderColor: color.palette.red,
    borderWidth: 2,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TitleheaderView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputStyle: {
    flex: 1,
    fontSize: FontSize.font_medium_E,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: color.palette.grey,
    color: color.palette.black,
  },
  button: {
    backgroundColor: color.palette.btnColor,
    borderRadius: 5,
    height: 50,
  },
  btnTxt: {
    fontSize: FontSize.font_small_E,
    fontFamily: typography.Rubik_tertiary,
    lineHeight: 14,
    letterSpacing: 0.2,
    color: color.palette.white,
  },
  locNameTxt: {
    fontSize: FontSize.font_extra_small_E,
    fontFamily: typography.Rubik_tertiary,
    lineHeight: 12,
    // letterSpacing: 0.2,
    color: color.palette.white,
    marginLeft: 6,
  },
  prefLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 5,
    borderWidth: 1.5,
    marginRight: 7,
    borderColor: color.palette.red,
  },
  countryCodeView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.palette.black,
    borderRadius: 4,
    paddingLeft: 11,
    paddingBottom: 1,
  },
  cuntyCode: {
    fontSize: FontSize.font_medium_E,
    fontFamily: typography.Rubik_tertiary,
    // lineHeight: 14,
    letterSpacing: 0.2,
    color: color.palette.black,
    alignSelf: 'center',
    // top: 4,
  },
  errMsgTxt: {
    marginTop: 10,
    fontSize: FontSize.font_small_O,
    fontFamily: typography.Rubik_primary,
    color: color.palette.danger,
  },

  typeView: {
    borderWidth: 1,
    borderColor: color.palette.btnColor,
    borderRadius: 5,
    paddingVertical: 9,
    paddingHorizontal: 20,
    marginRight: 20,
  },
  typeText: {
    color: color.palette.btnColor,
    fontFamily: typography.primary,
    fontSize: FontSize.font_small_E,
  },
});
