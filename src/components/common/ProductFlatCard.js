/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {login} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import {Button, Loader, Vertical} from '../../ui-kit';

export const ProductFlatCard = props => {
  const {
    productImage,
    title,
    uiChange,
    item,
    qty,
    index,
    wholeItem,
    w_loading,
    type = null,
    handleWhilist = () => {},
    handleCart = () => {},
    price,
    showDropDown = true,
    sub_title,
    delWishlist = false,
    handleDelWish = () => {},
    showIndicator,
    handleCartCount = () => {},
    cartCountLoad,
    counts,
    screen = null,
    selectProduct,
    setSelectProduct,
    setCartCountLoad,
    calculatedVal,
    showgramsVal = false,
    cancelOrderList,
    handleCancel = () => {},
    handleRemove = () => {},
    canOrder,
    closeOrder,
    cancelOrderBackground = false,
    hideCancelBtn,
  } = props;

  const [selectDropDown, setSelectDropDown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(
    item?.item_group ? item?.item_group[0] : item,
  );

  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const [count, setCount] = useState(parseInt(counts));

  console.log('cancel order List', cancelOrderList);

  return (
    <>
      {uiChange ? (
        <View style={styles.flatCard}>
          {/* {w_loading && selectProduct?.item_ref_no === item?.item_ref_no ? (
            <Loader />
          ) : (
            <Pressable
              onPress={async () => {
                setSelectProduct(item);
                const data = await handleWhilist(
                  item,
                  index,
                  wholeItem,
                  type,
                  selectedItem,
                );
                setSelectedItem(data);
              }}>
              <Image
                source={require('../../assets/icon/heart.png')}
                style={[styles.w_icon, {right: 10, top: 10}]}
              />
            </Pressable>
          )} */}
          <ImageBackground source={{uri: productImage}} style={styles.flatImg}>
            <View style={styles.overlay}>
              <Text style={styles.flatTitle}>{title}</Text>
              <Text style={styles.flatPrice}>₹{price}</Text>
            </View>
          </ImageBackground>
        </View>
      ) : (
        <View
          style={
            cancelOrderBackground
              ? [styles.card, {backgroundColor: color.palette.dimRed}]
              : styles.card
          }>
          <View style={{flexDirection: 'row', flex: 1}}>
            <>
              <ImageBackground
                imageStyle={{borderRadius: 10}}
                source={{uri: productImage}}
                style={styles.image}>
                {parseInt(
                  item?.item_discount_value ??
                    item?.item_group[0]?.item_discount_value,
                ) > 0 ? (
                  <Text
                    style={{
                      backgroundColor: color.palette.green,
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_Ex_Medium_O,
                      color: color.palette.white,
                      paddingVertical: 2,
                      position: 'absolute',
                      // borderRadius: 5,
                      borderBottomLeftRadius: 5,
                      paddingHorizontal: 5,
                      right: 0,
                      //   left: 84.5,
                      //   top: -1,
                      // bottom: 27,
                    }}>
                    {item?.item_discount_value ??
                      item?.item_group[0]?.item_discount_value}{' '}
                    {item?.item_discount_symbol ??
                      item?.item_group[0]?.item_discount_symbol}{' '}
                    off
                  </Text>
                ) : null}
                {type === 'order' && hideCancelBtn ? (
                  <>
                    {canOrder && (
                      <>
                        {cancelOrderBackground ? (
                          <View
                            style={{
                              backgroundColor: color.palette.btnColor,
                              position: 'absolute',
                              left: 0,
                              borderTopLeftRadius: 5,
                              paddingHorizontal: 2,
                              paddingVertical: 2,
                            }}>
                            <Text style={styles.cancelTxt}>Cancelled</Text>
                          </View>
                        ) : (
                          <Button
                            //   title={'Add to cart'}
                            title={'Cancel Order'}
                            style={styles.C_button}
                            onPress={() => {
                              handleCancel(item);
                            }}
                            // loading={isSubmitting}
                            textStyle={styles.C_btnTxt}
                          />
                        )}
                      </>
                    )}
                  </>
                ) : null}
                {type ? null : (
                  <Button
                    //   title={'Add to cart'}
                    title={'Add'}
                    style={styles.button}
                    onPress={() => {
                      handleCart(item);
                    }}
                    // loading={isSubmitting}
                    textStyle={styles.btnTxt}
                  />
                )}
                {showIndicator ? (
                  <>
                    {cartCountLoad &&
                    selectProduct?.item_group[0]?.item_price_ref_no ===
                      item?.item_group[0]?.item_price_ref_no ? (
                      <View
                        style={[
                          styles.loader,
                          {
                            backgroundColor: color.palette.white,
                            paddingHorizontal: 5,
                            paddingVertical: 2.5,
                            width: 80,
                            borderWidth: 1,
                            borderColor: color.palette.btnColor,
                            borderRadius: 3,
                          },
                        ]}>
                        <Loader />
                      </View>
                    ) : (
                      <View style={styles.countView}>
                        <Pressable
                          style={{alignSelf: 'center'}}
                          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                          onPress={() => {
                            if (parseInt(counts) > 1) {
                              setCartCountLoad(true);
                              // setCount(count - 1);
                              let _count = parseInt(counts) - 1;

                              handleCartCount(-1, item);
                              setSelectProduct(item);
                              //   setPrice(selectedItem?.item_price * _count);
                            }
                          }}>
                          <Image
                            source={require('../../assets/icon/minus.png')}
                            style={styles.minus}
                          />
                        </Pressable>
                        <Text style={styles.valueCount}>
                          {parseInt(counts)}
                        </Text>
                        <Pressable
                          style={{alignSelf: 'center'}}
                          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                          onPress={() => {
                            //   setCount(count + 1);
                            setCartCountLoad(true);
                            let _count = parseInt(counts) + 1;
                            handleCartCount(+1, item);
                            setSelectProduct(item);
                            // setPrice(selectedItem?.item_price * _count);
                          }}>
                          <Image
                            source={require('../../assets/icon/plus.png')}
                            style={styles.plus}
                          />
                        </Pressable>
                      </View>
                    )}
                  </>
                ) : null}
              </ImageBackground>
            </>
            <View style={{paddingTop: 10, flex: 1}}>
              <Text numberOfLines={2} style={styles.title}>
                {title}
              </Text>
              <Text numberOfLines={2} style={styles.subTitle}>
                {sub_title}{' '}
                <Text
                  style={{
                    fontSize: FontSize.font_extra_small_E,
                    color: color.palette.btnColor,
                    fontFamily: typography.medium,
                  }}>
                  {`(${selectedItem?.item_uom_unit} ${selectedItem?.item_uom_name})`}
                </Text>
              </Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                {star.map((item, index) => {
                  return (
                    <Image
                      key={'(' + index}
                      source={
                        index + 1 <= parseInt(item?.average_rating)
                          ? require('../../assets/icon/star.png')
                          : require('../../assets/icon/star1.png')
                      }
                      style={{height: 10, width: 10, marginRight: 3}}
                    />
                  );
                })}
                <Text
                  style={{
                    fontFamily: typography.primary,
                    fontSize: FontSize.font_extra_small_O,
                  }}>
                  {`(${item?.count_rating})`}
                </Text>
                {type === 'order' && hideCancelBtn ? (
                  <>
                    {closeOrder && (
                      <Pressable
                        style={{position: 'absolute', right: 10, bottom: 1}}
                        onPress={() => {
                          handleRemove(item);
                        }}>
                        <Image
                          source={require('../../assets/icon/b_close.png')}
                          style={{height: 30, width: 30}}
                        />
                      </Pressable>
                    )}
                  </>
                ) : null}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                <View
                  style={
                    showgramsVal
                      ? {
                          borderRadius: 6,
                          paddingHorizontal: 2,
                          paddingVertical: 1,
                          alignSelf: 'center',
                          marginTop: 10,
                          marginBottom: 10,
                        }
                      : {
                          paddingHorizontal: 2,
                          paddingVertical: 1,
                          alignSelf: 'center',
                          marginTop: 10,
                          marginBottom: 10,
                        }
                  }>
                  <Text
                    style={{
                      color: color.palette.btnColor,
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_Ex_Medium_O,
                    }}>
                    {!screen ? (
                      <>
                        <Text
                          style={
                            showgramsVal
                              ? styles.price
                              : [
                                  styles.price,
                                  {fontSize: FontSize.font_extra_medium_O},
                                ]
                          }>
                          {' '}
                          ₹ {selectedItem?.item_price * parseInt(counts)}
                        </Text>{' '}
                        {parseInt(item?.item_group[0]?.item_discount_value) >
                        0 ? (
                          <Text style={styles.mrpPrice}>
                            {' '}
                            ₹{selectedItem?.item_mrp_price * parseInt(counts)}
                          </Text>
                        ) : null}
                      </>
                    ) : null}
                  </Text>
                </View>
                {screen ? (
                  <>
                    <View
                      style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                      <Text
                        style={[
                          styles.price,
                          {textAlign: 'left', marginRight: 10},
                        ]}>
                        ₹ {calculatedVal}
                      </Text>
                      <Text
                        style={[
                          styles.price,
                          {
                            textAlign: 'right',
                            marginRight: 10,
                            fontFamily: typography.primary,
                            fontSize: FontSize.font_small_E,
                          },
                        ]}>
                        ( ₹ {price} x {qty} qty )
                      </Text>
                    </View>
                  </>
                ) : null}
                {/* {showDropDown ? (
                  <Pressable
                    style={styles.arrowIcon}
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    onPress={() => {
                      setSelectDropDown(!selectDropDown);
                    }}>
                    <Image
                      source={require('../../assets/icon/arrow.png')}
                      style={[
                        styles.arrowIcon,
                        {transform: [{rotate: '180deg'}]},
                      ]}
                      tintColor={color.palette.btnColor}
                    />
                  </Pressable>
                ) : null} */}
              </View>
              {/* 
              {showIndicator ? (
                <>
                  {cartCountLoad &&
                  selectProduct?.item_group[0]?.item_price_ref_no ===
                    item?.item_group[0]?.item_price_ref_no ? (
                    <Loader style={styles.loader} />
                  ) : (
                    <View style={styles.countView}>
                      <Pressable
                        style={{alignSelf: 'center'}}
                        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                        onPress={() => {
                          if (parseInt(counts) > 1) {
                            setCartCountLoad(true);
                            // setCount(count - 1);
                            let _count = parseInt(counts) - 1;

                            handleCartCount(_count, item);
                            setSelectProduct(item);
                            //   setPrice(selectedItem?.item_price * _count);
                          }
                        }}>
                        <Image
                          source={require('../../assets/icon/minus.png')}
                          style={styles.minus}
                        />
                      </Pressable>
                      <Text style={styles.valueCount}>{parseInt(counts)}</Text>
                      <Pressable
                        style={{alignSelf: 'center'}}
                        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                        onPress={() => {
                          //   setCount(count + 1);
                          setCartCountLoad(true);
                          let _count = parseInt(counts) + 1;
                          handleCartCount(_count, item);
                          setSelectProduct(item);
                          // setPrice(selectedItem?.item_price * _count);
                        }}>
                        <Image
                          source={require('../../assets/icon/plus.png')}
                          style={styles.plus}
                        />
                      </Pressable>
                    </View>
                  )}
                </>
              ) : null} */}
              {/* <View style={{backgroundColor: color.palette.green}}> */}

              {/* {type ? null : ( */}
              <>
                {delWishlist ? (
                  <Pressable
                    onPress={() => {
                      handleDelWish(item);
                    }}
                    style={{right: 10, position: 'absolute', bottom: 10}}>
                    <Image
                      source={require('../../assets/icon/deleteIcon.png')}
                      style={{
                        height: 20,
                        width: 20,

                        tintColor: color.palette.btnColor,
                      }}
                    />
                  </Pressable>
                ) : null}
              </>
              {/* )} */}
              {/* </View> */}
            </View>
          </View>
          {/* <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View
              style={{
                borderColor: color.palette.btnColor,
                borderWidth: 1,
                borderRadius: 6,
                paddingHorizontal: 2,
                paddingVertical: 1,
                alignSelf: 'center',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  color: color.palette.btnColor,
                  fontFamily: typography.primary,
                  fontSize: 9,
                }}>
                {selectedItem?.item_uom_unit} {selectedItem?.item_uom_name}:
                <Text style={styles.price}> ₹{selectedItem?.item_price}</Text>
              </Text>
            </View>
            <Pressable
              style={styles.arrowIcon}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              onPress={() => {
                setSelectDropDown(!selectDropDown);
              }}>
              <Image
                source={require('../../assets/icon/arrow.png')}
                style={[styles.arrowIcon, {transform: [{rotate: '180deg'}]}]}
                tintColor={color.palette.btnColor}
              />
            </Pressable>
          </View>

          <Button
            title={'Add to cart'}
            style={styles.button}
            onPress={() => {
              handleCart(item);
            }}
            // loading={isSubmitting}
            textStyle={styles.btnTxt}
          /> */}
        </View>
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
              {item?.item_group.map((item, index) => {
                return (
                  <View
                    key={'+' + index}
                    style={{
                      borderRadius: 6,
                      //   paddingVertical: 5,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                    }}>
                    <Text
                      onPress={() => {
                        setSelectedItem(item);
                        setSelectDropDown(!selectDropDown);
                      }}
                      style={{
                        color: color.palette.btnColor,
                        fontFamily: typography.primary,
                        fontSize: FontSize.font_medium_E,
                      }}>
                      {item?.item_uom_unit} {item?.item_uom_name}:
                      <Text
                        style={[
                          styles.price,
                          {fontSize: FontSize.font_medium_E},
                        ]}>
                        {' '}
                        ₹{item?.item_price}
                      </Text>
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 26,
    marginBottom: 10,
    marginHorizontal: 12,
    borderRadius: 5,
    paddingHorizontal: 0,
    position: 'absolute',
    bottom: 2,
    // right: ,
    alignSelf: 'center',
    width: '50%',
    // width: Dimensions.get('screen').width - 310,
  },
  btnTxt: {
    fontSize: FontSize.font_extra_medium_E,
    color: color.palette.white,
  },
  C_button: {
    height: 20,
    marginBottom: 10,
    marginHorizontal: 12,
    borderRadius: 5,
    paddingHorizontal: 0,
    position: 'absolute',
    bottom: 0.1,
    // right: 0,
    // width: '30%',
    // width: Dimensions.get('screen').width - 310,
  },
  C_btnTxt: {
    fontSize: FontSize.font_extra_small_E,
    color: color.palette.white,
  },
  cancelTxt: {
    fontSize: FontSize.font_Ex_Medium_O,
    color: color.palette.white,
    fontFamily: typography.medium,
    // position: 'absolute',
    // bottom: 0.1,
    // right: 10,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 10,
    // backgroundColor: 'blue',
    backgroundColor: color.palette.white,
    // backgroundColor: '#0000',
    shadowColor: '#000',
    // shadowColor: color.palette.red,
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 5,
    marginBottom: 5,
    // width: 135,
  },
  w_icon: {
    position: 'absolute',
    zIndex: 3,
    height: 15,
    width: 15,
    right: 5,
    top: 5,
  },
  image: {
    // height: 84,
    width: 129,
    // marginHorizontal: 3,
    marginRight: 20,
    // marginTop: 3,
    borderRadius: 10,
    // backgroundColor: 'red',
  },
  title: {
    color: color.palette.black,
    fontFamily: typography.medium,
    fontSize: FontSize.font_medium_E,
    // textAlign: 'center',
    // paddingHorizontal: 30,
    // marginTop: 7,
    // height: 30,
  },
  subTitle: {
    color: color.palette.black,
    fontFamily: typography.primary,
    fontSize: FontSize.font_small_E,
    // textAlign: 'center',
    // paddingHorizontal: 30,
    marginBottom: 7,
    // height: 30,
  },
  price: {
    color: color.palette.btnColor,
    fontFamily: typography.secondary,
    fontSize: FontSize.font_extra_medium_E,
    textAlign: 'center',
  },
  mrpPrice: {
    color: color.palette.grey,
    fontFamily: typography.secondary,
    fontSize: FontSize.font_Ex_Medium_O,
    textAlign: 'center',
    textDecorationLine: 'line-through',
  },
  flatCard: {
    width: 200,
    height: 150,
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 10,
    marginRight: 10,
    backgroundColor: color.palette.white,
  },
  flatImg: {
    width: 190,
    height: 140,
    alignSelf: 'center',
    borderRadius: 7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 35,
    alignItems: 'center',
    marginTop: 80,
  },
  flatTitle: {
    fontFamily: typography.semiBold,
    color: color.palette.black,
    fontSize: FontSize.font_small_O,
  },
  flatPrice: {
    color: color.palette.btnColor,
    fontFamily: typography.semiBold,
    fontSize: FontSize.font_extra_small_E,
    marginBottom: 3,
  },
  arrowIcon: {
    height: 5,
    width: 10,
    alignSelf: 'center',
    marginLeft: 5,
  },
  minus: {
    height: 15,
    width: 7,
    alignSelf: 'center',
    tintColor: color.palette.btnColor,
  },
  valueCount: {
    fontFamily: typography.secondary,
    fontSize: FontSize.font_medium_E,
    color: color.palette.btnColor,
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  plus: {
    height: 10,
    width: 10,
    alignSelf: 'center',
    tintColor: color.palette.btnColor,
  },
  countView: {
    flexDirection: 'row',
    backgroundColor: color.palette.white,
    borderWidth: 1,
    borderColor: color.palette.btnColor,
    borderRadius: 5,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 5,
    paddingHorizontal: 5,
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 5,
  },
});
