import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {HmacSHA256, enc} from 'crypto-js';

import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  BackHandler,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  CommonHeader,
  ProductFlatCard,
  ProductFlatRectLoader,
  ProductRectLoader,
} from '../components';
import {DEVICE_IP_ADDRESS} from '../constants/keys';
import {Routes} from '../navigation';
import {
  bottomSheetControl,
  cartBillingAddress,
  cartDeliveryAddress,
  fromCartToAddress,
  orderIdFunc,
  paymentEvent,
  productSlugDetials,
  updateCartNumber,
} from '../redux/slices/dashSlice';
import {
  addToCart,
  billdeskApi,
  billdeskJwtEncode,
  billDeskResponseApi,
  clearCart,
  delCart,
  getCartList,
  getCartTotalAmount,
  getDefaultAddress,
  getPaymentListApi,
  getSellerNo,
  getSuggestionList,
  OrderConfirmApi,
  orderConfirmPaymentApi,
} from '../services/api';
import {FontSize, color, typography} from '../theme';
import {Button, Divider, Loader, TextField, Vertical} from '../ui-kit';
import base64 from 'react-native-base64';
import uuid from 'react-native-uuid';
import {API} from '../constants';
import {ProductCard} from '../components/common/ProductCard';
import {BottomSheet} from '../components/common/BottomSheet';
import Toast from 'react-native-simple-toast';

export const Cart = () => {
  const userData = useSelector(state => state.auth);
  const dashData = useSelector(state => state?.dash);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [cartLoad, setCartLoad] = useState(false);
  const [cartList, setCartList] = useState([]);
  const [sellerData, setSellerData] = useState();
  const [address, setAddress] = useState();
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
  const [cartCountLoad, setCartCountLoad] = useState(false);
  const [flag, setFlag] = useState();
  const [total, setTotal] = useState(0);
  const [mrpPrice, setMrpPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxVal, setTaxVal] = useState(0);
  const [paymentList, setPaymentList] = useState();
  const [suggestionList, setSuggestionList] = useState([]);
  const [modalLoad, setModalLoad] = useState(false);
  const [OC_res, setOC_res] = useState();
  const [showCod, setShowCod] = useState(true);
  const [totalAmountApi, setTotalAmountApi] = useState();
  const [priceUpdate, setPriceUpdate] = useState(Math.random());
  const [selectProduct, setSelectProduct] = useState(null);
  const [suggestionLoad, setSuggestionLoad] = useState(false);
  const [selectDropDown, setSelectDropDown] = useState(false);
  const [delSelectedItem, setDelSelectedItem] = useState();
  const [deleteLoad, setDeleteLoad] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      if (dashData?.paymentClick) {
        const payload = new FormData();
        payload.append('order_id', dashData?.orderUniqueId);
        payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
        billDeskResponseApi(payload)
          .then(res => {
            console.log('res', res?.response);
            if (res?.response === 'No Record Found') {
              setModalLoad(false);
              Toast.show(
                'Bill desk is on offline, Please select Cash on delivery',
                Toast.LONG,
              );
            } else if (res?.response?.transaction_error_code === 'TRS0000') {
              orderConfirmPaymentApiFunc(OC_res, res?.response);
            } else {
              setModalLoad(false);
              Toast.show('Payment Failed, please try again', Toast.LONG);
            }
          })
          .catch(err => {
            setModalLoad(false);
            Toast.show(
              'Bill desk is on offline, Please select Cash on delivery',
              Toast.LONG,
            );
            console.log('err', err);
          });

        dispatch(paymentEvent(false));
      }
    });
    return unsubscribe;
  }, [
    OC_res,
    dashData?.orderUniqueId,
    dashData?.paymentClick,
    dispatch,
    navigation,
    orderConfirmPaymentApiFunc,
    userData?.userData?.customer_ref_no,
  ]);

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
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    getCartTotalAmount(payload)
      .then(res => {
        setTotalAmountApi(res?.cartamount[0]);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [userData?.userData?.customer_ref_no, priceUpdate]);

  useEffect(() => {
    setCartLoad(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);

    getDefaultAddress(payload)
      .then(_res => {
        // console.log("res");
        setAddress(_res?.address_list[0]);
        if (_res?.address_list[0] !== 'Address List Empty') {
          dispatch(cartBillingAddress(_res?.address_list[0]));
          dispatch(cartDeliveryAddress(_res?.address_list[0]));
        } else {
          dispatch(cartBillingAddress(null));
          dispatch(cartDeliveryAddress(null));
        }
      })
      .catch(err => {
        console.log('err', err);
      });
    getSellerNo()
      .then(res => {
        setSellerData(res?.seller[0]);
      })
      .catch(err => {});

    getPaymentListApi()
      .then(res => {
        console.log('res payment', res);
        setPaymentList(res?.payment_list[0]);
      })
      .catch(err => {});

    cartTotalAmount(payload);
  }, [dispatch, userData?.userData?.customer_ref_no, flag]);

  const cartTotalAmount = payload => {
    let _total = 0;
    let _mrp = 0;
    let _tax = 0;
    getCartList(payload)
      .then(res => {
        // const arr = ['300101', '300125'];
        if (res?.cart === 'Empty Cart') {
          setCartList([]);
          setCartLoad(false);
          dispatch(updateCartNumber(0));
        } else {
          dispatch(updateCartNumber(res?.cart?.length));
          setCartList(res?.cart);
          let count = 0;
          res?.cart?.map((item, ind) => {
            _tax =
              _tax +
              parseFloat(
                item?.product_detail?.item_group[0]?.item_price_tax_value *
                  parseInt(item?.basket_quantity),
              );
            _total =
              _total +
              parseFloat(item?.product_detail?.item_group[0]?.item_price) *
                parseInt(item?.basket_quantity);

            _mrp =
              _mrp +
              parseFloat(item?.product_detail?.item_group[0]?.item_mrp_price) *
                parseInt(item?.basket_quantity);

            if (
              item?.product_detail?.item_group[0]?.item_cod_status ===
              'Avaliable'
            ) {
              count += 1;
            }
            if (!suggestionList?.length) {
              console.log('entry suggestoun list');
              setSuggestionLoad(true);
              const _payload = new FormData();
              _payload.append('item_ref_no', item?.item_ref_no);
              _payload.append('seller_ref_no', sellerData?.seller_ref_no);
              // if (ind < 2) {
              //   _payload.append('item_ref_no', arr[ind]);
              //   _payload.append('seller_ref_no', '12976');
              //   setSuggestionList([]);
              getSuggestionList(_payload)
                .then(_res => {
                  // console.log('_res', _res);
                  setSuggestionLoad(false);
                  if (_res?.suggestproduct !== 'No Record Found') {
                    _res?.suggestproduct?.map((items, index) => {
                      setSuggestionList(suggestionList => [
                        ...suggestionList,
                        items,
                      ]);
                    });
                  }
                })

                .catch(err => {
                  console.log('err', err);
                });
              // }
            }
          });

          if (count === res?.cart?.length) {
            setShowCod(true);
          } else {
            setShowCod(false);
          }
          setTotal(_total);
          setMrpPrice(_mrp);
          setTaxVal(_tax);
          setCartCountLoad(false);
          setCartLoad(false);
        }
      })
      .catch(err => {
        setCartLoad(false);
        console.log('err', err);
      });
  };

  const handleCartCount = (count, item) => {
    console.log('count', count);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    payload.append('item_price_ref_no', item?.item_group[0]?.item_price_ref_no);
    payload.append('item_ref_no', item?.item_ref_no);
    payload.append('basket_qty', count);
    const data = new FormData();
    data.append('customer_ref_no', userData?.userData?.customer_ref_no);

    addToCart(payload)
      .then(res => {
        cartTotalAmount(data);
        setPriceUpdate(Math.random());
      })
      .catch(err => {});
  };

  const handleDelCart = item => {
    setSelectDropDown(true);
    setDelSelectedItem(item);
  };

  const handleDelFromModal = () => {
    setDeleteLoad(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    payload.append(
      'item_price_ref_no',
      delSelectedItem?.item_group[0]?.item_price_ref_no,
    );
    delCart(payload)
      .then(res => {
        setFlag(Math.random());
        getCartList(payload)
          .then(_res => {
            setDeleteLoad(false);
            setSelectDropDown(false);
            if (_res?.cart === 'Empty Cart') {
              dispatch(updateCartNumber(0));
            } else {
              dispatch(updateCartNumber(_res?.cart?.length));
            }
          })
          .catch(err => {
            setDeleteLoad(false);
          });
      })
      .catch(err => {
        setDeleteLoad(false);
        console.log('err', err);
      });
  };

  const handleCartlist = ({item, index}) => {
    return (
      <ProductFlatCard
        title={item?.product_detail?.item_title}
        productImage={item?.product_detail?.item_img_url}
        price={item?.product_detail?.item_price}
        item={item?.product_detail}
        index={index}
        // handleCart={handleCart}
        showDropDown={false}
        sub_title={item?.product_detail?.item_name}
        delWishlist={true}
        handleDelWish={handleDelCart}
        counts={item?.basket_quantity}
        // counts={50000}
        showIndicator={true}
        handleCartCount={handleCartCount}
        cartCountLoad={cartCountLoad}
        setCartCountLoad={setCartCountLoad}
        type="remove cart"
        setSelectProduct={setSelectProduct}
        selectProduct={selectProduct}
        showgramsVal={true}
      />
    );
  };

  const handleClearCart = useCallback(() => {
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    clearCart(payload)
      .then(res => {
        // setFlag(Math.random());
        getCartList(payload)
          .then(_res => {
            if (_res?.cart === 'Empty Cart') {
              dispatch(updateCartNumber(0));
            } else {
              dispatch(updateCartNumber(_res?.cart?.length));
            }
          })
          .catch(err => {});
      })
      .catch(err => {});
  }, [dispatch, userData?.userData?.customer_ref_no]);

  const generateToken = async (ipaddress, data, _total) => {
    try {
      let billdeskPayload = {};
      //   let livePayload = {mercid:"BDUATV2TND"};
      if (__DEV__) {
        // url = 'https://uat1.billdesk.com/u2/payments/ve1_2/orders/create'; // Replace with your server endpoint
        billdeskPayload = {
          ...billdeskPayload,
          //   url: 'https://api.billdesk.com/payments/ve1_2/orders/create',
          url: 'https://uat1.billdesk.com/u2/payments/ve1_2/orders/create',
          mercid: 'BDUATV2TND',
          clientid: 'bduatv2tnd',
          securityKey: 'Cjlj6qiBlQ7qdnglXvlJCKY1t3rNk7x4',
        };
        // billdeskPayload = {
        //   ...billdeskPayload,
        //   url: 'https://api.billdesk.com/payments/ve1_2/orders/create',
        //   mercid: 'JBJANBNSCS',
        //   clientid: 'jbjanbnscs',
        //   securityKey: 'dwemtdrtbzW6WvAdLySf3IL9Tmg22xQU',
        // };
      } else {
        // billdeskPayload = {
        //   ...billdeskPayload,
        //   url: 'https://api.billdesk.com/payments/ve1_2/orders/create',
        //   mercid: 'JBJANBNSCS',
        //   clientid: 'jbjanbnscs',
        //   securityKey: 'dwemtdrtbzW6WvAdLySf3IL9Tmg22xQU',
        // };
        billdeskPayload = {
          ...billdeskPayload,
          //   url: 'https://api.billdesk.com/payments/ve1_2/orders/create',
          url: 'https://uat1.billdesk.com/u2/payments/ve1_2/orders/create',
          mercid: 'BDUATV2TND',
          clientid: 'bduatv2tnd',
          securityKey: 'Cjlj6qiBlQ7qdnglXvlJCKY1t3rNk7x4',
        };
        // url = 'https://api.billdesk.com/payments/ve1_2/orders/create'; // Replace with your server endpoint
      }

      // Your payload data
      // order_date: new moment().format('YYYY-MM-DDTHH:mm:ssZ'),
      // ru: 'https://www.hydrocart.in/pg/response.php',
      var uniqueId = uuid.v4();
      dispatch(orderIdFunc(uniqueId));
      const payload = {
        mercid: billdeskPayload.mercid,
        orderid: uniqueId,
        amount: _total,
        // amount: '350.00',
        order_date: new moment().format('YYYY-MM-DDTHH:mm:ssZ'),
        currency: '356',
        ru: 'https://www.influx360.net/rest/pub/v1/response',
        additional_info: {
          additional_info1: data,
          additional_info2: `${API.Authorization}_${userData?.userData?.customer_ref_no}`,
        },
        itemcode: 'DIRECT',
        device: {
          init_channel: 'internet',
          //   ip: ipaddress,
          ip: '108.161.136.247',
          accept_header: 'text/html',
          fingerprintid: '61b12c18b5d0cf901be34a23ca64bb19',
        },
      };

      const billdesk_payload = new FormData();
      billdesk_payload.append('merchantid', billdeskPayload?.mercid);
      billdesk_payload.append('clientid', billdeskPayload?.clientid);
      billdesk_payload.append('securitykey', billdeskPayload?.securityKey);
      billdesk_payload.append(
        'apiurl',
        // 'https://uat1.billdesk.com/u2/payments/ve1_2/orders/create',
        billdeskPayload?.url,
      );
      billdesk_payload.append('payload', JSON.stringify(payload));
      billdesk_payload.append('bdtime', new Date().getFullYear() + Date.now());
      billdesk_payload.append(
        'bdtraceid',
        new Date().getFullYear() + Date.now() + 'ABD1K',
      );

      console.log('bill desk payload', billdesk_payload);

      billdeskApi(billdesk_payload)
        .then(res => {
          console.log('res from bill desk', res);
          if (res?.status === 401) {
            setModalLoad(false);
            Toast.show(
              'Bill desk is on offline, Please select Cash on delivery',
              //   'assdasdasdasdasdasadsdsad',
              Toast.LONG,
            );
          } else {
            try {
              if (res === '') {
                throw 'error';
              }
              let data_payload = {};
              Object.entries(res)?.map((item, index) => {
                // console.log('item', item);
                if (item[0] === 'logo') {
                  data_payload = {
                    ...data_payload,
                    logo: item[1],
                  };
                }
                if (item[0] === 'payload') {
                  let data = item[1];

                  if (data[1]?.headers?.authorization) {
                    data_payload = {
                      ...data_payload,
                      token: data[1]?.headers?.authorization,
                      orderId: data[1]?.parameters?.bdorderid,
                      merchantId: billdeskPayload?.mercid,
                    };
                  } else {
                    setModalLoad(false);
                    Toast.show(
                      'Bill desk is on offline, Please select Cash on delivery',
                      Toast.LONG,
                    );
                  }
                  // navigation.navigate(Routes.PAYMENT, {
                  //   token: data[1]?.headers?.authorization,
                  //   orderId: data[1]?.parameters?.bdorderid,

                  //   merchantId: billdeskPayload?.mercid,
                  // });
                }
              });
              console.log('data_payload', data_payload);
              if (data_payload?.token && data_payload?.orderId) {
                navigation.navigate(Routes.PAYMENT, {
                  token: data_payload.token,
                  orderId: data_payload?.bdorderid,
                  merchantId: data_payload?.mercid,
                  logo: data_payload?.logo,
                });
              } else {
                setModalLoad(false);
                Toast.show(
                  'Bill desk is on offline, Please select Cash on delivery',
                  Toast.LONG,
                );
              }
            } catch (e) {
              setModalLoad(false);
              Toast.show(
                'Bill desk is on offline, Please select Cash on delivery',
                Toast.LONG,
              );
            }
          }
        })
        .catch(err => {
          setModalLoad(false);
          Toast.show(
            'Bill desk is on offline, Please select Cash on delivery',
            Toast.LONG,
          );
          console.log('rrr', err);
        });
    } catch (e) {
      console.log('generate error', e);
    }
  };

  const handleSubmit = () => {
    if (dashData?.billingAddress?.customer_address_line_1) {
      setModalLoad(true);

      const payload = new FormData();
      let _data = '';

      DEVICE_IP_ADDRESS.then(ipaddress => {
        cartList.map((item, index) => {
          let data = {
            seller_ref_no: sellerData?.seller_ref_no,
            item_ref_no: item?.item_ref_no,
            item_price_ref_no:
              item?.product_detail?.item_group[0]?.item_price_ref_no,
            //   item_name: item?.product_detail?.item_name,
            //   item_mrp: item?.product_detail?.item_mrp_price,
            //   item_ourprice: item?.product_detail?.item_price,
            //   item_weg: item?.product_detail?.item_uom_unit,
            //   item_uom: item?.product_detail?.item_uom,
            //   item_qty: item?.basket_quantity,
            //   discount_type: item?.product_detail?.item_discount_type,
            //   disc_percentage: item?.product_detail?.item_discount_value,
            //   item_disc_price: item?.product_detail?.item_price,
            item_name: item?.product_detail?.item_group[0]?.item_name,
            item_mrp: item?.product_detail?.item_group[0]?.item_mrp_price,
            item_ourprice: item?.product_detail?.item_group[0]?.item_price,
            item_weg: item?.product_detail?.item_group[0]?.item_uom_unit,
            item_uom: item?.product_detail?.item_group[0]?.item_uom,
            item_qty: item?.basket_quantity,
            discount_type:
              item?.product_detail?.item_group[0]?.item_discount_type,
            disc_percentage:
              item?.product_detail?.item_group[0]?.item_discount_value,
            item_disc_price: item?.product_detail?.item_group[0]?.item_price,
            cgst: '0',
            sgst: '0',
            igst: '0',
            order_date: new moment().format('YYYY-MM-DD hh:mm:ss'),
          };
          _data =
            _data +
            `${item?.product_detail?.item_group[0]?.item_price_ref_no}*${item?.basket_quantity}`;
          payload.append('cart_list[]', JSON.stringify(data));
        });

        payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
        payload.append('orders_status', 1);

        payload.append(
          'order_total_value',
          totalAmountApi?.item_price_taxable_value_total,
        );
        payload.append(
          'order_total_tax_value',
          totalAmountApi?.item_price_tax_value_total,
        );
        payload.append(
          'order_total_sales_value',
          totalAmountApi?.item_grand_total,
        );
        payload.append(
          'order_shipping_value',
          totalAmountApi?.item_ship_price_total,
        );

        payload.append(
          'deli_name',
          dashData?.deliveryAddress?.customer_firstname,
        );
        payload.append(
          'deli_address1',
          dashData?.deliveryAddress?.customer_address_line_1,
        );
        payload.append('deli_address2', '');
        payload.append(
          'deli_landmark',
          dashData?.deliveryAddress?.customer_landmark,
        );
        payload.append('deli_city', dashData?.deliveryAddress?.customer_city);
        payload.append('deli_district', dashData?.deliveryAddress?.district_id);
        payload.append('deli_state', dashData?.deliveryAddress?.state_id);
        payload.append('deli_country', dashData?.deliveryAddress?.country_id);
        payload.append('deli_zipcode', dashData?.deliveryAddress?.pincode);
        payload.append(
          'deli_phone',
          dashData?.deliveryAddress?.customer_mobile_no,
        );
        payload.append('deli_email', '');
        payload.append(
          'bill_name',
          dashData?.billingAddress?.customer_firstname,
        );
        payload.append(
          'bill_address1',
          dashData?.billingAddress?.customer_address_line_1,
        );
        payload.append('bill_address2', '');
        payload.append(
          'bill_landmark',
          dashData?.billingAddress?.customer_landmark,
        );
        payload.append('bill_city', dashData?.billingAddress?.customer_city);
        payload.append('bill_district', dashData?.billingAddress?.district_id);
        payload.append('bill_state', dashData?.billingAddress?.state_id);
        payload.append('bill_country', dashData?.billingAddress?.country_id);
        payload.append('bill_zipcode', dashData?.billingAddress?.pincode);
        payload.append(
          'bill_phone',
          dashData?.billingAddress?.customer_mobile_no,
        );
        payload.append('bill_email', '');
        payload.append('bill_gst', '');
        payload.append(
          'payment_method',
          selectedPaymentMethod === 1 ? 'COD' : paymentList?.payment_code,
        );
        payload.append(
          'payment_module_code',
          selectedPaymentMethod === 1 ? 'PAY_COD' : paymentList?.payment_code,
        );
        payload.append('shipping_method', '');
        payload.append('shipping_module_code', '');
        payload.append(
          'purchase_date',
          new moment().format('YYYY-MM-DD hh:mm:ss'),
        );
        payload.append('currency', 'INR');
        payload.append('currency_value', 1);
        payload.append('coupon_code', 'NULL');
        payload.append('ip_address', ipaddress);
        payload.append(
          'payment_mode',
          selectedPaymentMethod === 1 ? 'COD' : 'Payment',
        );
        payload.append('orders_instruction', notes);

        OrderConfirmApi(payload)
          .then(res => {
            setOC_res(res);
            if (selectedPaymentMethod === 1) {
              orderConfirmPaymentApiFunc(res);
            } else {
              dispatch(paymentEvent(true));
              generateToken(ipaddress, _data, totalAmountApi?.item_grand_total);
            }
          })
          .catch(err => {
            console.log('err', err);
          });
      }).catch(err => {});
    } else {
      Toast.show('Please select address', Toast.LONG);
    }
    // console.log('payload', payload);
    // navigation.navigate(Routes.PAYMENT);
  };

  const orderConfirmPaymentApiFunc = useCallback(
    (res, billdeskres) => {
      const _payload = new FormData();
      _payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
      _payload.append('sales_order_ref_no', res?.sales_order_ref_no);
      _payload.append('sales_referral_no', res?.sales_referral_no);
      _payload.append(
        'payment_mode',
        selectedPaymentMethod === 1 ? 'COD' : paymentList?.payment_code,
      );
      _payload.append(
        'payment_status',
        selectedPaymentMethod === 1
          ? 'success'
          : billdeskres === 'No Record Found'
          ? 'failed'
          : 'success',
      );
      _payload.append(
        'payment_date',
        selectedPaymentMethod === 1
          ? new moment().format('YYYY-MM-DD hh:mm:ss')
          : billdeskres?.transaction_date ?? '',
      );
      _payload.append(
        'payment_paid',
        selectedPaymentMethod === 1 ? 'NULL' : billdeskres?.amount ?? '',
      );
      _payload.append(
        'payment_fee',
        selectedPaymentMethod === 1 ? '' : billdeskres?.charge_amount ?? '',
      );
      _payload.append(
        'payment_currency',
        selectedPaymentMethod === 1 ? '' : billdeskres?.currency ?? '',
      );
      _payload.append(
        'payment_unique_id',
        selectedPaymentMethod === 1 ? '' : billdeskres?.orderid ?? '',
      );

      _payload.append(
        'payment_transaction_id',
        selectedPaymentMethod === 1 ? '' : billdeskres?.transactionid ?? '',
      );
      _payload.append(
        'payment_source',
        selectedPaymentMethod === 1 ? '' : paymentList?.payment_code ?? '',
      );
      _payload.append(
        'payment_type',
        selectedPaymentMethod === 1
          ? ''
          : billdeskres?.payment_method_type ?? '',
      );
      _payload.append(
        'reason_code',
        selectedPaymentMethod === 1
          ? ''
          : billdeskres?.transaction_error_code ?? '',
      );
      _payload.append('pending_reason', selectedPaymentMethod === 1 ? '' : '');
      _payload.append(
        'payment_bank_ref_no',
        selectedPaymentMethod === 1 ? '' : billdeskres?.bank_ref_no ?? '',
      );

      _payload.append(
        'payment_bank_code',
        selectedPaymentMethod === 1 ? '' : billdeskres?.bankid ?? '',
      );
      _payload.append(
        'payment_card_name',
        selectedPaymentMethod === 1 ? '' : '',
      );
      _payload.append(
        'payment_card_num',
        selectedPaymentMethod === 1 ? '' : '',
      );

      orderConfirmPaymentApi(_payload)
        .then(_res => {
          setModalLoad(false);
          if (billdeskres === 'No Record Found') {
          } else {
            handleClearCart();
            navigation.navigate(Routes.ORDER);
          }
        })
        .catch(err => {
          setModalLoad(false);
          console.log('err', err);
        });
    },
    [
      handleClearCart,
      navigation,
      paymentList?.payment_code,
      selectedPaymentMethod,
      userData?.userData?.customer_ref_no,
    ],
  );

  const handleCart = item => {
    dispatch(productSlugDetials(item));
    dispatch(bottomSheetControl(true));
  };

  const handleCartDone = () => {
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    cartTotalAmount(payload);
  };

  const handleSuggestionList = ({item, index}) => {
    return (
      <ProductCard
        title={item?.item_name}
        productImage={item?.item_img_url}
        price={item?.item_price}
        item={item}
        index={index}
        handleCart={handleCart}
        showDropDown={false}
      />
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: color.palette.white}}>
      <CommonHeader
        handleClear={handleClearCart}
        title={'Cart'}
        // showClear={true}
        screens={'Cart'}
      />
      {cartLoad ? (
        <ProductFlatRectLoader />
      ) : (
        <>
          {cartList.length ? (
            <FlatList
              data={cartList}
              key="<"
              keyExtractor={(item, index) => {
                return '<' + index;
              }}
              renderItem={handleCartlist}
              ListFooterComponent={
                <>
                  <Vertical size={20} />
                  {suggestionList?.length ? (
                    <>
                      <Text style={styles.addtitle}>You also may like</Text>
                      {suggestionLoad ? (
                        <ProductRectLoader />
                      ) : (
                        <FlatList
                          data={suggestionList}
                          key="?"
                          style={{marginLeft: 20}}
                          keyExtractor={(item, index) => {
                            return '?' + index;
                          }}
                          renderItem={handleSuggestionList}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                        />
                      )}
                    </>
                  ) : null}
                  <Vertical size={20} />

                  <Text style={styles.addtitle}>Billing Address</Text>
                  {dashData?.billingAddress?.customer_address_line_1 ? (
                    <View
                      style={[
                        styles.addressView,
                        {flex: 1, justifyContent: 'space-between'},
                      ]}>
                      <Image
                        source={require('../assets/icon/location.png')}
                        style={styles.loc}
                      />
                      <Text
                        style={
                          styles.addressTxt
                        }>{`${dashData?.billingAddress?.customer_address_line_1}, ${dashData?.billingAddress?.customer_landmark}, ${dashData?.billingAddress?.customer_city}, ${dashData?.billingAddress?.district_name}, ${dashData?.billingAddress?.state_name}, ${dashData?.billingAddress?.country_name} `}</Text>
                      <Text
                        style={styles.change}
                        onPress={() => {
                          dispatch(fromCartToAddress('billing'));
                          navigation.navigate(Routes.ADDRESS_LIST);
                        }}>
                        Change
                      </Text>
                    </View>
                  ) : (
                    <View style={{marginHorizontal: 20, marginVertical: 10}}>
                      <Button
                        title="Add Address"
                        style={styles.button}
                        textStyle={styles.btnTxt}
                        onPress={() => {
                          dispatch(fromCartToAddress('billing'));
                          navigation.navigate(Routes.ADDRESS_LIST);
                        }}
                      />
                    </View>
                  )}
                  <Vertical size={10} />
                  <Text style={styles.addtitle}>Delivery Address</Text>
                  {dashData?.deliveryAddress?.customer_address_line_1 ? (
                    <View
                      style={[
                        styles.addressView,
                        {flex: 1, justifyContent: 'space-between'},
                      ]}>
                      <Image
                        source={require('../assets/icon/location.png')}
                        style={styles.loc}
                      />
                      <Text
                        style={
                          styles.addressTxt
                        }>{`${dashData?.deliveryAddress?.customer_address_line_1}, ${dashData?.deliveryAddress?.customer_landmark}, ${dashData?.deliveryAddress?.customer_city}, ${dashData?.deliveryAddress?.district_name}, ${dashData?.deliveryAddress?.state_name}, ${dashData?.deliveryAddress?.country_name} `}</Text>
                      <Text
                        onPress={() => {
                          dispatch(fromCartToAddress('delivery'));
                          navigation.navigate(Routes.ADDRESS_LIST);
                        }}
                        style={styles.change}>
                        Change
                      </Text>
                    </View>
                  ) : (
                    <View style={{marginHorizontal: 20, marginVertical: 10}}>
                      <Button
                        title="Add Address"
                        style={styles.button}
                        textStyle={styles.btnTxt}
                        onPress={() => {
                          dispatch(fromCartToAddress('delivery'));
                          navigation.navigate(Routes.ADDRESS_LIST);
                        }}
                      />
                    </View>
                  )}
                  <Vertical size={10} />

                  {showNotes ? (
                    <TextField
                      checkVerify={true}
                      v_title="close"
                      v_press={() => {
                        setShowNotes(false);
                      }}
                      value={notes}
                      onChangeText={text => {
                        setNotes(text);
                      }}
                      // onBlur={handleBlur('address')}
                      label="Add Notes"
                      labelStyle={{
                        color: color.palette.textFieldGrey,
                        marginHorizontal: 20,
                      }}
                      // errorMessage={touched.Address && errors.Address}
                      placeholder={'Enter your order notes'}
                      placeholderStyle={color.palette.black}
                      inputStyle={[
                        styles.inputStyle,
                        {
                          textAlignVertical: 'top',
                          paddingVertical: 10,
                          marginHorizontal: 20,
                        },
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
                  ) : (
                    <Pressable
                      onPress={() => {
                        setShowNotes(true);
                      }}>
                      <View
                        style={[
                          styles.addressView,
                          {justifyContent: 'space-between'},
                        ]}>
                        <Text style={styles.addtitle}>Add Notes</Text>
                        <Image
                          source={require('../assets/icon/add.png')}
                          style={{height: 17, width: 15, alignSelf: 'center'}}
                        />
                      </View>
                    </Pressable>
                  )}
                  <Vertical size={10} />
                  <Text style={styles.addtitle}>Payment Method</Text>
                  <View style={[styles.addressView, {flexDirection: 'column'}]}>
                    <Pressable
                      disabled={true}
                      style={
                        selectedPaymentMethod === 0
                          ? [
                              styles.payMethodView,
                              {
                                backgroundColor: color.palette.btnColor,
                              },
                            ]
                          : [
                              styles.payMethodView,
                              {borderColor: color.palette.grey},
                            ]
                      }
                      onPress={() => {
                        setSelectedPaymentMethod(0);
                      }}>
                      <Image
                        source={require('../assets/icon/card.png')}
                        style={
                          selectedPaymentMethod === 0
                            ? [
                                styles.cardIcon,
                                {tintColor: color.palette.white},
                              ]
                            : [styles.cardIcon, {tintColor: color.palette.grey}]
                        }
                      />
                      <Text
                        style={
                          selectedPaymentMethod === 0
                            ? [styles.cardTxt, {color: color.palette.white}]
                            : [styles.cardTxt, {color: color.palette.grey}]
                        }>
                        pay using card/UPI{' '}
                      </Text>
                    </Pressable>
                    <Vertical size={15} />
                    {showCod && (
                      <Pressable
                        onPress={() => {
                          setSelectedPaymentMethod(1);
                        }}
                        style={
                          selectedPaymentMethod === 1
                            ? [
                                styles.payMethodView,
                                {backgroundColor: color.palette.btnColor},
                              ]
                            : styles.payMethodView
                        }>
                        <Image
                          source={require('../assets/icon/wallet.png')}
                          style={
                            selectedPaymentMethod === 1
                              ? [
                                  styles.cardIcon,
                                  {tintColor: color.palette.white},
                                ]
                              : styles.cardIcon
                          }
                        />
                        <Text
                          style={
                            selectedPaymentMethod === 1
                              ? [styles.cardTxt, {color: color.palette.white}]
                              : styles.cardTxt
                          }>
                          Cash on delivery{' '}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                  <Text style={styles.addtitle}>Bill Amount </Text>
                  <View style={[styles.addressView, {flexDirection: 'column'}]}>
                    <View style={styles.amountView}>
                      <Text
                        style={[
                          styles.leftTxt,
                          {fontFamily: typography.primary, width: '50%'},
                        ]}>
                        Sub total
                      </Text>
                      <Text style={[styles.leftTxt, {width: '20%'}]}>:</Text>
                      <Text
                        style={[
                          styles.leftTxt,
                          {width: '30%', textAlign: 'right'},
                        ]}>
                        ₹ {totalAmountApi?.item_mrp_price_total}
                      </Text>
                    </View>

                    <View style={styles.amountView}>
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
                        ₹ -{totalAmountApi?.item_discount_price_total}
                      </Text>
                    </View>
                    <View style={styles.amountView}>
                      <Text
                        style={[
                          styles.leftTxt,
                          {fontFamily: typography.primary, width: '50%'},
                        ]}>
                        Shipping
                      </Text>
                      <Text style={[styles.leftTxt, {width: '20%'}]}>:</Text>
                      <Text
                        style={[
                          styles.leftTxt,
                          {width: '30%', textAlign: 'right'},
                        ]}>
                        ₹ {totalAmountApi?.item_ship_price_total}
                      </Text>
                    </View>
                    {/* <View style={styles.amountView}>
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
                        ₹ {totalAmountApi?.item_price_tax_value_total}
                      </Text>
                    </View> */}
                  </View>
                  <View style={[styles.bottomTotal]}>
                    <View>
                      <Text
                        style={[
                          styles.totalText,
                        ]}>{`Total amount : ₹ ${totalAmountApi?.item_grand_total}`}</Text>
                      <Text
                        style={{
                          fontFamily: typography.primary,
                          fontSize: FontSize.font_small_E,
                          color: color.palette.btnColor,
                        }}>
                        {'(Inclusive of all taxes)'}
                      </Text>
                    </View>
                    <Button
                      title={'Place order'}
                      style={styles.button}
                      textStyle={styles.btnTxt}
                      onPress={handleSubmit}
                      //   loading={isSubmitting}
                      // disabled={!restProps.isValid}
                    />
                  </View>
                </>
              }
            />
          ) : (
            <View style={styles.emptyView}>
              <Image
                source={require('../assets/icon/_cart.png')}
                style={{height: 140, width: 140, alignSelf: 'center'}}
              />
              {/* <Text style={styles.norecord}>No Cart Found</Text> */}
              <Text style={styles.emptyCart}>Your cart is empty</Text>
              <Text style={styles.emptyCartSubTitle}>Please add some item</Text>
              <Vertical size={26} />
              <Button
                title={'Continue Shopping'}
                style={[styles.button, {alignSelf: 'center'}]}
                textStyle={styles.btnTxt}
                onPress={() => {
                  navigation.navigate(Routes.HOME);
                }}
              />
            </View>
          )}
          {dashData.isBottomSheetOpen ? (
            <BottomSheet handleCartDone={handleCartDone} />
          ) : null}
        </>
      )}

      <Modal
        transparent={true}
        visible={modalLoad}
        animationType="fade"
        style={{alignSelf: 'center'}}>
        <View style={styles.modalSheet}>
          <Loader size="large" />
        </View>
      </Modal>

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
                Are you sure you want to delete this product?
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
  norecord: {
    fontFamily: typography.secondary,
    fontSize: FontSize.font_medium_E,
    color: color.palette.red,
    textAlign: 'center',
    marginTop: 30,
  },
  clear: {
    fontFamily: typography.medium,
    fontSize: FontSize.font_large_E,
    color: color.palette.blue,
  },
  loc: {
    width: 20,
    height: 26,
    marginRight: 5,
    marginLeft: 9,
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
    width: '70%',
    // flex: 0.75,
  },
  addtitle: {
    fontFamily: typography.medium,
    fontSize: FontSize.font_large_E,
    color: color.palette.black,
    marginLeft: 20,
  },
  change: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_small_E,
    right: 3,
    color: color.palette.btnColor,
    textDecorationLine: 'underline',
  },
  payMethodView: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderColor: color.palette.btnColor,
    borderRadius: 5,
    marginLeft: 10,
    paddingLeft: 5,
    paddingVertical: 5,
  },
  cardIcon: {
    height: 20,
    width: 20,
    tintColor: color.palette.btnColor,
    marginRight: 5,
  },
  cardTxt: {
    fontFamily: typography.medium,
    fontSize: FontSize.font_small_E,
    color: color.palette.btnColor,
    alignSelf: 'center',
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
  },
  centerTxt: {},
  bottomTotal: {
    backgroundColor: color.palette.white,
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    // borderTopWidth: 1,
  },
  button: {
    backgroundColor: color.palette.btnColor,
    borderRadius: 5,
    height: 35,
  },
  btnTxt: {
    fontSize: FontSize.font_medium_E,
    fontFamily: typography.primary,
    // lineHeight: 14,
    // letterSpacing: 0.2,
    color: color.palette.white,
  },
  totalText: {
    fontFamily: typography.medium,
    alignSelf: 'center',
    fontSize: FontSize.font_medium_E,
    color: color.palette.black,
  },
  emptyCart: {
    fontFamily: typography.medium,
    fontSize: FontSize.font_Ex_Large_E,
    color: color.palette.black,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyCartSubTitle: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_small_E,
    color: color.palette.txtGrey,
    textAlign: 'center',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalSheet: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
