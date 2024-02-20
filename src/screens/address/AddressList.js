import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CommonHeader, ProductFlatRectLoader} from '../../components';
import {Routes} from '../../navigation';
import {
  cartBillingAddress,
  cartDeliveryAddress,
  fromCartToAddress,
  selectAddressType,
} from '../../redux/slices/dashSlice';
import {
  delAddressApi,
  getAddressList,
  getDefaultAddress,
  setDefaultAddress,
} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import {Button, Divider, Loader} from '../../ui-kit';

export const AddressList = ({route}) => {
  const {refresh, type} = route?.params ?? {};
  const userData = useSelector(state => state.auth);
  const dashData = useSelector(state => state?.dash);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [addressLoad, setAddressLoad] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [flag, setFlag] = useState();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectDropDown, setSelectDropDown] = useState(false);
  const [delSelectedItem, setDelSelectedItem] = useState();
  const [deleteLoad, setDeleteLoad] = useState(false);

  useEffect(() => {
    setAddressLoad(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);

    getDefaultAddress(payload)
      .then(_res => {
        setSelectedAddress(_res?.address_list[0]);
        getAddressList(payload)
          .then(res => {
            setAddressLoad(false);
            if (res?.address_list === 'Address List Empty') {
              setAddressList([]);
            } else {
              setAddressList(res?.address_list);
            }
          })
          .catch(err => {
            console.log('err', err);
            setAddressLoad(false);
          });
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [userData?.userData?.customer_ref_no, flag, refresh]);

  const handleDelFromModal = () => {
    setDeleteLoad(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    payload.append('customer_address_id', delSelectedItem?.customer_address_id);
    delAddressApi(payload)
      .then(res => {
        console.log('res', res);
        setFlag(Math.random());
        setSelectDropDown(false);
      })

      .catch(err => {
        console.log('err', err);
      });
  };

  const handleDelete = item => {
    setSelectDropDown(true);
    setDelSelectedItem(item);
  };

  const handleAddress = ({item, index}) => {
    return (
      <Pressable
        style={
          selectedAddress?.customer_address_id === item?.customer_address_id
            ? [
                styles.cardView,
                {borderWidth: 1, borderColor: color.palette.btnColor},
              ]
            : styles.cardView
        }
        onPress={() => {
          const payload = new FormData();
          payload.append('customer_address_id', item?.customer_address_id);
          payload.append(
            ' customer_ref_no',
            userData?.userData?.customer_ref_no,
          );
          if (dashData?.cartToAddress === 'delivery') {
            dispatch(cartDeliveryAddress(item));
            dispatch(fromCartToAddress(null));
            navigation.goBack();
          } else if (dashData?.cartToAddress === 'billing') {
            dispatch(cartBillingAddress(item));
            dispatch(fromCartToAddress(null));
            navigation.goBack();
          }
          setSelectedAddress(item);
          setDefaultAddress(payload)
            .then(res => {})
            .catch(err => {});
        }}>
        <Image
          source={require('../../assets/icon/home.png')}
          style={styles.typeImage}
        />
        <View style={{marginLeft: 17, flex: 1}}>
          <View style={styles.rightIconView}>
            <Pressable
              onPress={() => {
                handleDelete(item);
              }}>
              <Image
                source={require('../../assets/icon/deleteIcon.png')}
                style={{height: 18, width: 18, marginRight: 10}}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                dispatch(selectAddressType(item));
                navigation.navigate(Routes.ADD_ADDRESS);
              }}>
              <Image
                source={require('../../assets/icon/edit1.png')}
                style={{height: 16, width: 16}}
              />
            </Pressable>
          </View>
          <Text style={styles.typeText}>
            {item?.customer_address_type_name}{' '}
            {selectedAddress?.customer_address_id ===
            item?.customer_address_id ? (
              <Text
                style={{
                  fontSize: FontSize.font_extra_small_E,
                  color: color.palette.grey,
                  fontFamily: typography.medium,
                  right: 5,
                }}>
                (Set as default)
              </Text>
            ) : null}
          </Text>

          <>
            <Text
              style={
                styles.addressTxt
              }>{`${item?.customer_address_line_1}, ${item?.customer_landmark}, ${item?.customer_city}, ${item?.district_name}, ${item?.state_name}, ${item?.country_name} `}</Text>
            {item?.gst !== '' ? <Text>GST No: {item?.gst}</Text> : null}
          </>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{backgroundColor: color.palette.backgroundGrey, flex: 1}}>
      <CommonHeader title={'Manage Address'} />
      <Text style={styles.tit}>Saved Address</Text>
      {addressLoad ? (
        <ProductFlatRectLoader />
      ) : (
        <>
          {addressList?.length ? (
            <FlatList
              data={addressList}
              key="]"
              //   style={{backgroundColor: color.palette.red}}
              keyExtractor={(item, index) => {
                return ']' + index;
              }}
              renderItem={handleAddress}
            />
          ) : null}
          {addressList?.length < 5 ? (
            <Pressable
              onPress={() => {
                dispatch(selectAddressType(null));
                navigation.navigate(Routes.ADD_ADDRESS);
              }}
              style={styles.addAddressView}>
              <Text
                style={{
                  fontFamily: typography.primary,
                  color: color.palette.black,
                  fontSize: FontSize.font_medium_E,
                }}>
                Add Address
              </Text>
              <Image
                source={require('../../assets/icon/add.png')}
                style={{height: 22, width: 20}}
              />
            </Pressable>
          ) : null}
        </>
      )}
      {selectDropDown ? (
        <Modal
          transparent={true}
          visible={selectDropDown}
          animationType="fade"
          style={{alignSelf: 'center'}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}>
            <View
              style={{
                backgroundColor: color.palette.white,

                borderRadius: 10,
              }}>
              <Pressable
                onPress={() => {
                  setSelectDropDown(!selectDropDown);
                }}>
                <Image
                  source={require('../../assets/icon/b_close.png')}
                  style={{
                    height: 20,
                    width: 20,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 10,
                  }}
                />
              </Pressable>

              <Text style={styles.modalTxt}>
                Are you sure you want to delete this address?
              </Text>
              <View style={styles.btnView}>
                <Button
                  variant="outline"
                  title="Cancel"
                  onPress={() => {
                    setSelectDropDown(false);
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
                  loading={deleteLoad}
                  onPress={() => {
                    handleDelFromModal();
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
    // justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 13,
    // height: 50,
  },
  backArrow: {height: 24, width: 24},
  boxView: {
    flexDirection: 'row',
    backgroundColor: color.palette.white,
    marginTop: 15,
    marginHorizontal: 20,
    paddingLeft: 11,
    paddingVertical: 11,
    borderRadius: 5,
  },
  addressTxt: {
    color: color.palette.black,
    fontFamily: typography.primary,
    fontSize: FontSize.font_medium_E,
    width: '80%',
  },
  addAddressView: {
    //   flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: color.palette.white,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
  titleTxt: {
    fontFamily: typography.semiBold,
    color: color.palette.black,
    fontSize: FontSize.font_large_E,
    marginLeft: 20,
  },
  cardView: {
    backgroundColor: color.palette.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  typeImage: {height: 22, width: 26, tintColor: color.palette.black},
  rightIconView: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
    right: 0,
    marginRight: 10,
    zIndex: 3,
  },
  typeText: {
    fontFamily: typography.semiBold,
    fontSize: FontSize.font_large_E,
    color: color.palette.black,
  },
  innrCardView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  tit: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_extra_medium_O,
    color: color.palette.black,
    marginTop: 10,
    marginLeft: 10,
  },
  btnTxt: {
    fontSize: FontSize.font_small_E,
    fontFamily: typography.Rubik_tertiary,
    lineHeight: 14,
    letterSpacing: 0.2,
    color: color.palette.white,
  },
  modalTxt: {
    fontFamily: typography.semiBold,
    textAlign: 'center',
    color: color.palette.black,
    marginHorizontal: 16,
    marginTop: 15,
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
    marginHorizontal: 20,
    marginBottom: 10,
  },
});
