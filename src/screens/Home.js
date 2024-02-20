import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  BackHandler,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {BannerLoader, ProductRectLoader, RowLoader} from '../components';
import {BottomSheet} from '../components/common/BottomSheet';
import {ProductCard} from '../components/common/ProductCard';
import {Routes} from '../navigation';
import {
  bottomSheetControl,
  categoryListed,
  productSlugDetials,
  selectedCategory,
  selectScreenType,
} from '../redux/slices/dashSlice';
import {
  addWhislist,
  BannerImage,
  getProducts,
  getWislist,
  productMenu,
} from '../services/api';
import {FontSize, color, typography} from '../theme';
import {Divider, Vertical} from '../ui-kit';

export const Home = () => {
  const userData = useSelector(state => state.auth);
  const bottomSheetOpen = useSelector(state => state?.dash);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [categoryList, setCategoryList] = useState([]);
  const [categoryLoad, setCategoryLoad] = useState(false);
  const [popular, setPopular] = useState([]);
  const [splitArr, setSplitArr] = useState([]);
  const [loader, setLoader] = useState(false);
  const [popularLoader, setPopularLoader] = useState(false);
  const [w_loading, setW_Loading] = useState(false);
  const [bannerLoad, setBannerLoad] = useState(false);
  const [bannerData, setBannerData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit',
          'Hold on Are you sure you want to exit an app',

          [
            {
              text: 'cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'yes',
              onPress: () => BackHandler.exitApp(),
            },
          ],
        );

        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    setCategoryLoad(true);
    setLoader(true);
    setPopularLoader(true);
    setBannerLoad(true);

    BannerImage()
      .then(res => {
        setBannerData(res?.banner);
        setBannerLoad(false);
      })
      .catch(err => {
        setBannerLoad(false);
        console.log('err', err);
      });

    productMenu()
      .then(res => {
        setCategoryLoad(false);
        setCategoryList(res);
        setSplitArr([]);
        productApi(res);
        console.log('res?.menu', res?.menu);
        dispatch(categoryListed(res?.menu));
      })
      .catch(err => {
        setCategoryLoad(false);
        console.log('err', err);
      });

    const _payload = new FormData();
    _payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    const payload = new FormData();
    payload.append('order', 'popular');
    payload.append('limitfrom', 1);
    payload.append('limittotal', 10);
    getProducts(payload)
      .then(res => {
        setPopular(res?.product);
        // let data = res?.product;
        // data.map((item, index) => {
        //   item?.item_group?.map((items, _index) => {
        //     _res.cart.map((item, index) => {
        //       if (item?.item_price_ref_no === items?.item_price_ref_no) {
        //         items['wishlist_added'] = true;
        //       } else {
        //         items['wishlist_added'] = false;
        //       }
        //     });
        //   });
        // });
        // setPopular(data);
        setPopularLoader(false);
      })
      .catch(err => {
        setPopularLoader(false);
        console.log('err', err);
      });
  }, []);

  const handleWhilist = (item, index, wholeItem, type, selectedItem) => {
    setW_Loading(true);
    let product_detail = wholeItem[index];
    let product_group = wholeItem[index]?.item_group;
    product_detail?.item_group?.map((item, indexes) => {
      if (item?.item_price_ref_no === selectedItem?.item_price_ref_no) {
        item['wishlist_added'] = true;
        product_group[indexes] = item;
        const data = {...product_detail, item_group: product_group};
        wholeItem[index] = data;
        // wholeItem[index] = product_group;
        if (type === 'popular') {
          setPopular(wholeItem);
        } else {
          setSplitArr(wholeItem);
        }

        // product_group[index]?.item_group[indexes]?.wishlist_added=true
      }
    });
    // product_detail?.item_group[indexes]=item

    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    payload.append('item_price_ref_no', selectedItem?.item_price_ref_no);
    payload.append('item_ref_no', item?.item_ref_no);
    payload.append('basket_qty', 1);
    addWhislist(payload)
      .then(res => {
        setW_Loading(false);
      })
      .catch(err => {
        console.log('err', err);
      });
    return item;
  };

  const productApi = useCallback(data => {
    let arr_data = data.menu;
    data.menu.map((item, index) => {
      console.log('item', item);
      const payload = new FormData();
      payload.append('pmenu', item?.menu_slug);
      payload.append('limitfrom', 1);
      payload.append('limittotal', 10);

      getProducts(payload)
        .then(res => {
          if (item?.menu_id === '32') {
            let arrSplit = [];
            let nestedArr = [];
            for (var i = 0; i < res.product.length; i++) {
              let splitedArrData = res?.product[i];
              arrSplit.push(splitedArrData);
              if (i + 1) {
                let _splitedArrData = res?.product[i + 1];
                arrSplit.push(_splitedArrData);
                nestedArr.push(arrSplit);
                i = i + 1;
                arrSplit = [];
              }
            }
            var key = arr_data[index];
            key = {...key, products: nestedArr};

            setSplitArr(splitArr => [...splitArr, key]);
          } else {
            if (res?.product !== 'No Record Found') {
              let _data = res?.product;
              _data?.map((_item, __index) => {});
              var key = arr_data[index];
              key = {...key, products: res?.product};
              setSplitArr(splitArr => [...splitArr, key]);
            }
          }
        })
        .catch(err => {
          console.log('err sasads', err);
        });
      if (index + 1 === data.menu.length) {
        setLoader(false);
      }
    });
  }, []);
  const handleCart = item => {
    dispatch(productSlugDetials(item));
    dispatch(bottomSheetControl(true));
  };

  const hanldeCategory = ({item, index}) => {
    return (
      <Pressable
        style={{marginRight: 20}}
        onPress={() => {
          dispatch(selectedCategory(item));
          dispatch(selectScreenType('category'));
          navigation.navigate(Routes.SEARCH);
        }}>
        <Image
          source={{uri: item?.menu_cat[0]?.cat_img_path_url}}
          style={styles.headerData}
        />
        <Text style={styles.headerDataText}>{item?.menu_name}</Text>
      </Pressable>
    );
  };
  const handlePopular = ({item, index}) => {
    return (
      <>
        <ProductCard
          title={item?.item_name}
          productImage={item?.item_img_url}
          price={item?.item_price}
          item={item}
          index={index}
          wholeItem={popular}
          setPopular={setPopular}
          type="popular"
          //   setSelectedItem={setSelectedItem}
          //   handleWhilist={handleWhilist}
          w_loading={w_loading}
          handleCart={handleCart}
        />
      </>
    );
  };

  const handleDoubleList = ({item, index}) => {
    return (
      <>
        {item?.length === 2 ? (
          <View>
            <FlatList
              data={item}
              key={'&'}
              keyExtractor={(item, index) => {
                return '&' + item?.item_ref_no;
              }}
              renderItem={({item, index}) => {
                return (
                  <View style={{marginBottom: 18}}>
                    <ProductCard
                      item={item}
                      title={item?.item_name}
                      productImage={item?.item_img_url}
                      price={item?.item_price}
                      index={index}
                      wholeItem={splitArr}
                      setSplitArr={setSplitArr}
                      //   setSelectedItem={setSelectedItem}
                      //   handleWhilist={handleWhilist}
                      w_loading={w_loading}
                      handleCart={handleCart}
                      //   selectedItem={selectedItem}
                      //   selectedItem={selectedItem ?? item?.item_group}
                    />
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <ProductCard
            item={item}
            title={item?.item_name}
            productImage={item?.item_img_url}
            price={item?.item_group[0]?.item_price}
            index={index}
            wholeItem={splitArr}
            setSplitArr={setSplitArr}
            // setSelectedItem={setSelectedItem}
            uiChange={item?.product_menu_id === '33' ? true : false}
            // handleWhilist={handleWhilist}
            w_loading={w_loading}
            handleCart={handleCart}
            // selectedItem={selectedItem}
            // selectedItem={selectedItem ?? item?.item_group}
          />
        )}
      </>
    );
  };

  const handeCat = ({item, index}) => {
    return (
      <>
        {item?.products !== 'No Record Found' ? (
          <>
            <View style={styles.categoryTitleView}>
              <Text style={styles.categoryTitlelftTxt}>{item?.menu_name}</Text>
              <Pressable
                onPress={() => {
                  dispatch(selectedCategory(item));
                  dispatch(selectScreenType('category'));
                  navigation.navigate(Routes.SEARCH);
                }}>
                <Text style={styles.categoryTitlerhtTxt}>See all ></Text>
              </Pressable>
            </View>

            <FlatList
              data={item?.products}
              key="@"
              style={{paddingLeft: 14}}
              keyExtractor={(item, index) => {
                return '@' + index;
              }}
              contentContainerStyle={styles.bottomSpace}
              renderItem={handleDoubleList}
              horizontal
            />
            <Divider />
          </>
        ) : null}
      </>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={{height: 55}}>
        <View style={styles.headerView}>
          <Image
            source={{uri: userData?.companyDetail?.company_logo}}
            style={{
              height: 35,
              width: 150,
              //   backgroundColor: color.palette.backgroundGrey,
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <Pressable
              onPress={() => {
                dispatch(selectScreenType(null));
                dispatch(selectedCategory(null));
                navigation.navigate(Routes.SEARCH);
              }}>
              <Image
                source={require('../assets/icon/Search_alt.png')}
                style={{height: 30, width: 30, marginRight: 15}}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate(Routes.MANAGE_ACCOUNT);
              }}>
              <Image
                source={
                  userData?.profileData?.customer_profile_image
                    ? {
                        uri: `${
                          userData?.profileData?.customer_profile_image
                        }?${new Date()}`,
                      }
                    : require('../assets/icon/profileIcon.png')
                }
                style={styles.profile}
              />
            </Pressable>
            <Image />
          </View>
        </View>
      </View>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.headerList}>
              {!categoryLoad ? (
                <FlatList
                  data={categoryList?.menu}
                  key="@"
                  keyExtractor={(item, index) => {
                    return '@' + index;
                  }}
                  horizontal
                  renderItem={hanldeCategory}
                  showsHorizontalScrollIndicator={false}
                />
              ) : (
                <RowLoader />
              )}
            </View>
            {bannerLoad ? (
              <BannerLoader />
            ) : (
              <FlatList
                data={bannerData}
                key="="
                keyExtractor={(item, index) => {
                  return '=' + index;
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{backgroundColor: color.palette.white}}
                renderItem={({item, index}) => {
                  return (
                    <Image
                      source={{uri: item?.banner_img}}
                      style={{
                        height: 140,
                        width: Dimensions.get('screen').width - 40,
                        marginLeft: 20,
                        marginVertical: 12,
                        borderRadius: 5,
                        marginRight: 20,
                      }}
                    />
                  );
                }}
              />
            )}

            <View style={styles.listView}>
              <View style={styles.categoryTitleView}>
                <Text style={styles.categoryTitlelftTxt}>Popular item</Text>
                <Pressable
                  onPress={() => {
                    dispatch(selectedCategory(popular));
                    dispatch(selectScreenType('popular'));
                    navigation.navigate(Routes.SEARCH);
                  }}>
                  <Text style={styles.categoryTitlerhtTxt}>See all ></Text>
                </Pressable>
              </View>
              {!popularLoader ? (
                <FlatList
                  data={popular}
                  key="!"
                  keyExtractor={(item, index) => {
                    return '!' + index;
                  }}
                  renderItem={handlePopular}
                  horizontal
                  style={{paddingLeft: 14}}
                  //   contentContainerStyle={{marginBottom: 5}}
                  contentContainerStyle={styles.bottomSpace}
                />
              ) : (
                <ProductRectLoader />
              )}
              <Vertical size={10} />
              <Divider />

              {/* <View style={styles.categoryTitleView}>
                <Text style={styles.categoryTitlelftTxt}>
                  Sweets you may like
                </Text>

                <Text style={styles.categoryTitlerhtTxt}>See all ></Text>
              </View>

              <Divider /> */}
              {!loader ? (
                <FlatList
                  data={splitArr}
                  key="%"
                  keyExtractor={(item, index) => {
                    return '%' + index;
                  }}
                  renderItem={handeCat}
                />
              ) : null}
              {bottomSheetOpen.isBottomSheetOpen ? <BottomSheet /> : null}
            </View>
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerList: {
    backgroundColor: color.palette.fadeBg,
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 3,
  },
  headerData: {
    backgroundColor: color.palette.borderGrey,
    height: 60,
    width: 60,
    borderRadius: 60,
    alignSelf: 'center',
  },
  headerDataText: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_small_E,
    color: color.palette.white,
    letterSpacing: 0.4,
    textAlign: 'center',
    // width: 80,
    // marginRight: 20,
  },
  categoryTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 6,
    paddingTop: 13,
    paddingBottom: 10,
    paddingLeft: 14,
  },
  categoryTitlelftTxt: {
    fontFamily: typography.semiBold,
    color: color.palette.fadeBlack,
    fontSize: FontSize.font_Ex_Large_E,
  },
  categoryTitlerhtTxt: {
    color: color.palette.fadegreen,
    fontFamily: typography.primary,
    fontSize: FontSize.font_extra_medium_E,
    alignSelf: 'center',
  },
  bottomSpace: {paddingBottom: 10},
  listView: {
    backgroundColor: color.palette.fadeWhite,
  },
  headerView: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 13,
  },
  profile: {
    height: 30,
    width: 30,
    borderRadius: 30,
    backgroundColor: color.palette.backgroundGrey,
  },
});

// _item?.item_group?.map((__item, ___index) => {
//   __item['wishlist_added'] = false;
//   //   _res.cart.map((item, index) => {
//   //     if (item?.item_price_ref_no === __item?.item_price_ref_no) {
//   //       __item['wishlist_added'] = true;
//   //     } else {
//   //       __item['wishlist_added'] = false;
//   //     }
//   //   });
// });
