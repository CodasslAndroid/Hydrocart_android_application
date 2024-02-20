import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  BackHandler,
  Modal,
  Pressable,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {
  CommonHeader,
  ProductFlatCard,
  ProductFlatRectLoader,
} from '../components';
import {BottomSheet} from '../components/common/BottomSheet';
import {Routes} from '../navigation';
import {
  bottomSheetControl,
  productSlugDetials,
} from '../redux/slices/dashSlice';
import {clearWislist, delWhislist, getWislist} from '../services/api';
import {FontSize, color, typography} from '../theme';
import {Button, Divider, Vertical} from '../ui-kit';

export const Wishlist = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector(state => state.auth);
  const bottomSheetOpen = useSelector(state => state?.dash);
  const [wishlistLoad, setWishlistLoad] = useState(false);
  const [wishListData, setWishlistData] = useState([]);
  const [flag, setFlag] = useState(Math.random());
  const [selectDropDown, setSelectDropDown] = useState(false);
  const [delSelectedItem, setDelSelectedItem] = useState();
  const [deleteLoad, setDeleteLoad] = useState(false);

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
    setWishlistLoad(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);

    getWislist(payload)
      .then(res => {
        console.log('res', res);
        if (res?.cart === 'Empty Cart') {
          setWishlistData([]);
        } else {
          setWishlistData(res?.cart);
        }
        setWishlistLoad(false);
      })
      .catch(err => {
        setWishlistLoad(false);
        console.log('err', err);
      });
  }, [userData?.userData?.customer_ref_no, flag]);

  const handleCart = item => {
    dispatch(productSlugDetials(item));
    dispatch(bottomSheetControl(true));
  };

  const handleDelFromModal = () => {
    setDeleteLoad(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    payload.append(
      'item_price_ref_no',
      delSelectedItem?.item_group[0]?.item_price_ref_no,
    );
    delWhislist(payload)
      .then(res => {
        console.log('res', res);
        setFlag(Math.random());
        setSelectDropDown(false);
        setDeleteLoad(false);
      })
      .catch(err => {
        setDeleteLoad(false);
        console.log('err', err);
      });
  };

  const handleDelWish = item => {
    setSelectDropDown(true);
    setDelSelectedItem(item);
  };

  const handleWishlist = ({item, index}) => {
    return (
      <ProductFlatCard
        title={item?.product_detail?.item_title}
        productImage={item?.product_detail?.item_img_url}
        price={item?.product_detail?.item_price}
        item={item?.product_detail}
        index={index}
        handleCart={handleCart}
        showDropDown={false}
        sub_title={item?.product_detail?.item_name}
        delWishlist={true}
        handleDelWish={handleDelWish}
        counts={1}
      />
    );
  };

  const handleClearWishlist = () => {
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    clearWislist(payload)
      .then(res => {
        setFlag(Math.random());
        console.log('res', res);
      })
      .catch(err => {});
  };

  return (
    <View style={{flex: 1, backgroundColor: color.palette.white}}>
      <CommonHeader
        handleClear={handleClearWishlist}
        title={'Wishlist'}
        showClear={true}
        screens={'Wishlist'}
      />
      {wishlistLoad ? (
        <ProductFlatRectLoader />
      ) : (
        <>
          {wishListData.length ? (
            <FlatList
              data={wishListData}
              key=">"
              keyExtractor={(item, index) => {
                return '>' + index;
              }}
              renderItem={handleWishlist}
            />
          ) : (
            <View>
              <Text style={styles.noRecord}>No Wishlist Found</Text>
            </View>
          )}
          {bottomSheetOpen.isBottomSheetOpen ? <BottomSheet /> : null}
        </>
      )}
      <Vertical size={10} />
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
  noRecord: {
    fontFamily: typography.secondary,
    fontSize: FontSize.font_medium_E,
    color: color.palette.red,
    textAlign: 'center',
    marginTop: 30,
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
