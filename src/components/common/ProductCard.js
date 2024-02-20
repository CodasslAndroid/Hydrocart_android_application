/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FontSize, color, typography} from '../../theme';
import {Button, Loader} from '../../ui-kit';

export const ProductCard = props => {
  const {
    productImage,
    title,
    uiChange,
    item,
    showDropDown = true,
    index,
    wholeItem,
    w_loading,
    type,
    handleWhilist = () => {},
    handleCart = () => {},
    price,
  } = props;

  const [selectDropDown, setSelectDropDown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(
    item?.item_group ? item?.item_group[0] : item,
  );
  const [selectProduct, setSelectProduct] = useState(null);

  return (
    <>
      {uiChange ? (
        <Pressable
          onPress={() => {
            handleCart(item);
          }}
          style={styles.flatCard}>
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

          <ImageBackground
            source={{uri: productImage}}
            style={styles.flatImg}
            imageStyle={{borderRadius: 6}}>
            <View style={styles.overlay}>
              <Text style={styles.flatTitle}>{title}</Text>
              <Text style={styles.flatPrice}>₹ {price}</Text>
            </View>
          </ImageBackground>
        </Pressable>
      ) : (
        <View style={styles.card}>
          {/* {w_loading && selectProduct?.item_ref_no === item?.item_ref_no ? (
            <Loader style={[styles.w_icon, {top: 0, right: 0}]} />
          ) : (
            <Pressable
              style={[styles.w_icon, {top: 0, right: 0}]}
              onPress={async () => {
                // setLoading(true);
                setSelectProduct(item);
                const data = await handleWhilist(
                  item,
                  index,
                  wholeItem,
                  type,
                  selectedItem,
                );
                setSelectedItem(data);
                // setLoading(false);
              }}>
              {console.log('wishlist', selectedItem?.wishlist_added)}
              <Image
                source={
                  selectedItem?.wishlist_added === true
                    ? //   selectedItem?.wishlist_added === undefined
                      require('../../assets/icon/heartFill.png')
                    : require('../../assets/icon/heart.png')
                }
                style={
                  // selectedItem?.wishlist_added
                  //   ? [styles.w_icon, {tintColor: color.palette.red}]
                  styles.w_icon
                }
              />
            </Pressable>
          )} */}
          <Image source={{uri: productImage}} style={styles.image} />
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View
              style={{
                // borderColor: color.palette.btnColor,
                // borderWidth: 1,
                borderRadius: 6,
                paddingHorizontal: 2,
                paddingVertical: 1,
                alignSelf: 'center',
                marginTop: 5,
                marginBottom: 5,
              }}>
              <Text
                style={{
                  color: color.palette.btnColor,
                  fontFamily: typography.primary,
                  fontSize: FontSize.font_Ex_Medium_O,
                }}>
                {/* {selectedItem?.item_uom_unit} {selectedItem?.item_uom_name}: */}
                <Text style={styles.price}> ₹ {selectedItem?.item_price}</Text>
              </Text>
            </View>

            {/* {showDropDown ? (
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
            ) : null} */}
          </View>

          <Button
            // title={'Add to cart'}
            title={'Add'}
            style={styles.button}
            onPress={() => {
              handleCart(item);
            }}
            // loading={isSubmitting}
            textStyle={styles.btnTxt}
          />
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
                      <Text style={[styles.price, {fontSize: 14}]}>
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
  },
  btnTxt: {
    fontSize: FontSize.font_extra_medium_E,
    color: color.palette.white,
  },
  card: {
    marginRight: 10,
    backgroundColor: color.palette.white,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
    borderRadius: 5,
    width: 135,
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
    height: 100,
    // height: 200,
    width: 129,
    marginHorizontal: 3,
    marginTop: 3,
    borderRadius: 5,
  },
  title: {
    color: color.palette.fadeBlack,
    fontFamily: typography.medium,
    fontSize: FontSize.font_extra_medium_E,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 7,
    height: 37,
  },
  price: {
    color: color.palette.btnColor,
    fontFamily: typography.secondary,
    fontSize: FontSize.font_medium_E,
    textAlign: 'center',
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
    // borderRadius: 7,
    // borderRadius: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    height: 45,
    alignItems: 'center',
    marginTop: 80,
  },
  flatTitle: {
    fontFamily: typography.semiBold,
    color: color.palette.black,
    fontSize: FontSize.font_extra_medium_E,
  },
  flatPrice: {
    color: color.palette.btnColor,
    fontFamily: typography.semiBold,
    fontSize: FontSize.font_extra_medium_E,
    marginBottom: 3,
  },
  arrowIcon: {
    height: 5,
    width: 10,
    alignSelf: 'center',
    marginLeft: 5,
  },
});
