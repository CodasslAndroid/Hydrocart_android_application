import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Modal,
  Image,
  Pressable,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  bottomSheetControl,
  updateCartNumber,
} from '../../redux/slices/dashSlice';
import {
  addToCart,
  addWhislist,
  delWhislist,
  getCartList,
  getWislist,
  productDetails,
} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import Carousel from 'react-native-snap-carousel';
import {Button, Divider, Loader, Vertical} from '../../ui-kit';

export const BottomSheet = ({handleCartDone = () => {}}) => {
  const bottomSheetOpen = useSelector(state => state?.dash);
  const userData = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [productDetail, setProductDetail] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const [selectedItem, setSelectedItem] = useState();
  const [count, setCount] = useState(1);
  const [price, setPrice] = useState();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [wislistAdded, setWishlist] = useState(false);
  const [wishlistData, setWishlistData] = useState([]);

  useEffect(() => {
    setModalLoading(true);
    const _payload = new FormData();
    _payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    getWislist(_payload)
      .then(_res => {
        setWishlistData(_res);
        const payload = new FormData();
        payload.append('slug', bottomSheetOpen?.productDetialsData?.item_slug);
        productDetails(payload)
          .then(res => {
            console.log('res?.product[0]', res?.product[0]);
            setProductDetail(res?.product[0]);
            setSelectedItem(res?.product[0]?.item_group[0]);
            setPrice(parseFloat(res?.product[0]?.item_group[0]?.item_price));
            const imageLinks = Object.keys(res?.product[0])
              .filter(
                key =>
                  key.startsWith('item_img') &&
                  !key.endsWith('small') &&
                  res.product[0][key],
              )
              .map(key => res.product[0][key]);
            if (_res?.cart !== 'Empty Cart') {
              checkWishlistSelectedItem(_res, res?.product[0]?.item_group[0]);
            }

            setImageList(imageLinks);
            setModalLoading(false);
          })

          .catch(err => {
            console.log('err', err);
            setModalLoading(false);
          });
      })
      .catch(err => {
        console.log('ertt', err);
      });
  }, [
    bottomSheetOpen?.productDetialsData?.item_slug,
    userData?.userData?.customer_ref_no,
    bottomSheetOpen.isBottomSheetOpen,
    checkWishlistSelectedItem,
  ]);

  const checkWishlist = (_res, res) => {
    _res?.cart?.map((item, index) => {
      res?.item_group?.map((_item, _index) => {
        if (_item?.item_price_ref_no === item?.item_price_ref_no) {
          setWishlist(true);
        }
      });
    });
  };

  const checkWishlistSelectedItem = useCallback((_res, res) => {
    setWishlist(false);

    _res?.cart?.map((item, index) => {
      //   res?.item_group?.map((_item, _index) => {
      //     console.log(_item?.item_price_ref_no === item?.item_price_ref_no);
      if (res?.item_price_ref_no === item?.item_price_ref_no) {
        setWishlist(true);
      }
      //   });
    });
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <Image source={{uri: item}} resizeMode="cover" style={styles.image} />
    );
  };

  const handleCart = () => {
    setLoading(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    payload.append('item_price_ref_no', selectedItem.item_price_ref_no);
    payload.append('item_ref_no', productDetail?.item_ref_no);
    payload.append('basket_qty', count);

    addToCart(payload)
      .then(res => {
        setLoading(false);
        dispatch(bottomSheetControl(false));
        setSelectedItem();
        setCount(1);
        setPrice();
        setWishlist(false);
        handleCartDone();
        console.log('res', res);
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
      .catch(err => {
        setLoading(false);
        console.log('err', err);
      });
  };

  const updateWishlist = () => {
    const _payload = new FormData();
    _payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    getWislist(_payload)
      .then(_res => {
        setWishlistData(_res);
      })
      .catch(err => {});
  };
  const handleWishlist = () => {
    if (!wislistAdded) {
      setWishlist(true);
      const payload = new FormData();
      payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
      payload.append('item_price_ref_no', selectedItem?.item_price_ref_no);
      payload.append('item_ref_no', productDetail?.item_ref_no);
      payload.append('basket_qty', 1);

      addWhislist(payload)
        .then(res => {
          updateWishlist();
          // setW_Loading(false);
        })
        .catch(err => {
          console.log('err', err);
        });
    } else {
      setWishlist(false);
      const payload = new FormData();
      payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
      payload.append('item_price_ref_no', selectedItem?.item_price_ref_no);
      delWhislist(payload)
        .then(res => {
          updateWishlist();
          // setW_Loading(false);
        })
        .catch(err => {
          console.log('err', err);
        });
    }
  };

  return (
    <Modal
      transparent={true}
      visible={bottomSheetOpen.isBottomSheetOpen}
      animationType="fade"
      //   style={{alignSelf: 'center'}}
    >
      <View style={styles.transparentSheet}>
        <Pressable
          onPress={() => {
            dispatch(bottomSheetControl(false));
            setSelectedItem();
            setCount(1);
            setPrice();
            setWishlist(false);
          }}>
          <Image
            source={require('../../assets/icon/b_close.png')}
            style={styles.closeImg}
          />
        </Pressable>
        {modalLoading ? (
          <View style={styles.bottomSheetTransparent}>
            <View style={styles.topContainer}>
              <Loader />
            </View>
          </View>
        ) : (
          <View style={styles.bottomSheetTransparent}>
            <View style={styles.topContainer}>
              <Carousel
                data={imageList}
                renderItem={renderItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width}
                layout={'default'}
                loop
                autoplay
                autoplayInterval={3000}
                key=")"
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 15,
                  // backgroundColor: 'red',
                  marginTop: 13,
                  marginBottom: 15,
                }}>
                <View>
                  <Text
                    style={{
                      color: color.palette.black,
                      fontFamily: typography.medium,
                      fontSize: FontSize.font_medium_E,
                    }}>
                    {productDetail?.item_title}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    {star.map((item, index) => {
                      return (
                        <Image
                          key={'(' + index}
                          source={require('../../assets/icon/star1.png')}
                          style={{height: 10, width: 10, marginRight: 3}}
                        />
                      );
                    })}
                    <Text
                      style={{
                        fontFamily: typography.primary,
                        fontSize: FontSize.font_extra_small_O,
                      }}>
                      (129)
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    onPress={() => {
                      handleWishlist();
                    }}>
                    <Image
                      source={
                        wislistAdded
                          ? require('../../assets/icon/heartFill.png')
                          : require('../../assets/icon/heart.png')
                      }
                      style={{height: 15, width: 15, marginRight: 15}}
                    />
                  </Pressable>
                  <Image
                    source={require('../../assets/icon/share.png')}
                    style={{height: 14, width: 16}}
                  />
                </View>
              </View>
            </View>
            <View style={styles.middleContainer}>
              <Text
                style={{
                  fontFamily: typography.medium,
                  fontSize: FontSize.font_medium_E,
                  color: color.palette.black,
                  marginLeft: 8,
                  marginTop: 10,
                }}>
                {'Quantity'}
              </Text>
              <Text
                style={{
                  fontFamily: typography.medium,
                  fontSize: FontSize.font_small_E,
                  marginLeft: 8,
                  marginBottom: 5.5,
                  color: color.palette.grey,
                }}>
                Select any 1 option
              </Text>
              <Divider />
              {productDetail?.item_group?.map((item, index) => {
                return (
                  <Pressable
                    key={`+${index}`}
                    onPress={() => {
                      setSelectedItem(item);
                      setPrice(parseFloat(item?.item_price));
                      setPrice(item?.item_price * count);
                      if (wishlistData?.cart !== 'Empty Cart') {
                        checkWishlistSelectedItem(wishlistData, item);
                      }
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 10,
                        marginTop: 10,
                      }}>
                      <Text
                        style={
                          selectedItem?.item_price_ref_no ===
                          item?.item_price_ref_no
                            ? {
                                fontFamily: typography.medium,
                                fontSize: FontSize.font_medium_E,
                                color: color.palette.black,
                              }
                            : {
                                fontFamily: typography.primary,
                                fontSize: FontSize.font_medium_E,
                                color: color.palette.black,
                              }
                        }>
                        {item?.item_uom_unit} {item?.item_uom_name}
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={
                            selectedItem?.item_price_ref_no ===
                            item?.item_price_ref_no
                              ? {
                                  fontFamily: typography.medium,
                                  fontSize: FontSize.font_medium_E,
                                  color: color.palette.black,
                                }
                              : {
                                  fontFamily: typography.primary,
                                  fontSize: FontSize.font_medium_E,
                                  color: color.palette.black,
                                }
                          }>
                          ₹ {item?.item_price}
                        </Text>
                        <View
                          style={{
                            height: 12,
                            width: 12,
                            borderRadius: 100,
                            borderColor: color.palette.btnColor,
                            borderWidth: 1,
                            alignSelf: 'center',
                            marginLeft: 5,
                            justifyContent: 'center',
                          }}>
                          {selectedItem?.item_price_ref_no ===
                          item?.item_price_ref_no ? (
                            <View
                              style={{
                                height: 6,
                                width: 6,
                                backgroundColor: color.palette.btnColor,
                                borderRadius: 6,
                                alignSelf: 'center',
                              }}
                            />
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
              <Vertical size={5} />
            </View>
            <View style={styles.footer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: color.palette.fadeBrown,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                  }}>
                  {/* <Text style={{fontFamily: typography.secondary}}>-</Text> */}
                  <Pressable
                    style={{alignSelf: 'center'}}
                    onPress={() => {
                      if (count > 1) {
                        setCount(count - 1);
                        let _count = count - 1;
                        setPrice(selectedItem?.item_price * _count);
                      }
                    }}>
                    <Image
                      source={require('../../assets/icon/minus.png')}
                      style={styles.minus}
                    />
                  </Pressable>
                  <Text style={styles.valueCount}>{count}</Text>
                  <Pressable
                    style={{alignSelf: 'center'}}
                    onPress={() => {
                      setCount(count + 1);
                      let _count = count + 1;
                      setPrice(selectedItem?.item_price * _count);
                    }}>
                    <Image
                      source={require('../../assets/icon/plus.png')}
                      style={styles.plus}
                    />
                  </Pressable>
                </View>
                <Button
                  title={`Add items ₹ ${price}.00`}
                  style={styles.button}
                  onPress={() => {
                    handleCart();
                  }}
                  loading={loading}
                  textStyle={styles.btnTxt}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeLineContainer: {
    alignSelf: 'center',
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
  },
  transparentSheet: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeImg: {
    height: 40,
    width: 40,
    alignSelf: 'center',
  },
  bottomSheetTransparent: {
    justifyContent: 'flex-end',
    // backgroundColor: 'rgba(106, 21, 21, 0.80)',
    backgroundColor: color.palette.btnColor,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  topContainer: {
    backgroundColor: color.palette.white,
    // height: 280,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  middleContainer: {
    backgroundColor: color.palette.white,
    // height: 120,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  footer: {
    marginTop: 30,
    backgroundColor: color.palette.white,
    // height: 60,
    paddingVertical: 10,
  },
  image: {
    height: Dimensions.get('window').height / 4,
    width: Dimensions.get('window').width - 30,
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 5,
  },
  button: {
    // marginTop: 42,
    height: 35,
    // marginBottom: 10,
    // marginHorizontal: 12,
    borderRadius: 5,
    paddingHorizontal: 0,
    // alignItems: 'center',
    // color: color.palette.black,
  },
  btnTxt: {
    fontSize: FontSize.font_extra_medium_E,
    color: color.palette.white,
  },
  minus: {
    height: 25,
    width: 15,
    alignSelf: 'center',
    tintColor: color.palette.white,
  },
  valueCount: {
    fontFamily: typography.secondary,
    fontSize: FontSize.font_Ex_Large_E,
    color: color.palette.white,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  plus: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    tintColor: color.palette.white,
  },
});
