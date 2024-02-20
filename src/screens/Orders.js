import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  BackHandler,
  FlatList,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  CommonHeader,
  ProductFlatCard,
  ProductFlatRectLoader,
} from '../components';
import {Routes} from '../navigation';
import {getOrderList, getOrderStatus, getOrderYear} from '../services/api';
import {FontSize, color, typography} from '../theme';
import {Divider, Vertical} from '../ui-kit';
import {Select} from '../ui-kit/select';

const order = [
  {
    sales_order_ref_no: '11000172',
    invoice_no: '0',
    deli_name: 'Jalal udeen',
    deli_address1: '65 bango st, lakshmi nagar',
    deli_address2: 'Kavundampalayam',
    deli_landmark: 'Krishna sweet backside',
    deli_city: 'Coimbatore',
    deli_state: '31',
    deli_country: '1',
    deli_zipcode: '641104',
    deli_email: '',
    deli_phone: '9894363746',
    bill_name: 'Jalal udeen',
    bill_address1: '65 bango st, lakshmi nagar',
    bill_address2: 'Kavundampalayam',
    bill_landmark: 'Krishna sweet backside',
    bill_city: 'Coimbatore',
    bill_state: '31',
    bill_country: '1',
    bill_zipcode: '641104',
    bill_email: '',
    bill_phone: '9894363746',
    bill_gst: '',
    order_total_value: '400',
    order_total_tax_value: '',
    order_shipping_value: '',
    order_total_sales_value: '400',
    orders_status: 'Accepted',
    orders_instruction: '',
    payment_method: 'Cash on Delivery',
    payment_module_code: 'PAY_COD',
    shipping_method: '',
    shipping_module_code: '',
    purchase_date: '2023-12-01 17:30:33',
    orders_date_finished: '0000-00-00 00:00:00',
    currency: 'INR',
    currency_value: '1',
    payment_mode: 'COD',
    coupon_code: '',
    orderitemlist: [
      {
        item_ref_no: '300239',
        seller_ref_no: '12976',
        product_cat_ref_no: '602',
        product_cat_name: 'Cakes',
        product_sub_cat_ref_no: '10015',
        product_sub_cat_name: 'Eggless Cake',
        brand_id: '400',
        brand_name: 'JBJAB',
        item_sku: '401608-500',
        item_model: '3702',
        item_hs_code: 'HS202',
        item_title: 'Egg Free Cakes',
        item_name: 'Egg Free Chocolate Cake',
        item_slug: 'egg-free-chocolate-cake',
        item_price: '250.00',
        item_mrp_price: '250.00',
        item_tax_cat_id: '0',
        item_tax_cat: null,
        item_tax_included_id: '0',
        item_tax_included: null,
        item_tax_rate: null,
        item_price_taxable_value: '0.00',
        item_price_tax_value: '0.00',
        item_price_totaltax_value: '0.00',
        item_discount: 'No Discount',
        item_discount_symbol: '',
        item_discount_type: '3',
        item_discount_value: '0',
        item_stock: '100',
        item_cod_status: null,
        item_scale_name: null,
        item_scale_id: '0',
        item_box_length: '0',
        item_box_height: '0',
        item_box_width: '0',
        item_ship_price: '0.00',
        have_item_ship_price: 'No',
        item_ship_price_allow: 'No',
        item_img_url:
          'https://ik.imagekit.io/hwnfdptfp/pro-image/1043374b3494e0aabf15c507f96fe99e.jpg',
        item_qty: '1',
        average_rating: '0',
        count_rating: '0',
      },
      {
        item_ref_no: '300159',
        seller_ref_no: '12976',
        product_cat_ref_no: '600',
        product_cat_name: 'Sweets',
        product_sub_cat_ref_no: '10019',
        product_sub_cat_name: 'Ghee Sweets',
        brand_id: '400',
        brand_name: 'JBJAB',
        item_sku: '400167-250',
        item_model: '1605',
        item_hs_code: 'HS50',
        item_title: 'Ghee Sweets',
        item_name: 'Cashew Cake',
        item_slug: 'cashew-cake',
        item_price: '150.00',
        item_mrp_price: '150.00',
        item_tax_cat_id: '0',
        item_tax_cat: null,
        item_tax_included_id: '0',
        item_tax_included: null,
        item_tax_rate: null,
        item_price_taxable_value: '0.00',
        item_price_tax_value: '0.00',
        item_price_totaltax_value: '0.00',
        item_discount: 'No Discount',
        item_discount_symbol: '',
        item_discount_type: '3',
        item_discount_value: '0',
        item_stock: '10',
        item_cod_status: null,
        item_scale_name: null,
        item_scale_id: '0',
        item_box_length: '0',
        item_box_height: '0',
        item_box_width: '0',
        item_ship_price: '0.00',
        have_item_ship_price: 'No',
        item_ship_price_allow: 'No',
        item_img_url:
          'https://ik.imagekit.io/hwnfdptfp/pro-image/97021a53cbe45b5da7ac4f38c8b1f657.jpeg',
        item_qty: '1',
        average_rating: '0',
        count_rating: '0',
      },
    ],
    orderpaymentlist: [
      {
        company_ref_no: '2001025',
        customer_ref_no: '8888552',
        sales_order_ref_no: '11000172',
        payment_paid: '',
        payment_fee: '',
        payment_currency: '',
        payment_transaction_id: '',
        payment_source: '',
        payment_mode: 'COD',
        payment_type: '',
        payment_status: 'success',
        reason_code: '',
        pending_reason: '',
        payment_bank_ref_no: '',
        payment_bank_code: '',
        payment_card_name: '',
        payment_card_num: '',
        payment_date: '2023-12-01 17:30:33',
      },
    ],
  },
];

export const Orders = () => {
  const navigation = useNavigation();
  const userData = useSelector(state => state.auth);
  const [orderList, setOrderList] = useState([]);
  const [orderLoad, setOrderLoad] = useState(false);
  const [orderStatusList, setOrderStatusList] = useState([]);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const [orderHistory, setOrderHistory] = useState([
    'Last 1 month',
    'Last 2 month',
    'Last 3 month',
    'Last 6 month',
  ]);
  const [selectedOrderHistory, setSelectedOrderHistory] = useState(
    orderHistory[2],
  );
  // ,

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate(Routes.HOME);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  useEffect(() => {
    setOrderLoad(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    // payload.append('customer_ref_no', '8888552');
    getOrderStatus(payload)
      .then(res => {
        setOrderStatusList(res?.order_status);
        setSelectedOrderStatus(res?.order_status[1]);
        getOrderYear(payload)
          .then(res => {
            // console.log('res order year', res?.order_year);
            setOrderHistory(orderHistory.concat(res?.order_year[0]?.year));
          })
          .catch(err => {});
        getOrderListFunc();
      })
      .catch(err => {});
  }, [userData?.userData?.customer_ref_no]);

  const getOrderListFunc = useCallback(
    (status, history) => {
      console.log('entry datat usecallback', status);
      setOrderLoad(true);
      const payload = new FormData();
      payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
      if (status) {
        payload.append('orders_status', status?.order_status_id);
      }

      let p_his = null;
      if (history) {
        if (history?.includes('Last')) {
          let data = history?.split(' ');
          p_his = data[1];
        }
        payload.append('orders_filter', p_his ?? history);
      }
      console.log(payload);
      getOrderList(payload)
        .then(res => {
          // console.log('order list res', res);
          setOrderLoad(false);
          if (res?.order === 'No Record Found') {
            setOrderList([]);
          } else {
            setOrderList(res?.order);
          }
          // setOrderList(order);
        })
        .catch(err => {
          setOrderLoad(false);
          console.log('err', err);
        });
    },
    [
      selectedOrderHistory,
      selectedOrderStatus,
      userData?.userData?.customer_ref_no,
    ],
  );

  const handleOrder = ({item, inde}) => {
    return (
      <View style={styles.container}>
        <Vertical size={15} />
        <View style={styles.box}>
          <View style={styles.content_box}>
            <View>
              <Text style={styles.item}>{item.sales_order_ref_no}</Text>
              <Vertical size={6} />
              <Text style={styles.orderDate}>
                Order Date :{' '}
                <Text style={{fontFamily: typography.semiBold}}>
                  {moment(item.purchase_date).format('MMM-DD-YY')}
                </Text>
              </Text>
            </View>
            <Pressable
              onPress={() => {
                navigation.navigate(Routes.ORDERDETAIL, {
                  order_id: item.sales_order_ref_no,
                });
              }}>
              <View style={styles.view_box}>
                <Text style={styles.viewDetails}>View Details</Text>
              </View>
            </Pressable>
          </View>
          <Vertical size={12} />
          <Divider />
          <Vertical size={14} />
          <View style={styles.order_row}>
            <Text style={styles.orderDate}>Order Status</Text>
            <Text
              style={
                item.orders_status === 'Cancelled'
                  ? [styles.shipping, {color: color.palette.red}]
                  : styles.shipping
              }>
              {item.orders_status}
            </Text>
          </View>
          <Vertical size={6} />
          <View style={styles.order_row}>
            <Text style={styles.orderDate}>Items</Text>
            <Text style={styles.purchased}>
              {item?.orderitemlist?.length} Items purchased
            </Text>
          </View>
          <Vertical size={6} />
          <View style={styles.order_row}>
            <Text style={styles.orderDate}>Price</Text>
            <Text
              style={[
                styles.price,
                {fontFamily: typography.semiBold, color: color.palette.black},
              ]}>
              ₹ {item.order_total_sales_value}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: color.palette.white}}>
      <CommonHeader title={'Orders'} screens="Orders" />
      {orderLoad ? (
        <ProductFlatRectLoader />
      ) : (
        <>
          {/* {orderList.length ? ( */}
          <FlatList
            data={orderList}
            key=">"
            keyExtractor={(item, index) => {
              return '>' + index;
            }}
            ListHeaderComponent={
              <>
                <Vertical size={20} />
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginHorizontal: 20,
                    justifyContent: 'space-between',
                    // backgroundColor: 'red',
                    //   height: 400,
                  }}>
                  <Select
                    options={orderStatusList}
                    value={selectedOrderStatus?.order_status_name}
                    onPress={(value, index) => {
                      setSelectedOrderStatus(value);
                      getOrderListFunc(value, selectedOrderHistory);
                      // getOrderListFunc()
                    }}
                    inputStyle={[
                      styles.inputStyle,
                      {paddingLeft: 10, height: 35},
                    ]}
                    textStyle={{
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_medium_E,
                    }}
                    label="Order Status"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    //   variant={'underline'}
                    //   placeholder="state *"
                    placeholderStyle={{
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_extra_medium_O,
                      color: color.palette.black,
                    }}
                  />
                  <Select
                    options={orderHistory}
                    value={selectedOrderHistory}
                    onPress={(value, index) => {
                      setSelectedOrderHistory(value);
                      getOrderListFunc(selectedOrderStatus, value);
                    }}
                    inputStyle={[
                      styles.inputStyle,
                      {paddingLeft: 10, height: 35},
                    ]}
                    textStyle={{
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_medium_E,
                    }}
                    label="Order History"
                    labelStyle={{color: color.palette.textFieldGrey}}
                    //   variant={'underline'}
                    //   placeholder="state *"
                    placeholderStyle={{
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_extra_medium_O,
                      color: color.palette.black,
                    }}
                  />
                </View>
                {orderList.length ? null : (
                  <View>
                    <Text style={styles.noRecord}>No Orders Found</Text>
                  </View>
                )}
              </>
            }
            renderItem={handleOrder}
          />
          {/* ) : (
            <View>
              <Text style={styles.noRecord}>No Orders Found</Text>
            </View>
          )} */}
        </>
      )}
      <Vertical size={10} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.palette.white,
  },
  box: {
    height: 154,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: color.palette.btnColor,
    backgroundColor: color.palette.white,
    paddingTop: 18,
    marginHorizontal: 18,
  },
  content_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 10,
  },
  item: {
    fontSize: FontSize.font_medium_E,
    fontFamily: typography.secondary,
    color: color.palette.black,
    lineHeight: 15.41,
  },
  orderDate: {
    fontSize: FontSize.font_extra_medium_E,
    fontFamily: typography.primary,
    color: color.palette.black,
    lineHeight: 14.22,
    // alignSelf: 'center',
  },
  viewDetails: {
    fontSize: FontSize.font_small_O,
    fontFamily: typography.primary,
    color: color.palette.btnColor,
    lineHeight: 20,
  },
  view_box: {
    width: 84,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.palette.btnColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  order_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 10,
  },
  shipping: {
    fontSize: FontSize.font_small_E,
    fontFamily: typography.medium,
    color: color.palette.green,
    lineHeight: 14.22,
  },
  purchased: {
    fontSize: FontSize.font_small_E,
    fontFamily: typography.primary,
    color: color.palette.black,
    lineHeight: 14.22,
  },
  price: {
    fontSize: FontSize.font_medium_E,
    fontFamily: typography.Rubik_tertiary,
    color: color.palette.btnColor,
    // lineHeight: 14.22,
  },
  noRecord: {
    fontFamily: typography.secondary,
    fontSize: FontSize.font_medium_E,
    color: color.palette.red,
    textAlign: 'center',
    marginTop: 30,
  },
  inputStyle: {
    // flex: 1,
    width: Dimensions.get('screen').width / 2 - 30,
    fontSize: FontSize.font_medium_E,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: color.palette.grey,
    color: color.palette.black,
  },
});
