import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import {useSelector} from 'react-redux';
import {CommonHeader, ProductFlatCard} from '../components';
import {callCancelApi, orderDetailApi} from '../services/api';
import {FontSize, color, typography} from '../theme';
import {Button, Divider, Loader, Vertical} from '../ui-kit';

export const OrderDetails = ({route}) => {
  const {order_id} = route?.params ?? {};
  const userData = useSelector(state => state.auth);
  const [orderDetailLoad, setorderDetailLoad] = useState(false);
  const [orderDetail, setOrderDetail] = useState();
  const [cancelOrder, setCancelOrder] = useState(false);
  const [cancelOrderList, setCancelOrderList] = useState([]);
  const [selectDropDown, setSelectDropDown] = useState(false);
  const [cancelLoad, setCancelLoad] = useState(false);
  const [flag, setFlag] = useState(Math.random());

  useEffect(() => {
    setorderDetailLoad(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);

    // payload.append('customer_ref_no', '8888552');
    payload.append('oid', order_id);
    orderDetailApi(payload)
      .then(res => {
        setorderDetailLoad(false);
        setOrderDetail(res?.order[0]);
        console.log('order details', res?.order[0]);
        if (res?.order[0]?.orders_status === 'Cancelled') {
          setCancelOrder(true);
        }
      })
      .catch(err => {
        setorderDetailLoad(false);
        console.log('errs', err);
      });
  }, [order_id, userData?.userData?.customer_ref_no, flag]);

  const handleCancel = item => {
    let _data = item;
    _data = {
      ..._data,
      cancel_order: '',
    };
    setCancelOrderList(cancelOrderList => [...cancelOrderList, _data]);
  };

  const handleRemove = data => {
    setCancelOrderList(
      cancelOrderList.filter((item, index) => {
        return item?.item_ref_no !== data?.item_ref_no;
      }),
    );
  };

  const handleCancelApi = () => {
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    payload.append('sales_order_ref_no', orderDetail?.sales_order_ref_no);
    console.log('orderDetail', orderDetail?.sales_order_ref_no);
    cancelOrderList.map((item, index) => {
      let data = {
        sales_order_ref_no: orderDetail?.sales_order_ref_no,
        seller_ref_no: item?.seller_ref_no,
        item_ref_no: item?.item_ref_no,
        item_price_ref_no: item?.item_price_ref_no,
        cancel_reason: item?.cancel_order,
      };
      payload.append('cancel_list[]', JSON.stringify(data));
    });
    callCancelApi(payload)
      .then(res => {
        setSelectDropDown(false);
        setCancelLoad(false);
        setFlag(Math.random());
        setCancelOrderList([]);
      })
      .catch(err => {
        console.log('err cancel order', err);
      });
  };

  const handleProduct = ({item, index}) => {
    let canOrder = true;
    let closeOrder = false;
    cancelOrderList.map((_item, _index) => {
      if (item?.item_price_ref_no === _item?.item_price_ref_no) {
        canOrder = false;
        closeOrder = true;
      }
    });

    return (
      <ProductFlatCard
        title={item?.item_title}
        productImage={item?.item_img_url}
        price={item?.item_price_taxable_value}
        calculatedVal={item?.total_item_price_taxable_value}
        qty={item?.item_qty}
        item={item}
        index={index}
        showDropDown={false}
        sub_title={item?.item_name}
        type="order"
        screen="order"
        showgramsVal={true}
        cancelOrderList={cancelOrderList}
        handleCancel={handleCancel}
        handleRemove={handleRemove}
        canOrder={canOrder}
        closeOrder={closeOrder}
        cancelOrderBackground={
          item?.cancel_item_status === 'Yes' ? true : false
        }
        hideCancelBtn={orderDetail?.orders_status === 'Shipped' ? false : true}
      />
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: color.palette.white}}>
      <CommonHeader title={'Order Summary'} />
      {/* <View> */}

      {/* </View> */}
      {orderDetailLoad ? (
        <Loader />
      ) : (
        <>
          <FlatList
            ListHeaderComponent={
              <>
                <View
                  style={
                    orderDetail?.cancel_order === 'No'
                      ? styles.headerCard
                      : [
                          styles.headerCard,
                          {backgroundColor: color.palette.dimRed},
                        ]
                  }>
                  {/* <Image
                    source={
                      !cancelOrder
                        ? require('../assets/icon/check.png')
                        : require('../assets/icon/cancel.png')
                    }
                    style={
                      !cancelOrder
                        ? styles.headerIcon
                        : [styles.headerIcon, {height: 85}]
                    }
                  /> */}
                  <View style={styles.rowView}>
                    <Text style={styles.lftTxt}>Order Placed</Text>
                    <Text style={styles.rhtTxt}>
                      {orderDetail?.purchase_date}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.rhtTxt,
                      {
                        alignSelf: 'flex-start',
                        marginVertical: 9,
                        fontSize: FontSize.font_medium_E,
                        fontFamily: typography.primary,
                      },
                    ]}>
                    {!cancelOrder
                      ? 'Your order was successfully placed'
                      : 'Your order was cancelled'}
                  </Text>

                  <View style={styles.rowView}>
                    <Text style={styles.lftTxt}>Order Id:</Text>
                    <Text style={styles.rhtTxt}>
                      {orderDetail?.sales_order_ref_no}
                    </Text>
                  </View>
                </View>
                <Vertical size={10} />
                <Text style={styles.addtitle}>Billing Address</Text>
                <View style={styles.addressView}>
                  <Image
                    source={require('../assets/icon/location.png')}
                    style={styles.loc}
                  />
                  <View style={{flex: 1}}>
                    <Text
                      style={[
                        styles.addressTxt,
                        {fontFamily: typography.semiBold},
                      ]}>
                      {orderDetail?.bill_name}
                    </Text>
                    <Text style={styles.addressTxt}>{`${
                      orderDetail?.bill_address1
                    }, ${
                      orderDetail?.deli_address2 !== ''
                        ? orderDetail?.deli_address2 + ','
                        : ''
                    }${orderDetail?.bill_landmark}, ${
                      orderDetail?.bill_city
                    }, ${orderDetail?.bill_district_name}, ${
                      orderDetail?.bill_state_name
                    }, ${orderDetail?.bill_country_name} `}</Text>
                    <Text style={styles.addressTxt}>
                      Pincode: {orderDetail?.bill_zipcode}
                    </Text>
                    <Text
                      style={[
                        styles.addressTxt,
                        {fontFamily: typography.secondary},
                      ]}>
                      Ph: {orderDetail?.bill_phone}
                    </Text>
                  </View>
                </View>
                <Vertical size={10} />
                <Text style={styles.addtitle}>Delivery Address</Text>
                <View style={styles.addressView}>
                  <Image
                    source={require('../assets/icon/location.png')}
                    style={styles.loc}
                  />
                  <View style={{flex: 1}}>
                    <Text
                      style={[
                        styles.addressTxt,
                        {fontFamily: typography.semiBold},
                      ]}>
                      {orderDetail?.deli_name}
                    </Text>
                    <Text style={styles.addressTxt}>{`${
                      orderDetail?.deli_address1
                    }, ${
                      orderDetail?.deli_address2 !== ''
                        ? orderDetail?.deli_address2 + ','
                        : ''
                    }${orderDetail?.deli_landmark}, ${
                      orderDetail?.deli_city
                    }, ${orderDetail?.deli_district_name}, ${
                      orderDetail?.deli_state_name
                    }, ${orderDetail?.deli_country_name} `}</Text>
                    <Text style={styles.addressTxt}>
                      Pincode: {orderDetail?.deli_zipcode}
                    </Text>
                    <Text
                      style={[
                        styles.addressTxt,
                        {fontFamily: typography.secondary},
                      ]}>
                      Ph: {orderDetail?.deli_phone}
                    </Text>
                  </View>
                </View>
                <Vertical size={10} />
                <Text style={styles.addtitle}>Your order's</Text>
              </>
            }
            data={orderDetail?.orderitemlist}
            renderItem={handleProduct}
            key=":"
            keyExtractor={(item, index) => {
              return ':' + index;
            }}
            ListFooterComponent={
              <>
                <Vertical size={10} />
                <Text style={styles.addtitle}>Bill Amount </Text>
                <View
                  style={[
                    styles.addressView,
                    {flexDirection: 'column', marginBottom: 70},
                  ]}>
                  <View style={styles.amountView}>
                    <Text style={[styles.leftTxt, {width: '50%'}]}>
                      Sub total
                    </Text>
                    <Text style={[styles.leftTxt, {width: '20%'}]}>:</Text>
                    <Text
                      style={[
                        styles.leftTxt,
                        {width: '30%', textAlign: 'right'},
                      ]}>
                      ₹ {orderDetail?.order_total_value}
                    </Text>
                  </View>
                  {/* <View style={styles.amountView}>
                    <Text
                      style={[
                        styles.leftTxt,
                        {fontFamily: typography.primary, width: '50%'},
                      ]}>
                      Discount
                    </Text>
                    <Text style={[styles.leftTxt, {width: '20%'}]}>:</Text>
                    <Text
                      style={[
                        styles.leftTxt,
                        {width: '30%', textAlign: 'right'},
                      ]}>
                      ₹{' '}
                      {orderDetail?.order_total_value -
                        orderDetail?.order_total_sales_value}
                    </Text>
                  </View> */}
                  <View style={styles.amountView}>
                    <Text
                      style={[
                        styles.leftTxt,
                        {fontFamily: typography.primary, width: '50%'},
                      ]}>
                      Taxes and charges{' '}
                      <Image
                        source={require('../assets/icon/imp.png')}
                        style={{width: 11, height: 14}}
                      />
                    </Text>
                    <Text style={[styles.leftTxt, {width: '20%'}]}>:</Text>
                    <Text
                      style={[
                        styles.leftTxt,
                        {width: '30%', textAlign: 'right'},
                      ]}>
                      ₹ {orderDetail?.order_total_tax_value}
                    </Text>
                  </View>
                  <View style={styles.amountView}>
                    <Text
                      style={[
                        styles.leftTxt,
                        {fontFamily: typography.primary, width: '50%'},
                      ]}>
                      Delivery fee
                    </Text>
                    <Text style={[styles.leftTxt, {width: '20%'}]}>:</Text>
                    <Text
                      style={[
                        styles.leftTxt,
                        {width: '30%', textAlign: 'right'},
                      ]}>
                      ₹ {orderDetail?.order_shipping_value}
                    </Text>
                  </View>
                  <Vertical size={10} />
                  <Divider />
                  <Vertical size={10} />
                  <View style={styles.amountView}>
                    <Text style={[styles.leftTxt, {width: '50%'}]}>
                      Grand total
                    </Text>
                    <Text style={[styles.leftTxt, {width: '20%'}]}>:</Text>
                    <Text
                      style={[
                        styles.leftTxt,
                        {width: '30%', textAlign: 'right'},
                      ]}>
                      ₹ {orderDetail?.order_total_sales_value}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_small_E,
                      color: color.palette.btnColor,
                      marginLeft: 10,
                    }}>
                    {'(Inclusive of all taxes)'}
                  </Text>
                  {/* <Vertical size={10} /> */}
                </View>
              </>
            }
          />
          {!cancelOrderList?.length ? null : (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                bottom: 0,
                zIndex: 3,
              }}>
              <Button
                title={`Cancel (${cancelOrderList?.length}) Orders`}
                style={styles.button}
                textStyle={styles.btnTxt}
                onPress={() => {
                  setSelectDropDown(true);
                }}
              />
            </View>
          )}
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
                  source={require('../assets/icon/b_close.png')}
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
                Are you sure you want to cancel this product?
              </Text>
              <View style={styles.btnView}>
                <Button
                  variant="outline"
                  title="Cancel"
                  onPress={() => {
                    // setDelModal(false);
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
                  loading={cancelLoad}
                  onPress={() => {
                    // setDelModal(false);
                    // setSelectDropDown(false);
                    setCancelLoad(true);
                    handleCancelApi();
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
  loc: {
    width: 20,
    height: 26,
    marginRight: 15,
    marginLeft: 9,
    alignSelf: 'center',
  },
  addressView: {
    flexDirection: 'row',
    backgroundColor: color.palette.white,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
    marginHorizontal: 20,
    paddingVertical: 11,
    marginBottom: 10,
    borderRadius: 5,
    paddingRight: 10,
  },
  addressTxt: {
    color: color.palette.textColor,
    fontFamily: typography.primary,
    fontSize: FontSize.font_medium_E,
    width: '80%',
  },
  addtitle: {
    fontFamily: typography.medium,
    fontSize: FontSize.font_large_E,
    color: color.palette.black,
    marginLeft: 20,
  },
  amountView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  leftTxt: {
    fontFamily: typography.medium,
    fontSize: FontSize.font_medium_E,
    color: color.palette.black,

    // backgroundColor: 'red',
  },
  rowView: {
    flex: 1,
    flexDirection: 'row',
    // marginTop: 25,
    // justifyContent: 'center',
  },
  lftTxt: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_small_E,
    color: color.palette.black,
    marginRight: 10,
    alignSelf: 'center',
  },
  rhtTxt: {
    fontFamily: typography.secondary,
    fontSize: FontSize.font_medium_E,
    color: color.palette.black,
    alignSelf: 'center',
  },
  headerCard: {
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
    marginHorizontal: 20,
    backgroundColor: color.palette.dimGreen,
    marginTop: 20,
    borderRadius: 5,
    paddingHorizontal: 23,
    paddingVertical: 10,
  },
  headerIcon: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: color.palette.btnColor,
    borderRadius: 5,
    height: 35,
    marginHorizontal: 20,
    marginBottom: 10,
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
});
