import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Modal,
} from 'react-native';
import {ProductFlatCard} from '../components';
import {SearchComponent} from '../components/common/SearchComponent';
import {getProducts} from '../services/api';
import {Divider, Loader} from '../ui-kit';
import {debounce} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {
  bottomSheetControl,
  productSlugDetials,
  selectScreenType,
} from '../redux/slices/dashSlice';
import {FontSize, color, typography} from '../theme';
import {useNavigation} from '@react-navigation/native';
import {BottomTabStack} from '../navigation/components/BottomTabStack';
import {Routes} from '../navigation';

const sortOption = [
  {name: 'Popular'},
  {name: 'price low - high'},
  {name: 'price high - low'},
];
export const Search = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const searchData = useSelector(state => state?.dash);
  const [s_text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [subCat, setSubCat] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTab, setSelectedTabs] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState();
  const [categorySlug, setCategorySlug] = useState();
  const [openSortmodal, setSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);
  const [paginationEnd, setPaginationEnd] = useState(false);
  const [searchLoad, setSearchLoad] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [flatListRef, setFlatListRef] = useState(null);

  //   console.log(productList?.length);

  //   useFocusEffect(
  //     useCallback(() => {
  //       const onBackPress = () => {
  //         dispatch(selectScreenType(null));
  //         navigation.navigate(Routes.DASHBOARD);
  //         return true;
  //       };
  //       BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //       return () =>
  //         BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //     }, [dispatch, navigation]),
  //   );
  //   console.log('searchData?.screenType', searchData?.screenType);
  useEffect(() => {
    if (searchData?.screenType === 'category') {
      searchData?.menuCateogryList?.map((item, index) => {
        if (item?.menu_name === searchData?.categorySelect?.menu_name) {
          let payload = {};
          Object.entries(item?.menu_cat[0]).map((item, index) => {
            if (item[0] === 'menu_cat_sub') {
              const innrData = item[1];
              const arrData = [{subcat_name: 'All'}];
              innrData.map((item, index) => {
                arrData.push(item);
              });
              payload = {...payload, [item[0]]: arrData};
            } else {
              payload = {...payload, [item[0]]: item[1]};
            }
          });
          setSubCat(payload);
          setSelectedTabs('All');
          setSelectedSlug(null);
          setCategorySlug(item?.menu_cat[0]?.cat_slug);
          setLoading(true);
          setProductList([]);
          //   callCategoryApi(item?.menu_cat[0]?.cat_slug, null);
          callCategoryApi(item?.menu_cat[0]?.cat_slug, null, null, null, []);
        }
      });
    } else if (searchData?.screenType === 'popular') {
      var payload = {
        order: 'popular',
      };

      callCategoryApi('', '', payload);
    }
  }, [
    callCategoryApi,
    searchData?.categorySelect?.menu_name,
    searchData?.menuCateogryList,
    searchData?.screenType,
  ]);

  const callCategoryApi = useCallback(
    (cat, subCat, sortOption, pagingEnabled, productList) => {
      console.log('adasd', cat, subCat, sortOption, pagingEnabled);
      if (pagingEnabled) {
        setPaginationEnd(true);
      }
      const payload = new FormData();
      payload.append('pcat', cat);
      if (subCat) {
        payload.append('pscat', subCat);
      }
      if (sortOption) {
        payload.append('order', sortOption?.order);
        if (sortOption?.sort) {
          payload.append('sort', sortOption?.sort);
        }
      }
      payload.append('limitfrom', productList?.length ?? 1);
      payload.append('limittotal', productList?.length + 10);

      //   if (s_text === '' && searchData?.screenType === 'category') {

      getProducts(payload)
        .then(res => {
          console.log('tres', res);
          if (pagingEnabled) {
            setPaginationEnd(res?.product !== 'No Record Found' ? true : false);
          }
          if (res?.product !== 'No Record Found') {
            setProductList(
              productList?.length
                ? res?.product !== 'No Record Found'
                  ? productList.concat(res?.product)
                  : productList
                : res?.product !== 'No Record Found'
                ? res?.product
                : [],
            );
          }
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          console.log('err', err);
        });
      //   }
    },
    [productList],
  );

  const handleSearch = debounce(val => {
    dispatch(selectScreenType(null));
    setSearchLoad(true);
    if (val === '') {
      // console.log('enttry');
      //   setProductList([]);
      setSearchList([]);
    } else {
      console.log('entry searxch', val);
      //   setProductList([]);
      setSearchList([]);
      setLoading(true);
      //   if (val?.length > 2) {
      const payload = new FormData();
      payload.append('psearch', val);
      //   payload.append('limitfrom', 1);
      //   payload.append('limittotal', 10);
      getProducts(payload)
        .then(res => {
          setSearchLoad(false);
          // console.log('res', res);
          if (res?.product !== 'No Record Found') {
            // setProductList(res?.product);
            setSearchList(res?.product);
          }
          setLoading(false);
        })
        .catch(err => {
          setSearchLoad(false);
          setLoading(false);
          console.log('err', err);
        });
      //   }
    }
  }, 400);

  const handleCart = item => {
    dispatch(productSlugDetials(item));
    dispatch(bottomSheetControl(true));
  };
  let count = 0;
  const endReached = () => {
    console.log('ntry pagination');
    setLoading(false);
    // if (productList.length) {
    callCategoryApi(
      categorySlug,
      selectedSlug,
      selectedSort,
      true,
      productList,
    );
    // }
  };

  const handleClose = () => {
    setLoading(true);
    // console.log(
    //   'categorySlug, selectedSlug, selectedSort',
    //   categorySlug,
    //   selectedSlug,
    //   selectedSort,
    // );
    setProductList([]);
    setSearchList([]);
    if (searchData?.categorySelect) {
      dispatch(selectScreenType('category'));
    } else {
      dispatch(selectScreenType(null));
    }
    callCategoryApi(
      categorySlug,
      selectedSlug,
      selectedSort,
      null,
      productList,
    );
  };

  //   console.log('productList?.length', productList);
  const renderFooter = () => {
    return (
      <>
        {paginationEnd ? (
          <View>
            {productList?.length ? (
              <Text
                style={{
                  fontFamily: typography.medium,
                  fontSize: FontSize.font_medium_E,
                  textAlign: 'center',
                  marginTop: 10,
                  color: color.palette.grey,
                }}>
                Loading More...
              </Text>
            ) : null}
          </View>
        ) : (
          <View>
            {productList !== 'No Record Found' ? (
              <Text
                style={{
                  fontFamily: typography.medium,
                  fontSize: FontSize.font_medium_E,
                  textAlign: 'center',
                  marginTop: 10,
                  color: color.palette.grey,
                }}>
                No Record Found
              </Text>
            ) : null}
          </View>
        )}
      </>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={{height: 55}}>
        <View style={styles.headerView}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={require('../assets/icon/left.png')}
              style={styles.backArrow}
            />
          </Pressable>
          <SearchComponent
            text={s_text}
            setText={setText}
            placeholder={'Search For Sweets'}
            borderStyle={{borderRadius: 10}}
            handleSearch={handleSearch}
            handleClose={handleClose}
          />
          <Pressable
            style={styles.tabView}
            onPress={() => {
              navigation.navigate(Routes.CART);
            }}>
            <View
              style={{
                backgroundColor: color.palette.red,
                paddingHorizontal: 3,
                paddingVertical: 3,
                borderRadius: 20,
                position: 'absolute',
                left: 30,
                top: -10,
                height: 20,
                width: 20,
                zIndex: 3,
              }}>
              <Text
                style={{
                  color: color.palette.white,
                  fontFamily: typography.primary,
                  fontSize: FontSize.font_extra_small_E,
                  textAlign: 'center',
                }}>
                {searchData?.cartNumber}
              </Text>
            </View>
            <Image
              source={require('../assets/icon/cart.png')}
              style={{
                tintColor: color.palette.btnColor,
                height: 20,
                width: 20,
                marginLeft: 20,
              }}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate(Routes.WISHLIST);
            }}>
            <Image
              source={require('../assets/icon/whislist.png')}
              style={{
                tintColor: color.palette.btnColor,
                height: 20,
                width: 20,
                marginLeft: 20,
              }}
            />
          </Pressable>
        </View>

        <Divider />
      </View>
      {/* {productList.length ?  */}
      <View style={{flex: 1}}>
        {searchData?.screenType !== 'category' ? (
          <>
            {s_text?.length ? (
              <>
                {searchLoad ? (
                  <Loader />
                ) : (
                  <>
                    {searchList?.length ? (
                      <FlatList
                        data={searchList}
                        key="{"
                        keyExtractor={(item, index) => {
                          return '{' + index;
                        }}
                        renderItem={({item, index}) => {
                          return (
                            <ProductFlatCard
                              title={item?.item_title}
                              productImage={item?.item_img_url}
                              price={item?.item_price}
                              item={item}
                              index={index}
                              handleCart={handleCart}
                              sub_title={item?.item_name}
                              counts={1}
                            />
                          );
                        }}
                      />
                    ) : (
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontFamily: typography.secondary,
                            fontSize: FontSize.font_large_E,
                            textAlign: 'center',
                            color: color.palette.red,
                            marginTop: 30,
                          }}>
                          No Record Found
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </>
            ) : (
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontFamily: typography.secondary,
                    fontSize: FontSize.font_large_E,
                    textAlign: 'center',
                    color: color.palette.red,
                    marginTop: 30,
                  }}>
                  No Record Found
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={{flex: 1}}>
            <View>
              {s_text ? null : (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        color: color.palette.black,
                        fontSize: FontSize.font_large_E,
                        fontFamily: typography.medium,
                        marginRight: 1,
                      }}>
                      {subCat?.cat_name}
                    </Text>
                    {searchData?.screenType === 'category' ? (
                      <Pressable
                        style={{alignSelf: 'center'}}
                        onPress={() => {
                          setModalOpen(true);
                        }}>
                        <Image
                          source={require('../assets/icon/arrow.png')}
                          style={{
                            height: 5,
                            width: 10,
                            transform: [{rotate: '180deg'}],
                            tintColor: color.palette.black,
                            alignSelf: 'center',
                            marginLeft: 5,
                          }}
                        />
                      </Pressable>
                    ) : null}
                  </View>
                  <View style={{backgroundColor: color.palette.white}}>
                    {searchData?.screenType === 'category' ? (
                      <>
                        <Pressable
                          style={{
                            position: 'absolute',
                            right: 0,
                            zIndex: 4,
                            top: 5,
                            backgroundColor: color.palette.white,
                          }}
                          onPress={() => {
                            setSortModal(true);
                          }}>
                          <Image
                            source={require('../assets/icon/Sort.png')}
                            style={{
                              height: 40,
                              width: 40,
                            }}
                          />
                        </Pressable>

                        <FlatList
                          ref={ref => setFlatListRef(ref)}
                          data={subCat?.menu_cat_sub}
                          key={'|'}
                          keyExtractor={(item, index) => {
                            return '|' + index;
                          }}
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          contentContainerStyle={{
                            justifyContent: 'space-between',
                            paddingRight: 50,
                          }}
                          renderItem={({item, index}) => {
                            return (
                              <View
                                style={{
                                  backgroundColor: color.palette.white,
                                  paddingTop: 16,
                                  paddingBottom: 13,
                                  paddingLeft: 10,
                                }}>
                                <Pressable
                                  onPress={() => {
                                    setSelectedTabs(item?.subcat_name);
                                    setSelectedSlug(item?.subcat_slug);
                                    setCategorySlug(subCat?.cat_slug);
                                    setLoading(true);
                                    setProductList([]);
                                    callCategoryApi(
                                      // searchData?.categorySelect?.menu_cat[0]?.cat_slug,
                                      subCat?.cat_slug,
                                      item?.subcat_slug,
                                      null,
                                      null,
                                      //   productList,
                                      [],
                                    );
                                  }}>
                                  <Text
                                    style={
                                      item?.subcat_name === selectedTab
                                        ? {
                                            fontFamily: typography.medium,
                                            fontSize:
                                              FontSize.font_extra_medium_O,
                                            color: color.palette.black,
                                            textAlign: 'center',
                                          }
                                        : {
                                            fontFamily: typography.primary,
                                            fontSize:
                                              FontSize.font_extra_medium_O,
                                            color: color.palette.textGrey,
                                          }
                                    }>
                                    {item?.subcat_name}
                                  </Text>
                                </Pressable>
                                {item?.subcat_name === selectedTab ? (
                                  <View
                                    style={{
                                      height: 3,
                                      // width: 100,
                                      backgroundColor: color.palette.btnColor,
                                      // position: 'absolute',
                                      top: 13,
                                    }}
                                  />
                                ) : null}
                              </View>
                            );
                          }}
                        />
                      </>
                    ) : null}
                  </View>

                  {/* {loading ? (
                    <Loader style={{marginTop: 30, paddingHorizontal: 0}} />
                  ) : productList !== 'No Record Found' ? null : (
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          fontFamily: typography.secondary,
                          fontSize: FontSize.font_large_E,
                          textAlign: 'center',
                          color: color.palette.red,
                          marginTop: 30,
                        }}>
                        No Record Found
                      </Text>
                    </View>
                  )} */}
                </>
              )}
            </View>
            <View style={{flex: 1}}>
              {loading ? (
                <Loader />
              ) : (
                <>
                  {productList?.length ? (
                    <FlatList
                      data={productList}
                      key="{"
                      keyExtractor={(item, index) => {
                        return '{' + index;
                      }}
                      // ListHeaderComponent={

                      // }
                      renderItem={({item, index}) => {
                        return (
                          <ProductFlatCard
                            title={item?.item_title}
                            productImage={item?.item_img_url}
                            price={item?.item_price}
                            item={item}
                            index={index}
                            handleCart={handleCart}
                            sub_title={item?.item_name}
                            counts={1}
                          />
                        );
                      }}
                      // onEndReachedThreshold={productList?.length <= 2 ? 0.2 : 0.5}
                      onEndReachedThreshold={0.5}
                      onEndReached={endReached}
                      ListFooterComponent={renderFooter}
                    />
                  ) : (
                    <Text
                      style={{
                        fontFamily: typography.medium,
                        fontSize: FontSize.font_medium_E,
                        textAlign: 'center',
                        marginTop: 10,
                        color: color.palette.red,
                      }}>
                      No Record Found
                    </Text>
                  )}
                </>
              )}
            </View>
          </View>
        )}
      </View>
      {/* } */}

      {/* )} */}
      {/* </View> */}

      {modalOpen ? (
        <Modal
          transparent={true}
          visible={modalOpen}
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
                  setModalOpen(!modalOpen);
                }}>
                <Image
                  source={require('../assets/icon/b_close.png')}
                  style={{
                    height: 25,
                    width: 25,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 10,
                  }}
                />
              </Pressable>
              {searchData?.menuCateogryList.map((item, index) => {
                let payload = {};
                Object.entries(item).map((item, index) => {
                  payload = {...payload, [item[0]]: item[1]};
                });

                return (
                  <View
                    key={'+' + index}
                    style={{
                      borderRadius: 6,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                    }}>
                    <Text
                      onPress={() => {
                        var data = {};
                        Object.entries(payload?.menu_cat[0]).map(
                          (item, index) => {
                            if (item[0] === 'menu_cat_sub') {
                              const innrData = item[1];
                              const arrData = [{subcat_name: 'All'}];
                              innrData.map((item, index) => {
                                arrData.push(item);
                              });
                              data = {...data, [item[0]]: arrData};
                            } else {
                              data = {...data, [item[0]]: item[1]};
                            }
                          },
                        );
                        setSubCat(data);
                        setModalOpen(!modalOpen);
                        setSelectedTabs(
                          //   payload?.menu_cat[0]?.menu_cat_sub[0]?.subcat_name,
                          'All',
                        );
                        setSelectedSlug(null);
                        setCategorySlug(payload?.menu_cat[0]?.cat_slug);
                        setLoading(true);
                        setProductList([]);
                        callCategoryApi(
                          payload?.menu_cat[0]?.cat_slug,
                          //   payload?.menu_cat[0]?.menu_cat_sub[0]?.subcat_slug,
                          null,
                          null,
                          null,
                          [],
                        );
                        flatListRef?.scrollToIndex({animated: true, index: 0});
                      }}
                      style={{
                        color: color.palette.btnColor,
                        fontFamily: typography.primary,
                        fontSize: FontSize.font_medium_E,
                      }}>
                      {payload.menu_name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Modal>
      ) : null}
      {openSortmodal ? (
        <Modal
          transparent={true}
          visible={openSortmodal}
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
                // marginHorizontal: 20,
                borderRadius: 10,
                marginVertical: 20,
              }}>
              <Pressable
                onPress={() => {
                  setSortModal(!openSortmodal);
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

              {sortOption.map((item, index) => {
                return (
                  <Text
                    onPress={() => {
                      var payload = {
                        order: item?.name === 'popular' ? item?.name : 'price',
                      };
                      if (item?.name !== 'popular') {
                        payload = {
                          ...payload,
                          sort: index === 1 ? 'asc' : 'desc',
                        };
                      }
                      setSelectedSort(payload);
                      setLoading(true);
                      setProductList([]);
                      callCategoryApi(
                        categorySlug,
                        selectedSlug,
                        payload,
                        null,
                        [],
                        // productList,
                      );
                      setSortModal(false);
                    }}
                    style={{
                      color: color.palette.btnColor,
                      fontFamily: typography.primary,
                      fontSize: FontSize.font_large_E,
                      marginHorizontal: 20,
                      marginBottom: 20,
                    }}>
                    {item?.name}
                  </Text>
                );
              })}
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 13,
  },
  backArrow: {height: 24, width: 24},
  tabView: {
    //alignSelf: 'center',
    // marginTop: 10,
    // flex: 1,
    // alignItems: 'center',
  },
});
