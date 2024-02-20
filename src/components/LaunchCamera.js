/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Routes} from '../navigation';
import {color, typography} from '../theme';
import {Text} from '../ui-kit';

export const LaunchCamera = ({
  arr_image,
  setArrImage,
  handleCallImage,
  source,
  showVideo = false,
  directImg = false,
  title = null,
  view = false,
  photoType = null,
}) => {
  const navigation = useNavigation();
  const [deleteItem, setDeleteItem] = useState(false);
  const lang = useSelector(state => state.auth?.language);

  const handleClose = (item, index) => {
    // if (type === 'photo') {
    const arr = [...arr_image];
    const r_index = arr.indexOf(index);
    if (r_index >= -1) {
      arr.splice(index, 1);
      setArrImage(arr);
      //   dispatch(uploadPic(arr));
    }
    setDeleteItem(deleteItem => !deleteItem);
    // }
  };

  const handleView = item => {
    // setViewImage(true);
    // setImageVal(item?.media?.uri ?? item);
    // // if (item?.file_type === 'IMAGE') {
    // navigation.navigate(Routes.VIEW_IMAGES, {
    //   url: item?.media?.uri ?? item,
    //   source: source,
    // });
    // }
    // if (item?.file_type === 'VIDEO') {
    //   navigation.navigate(Routes.VIEW_VIDEO, {url: item?.image_url ?? item});
    // }
    // if (item?.type === 'photo') {
    //   navigation.navigate(Routes.VIEW_IMAGES, {url: item?.media ?? item});
    // } else if (item?.type === 'video') {
    //   navigation.navigate(Routes.VIEW_VIDEO, {url: item?.media ?? item});
    // }
  };

  return (
    <>
      {/* {viewImage ? (
        <View
          style={{
            flex: 1,
            backgroundColor: color.palette.black,
            paddingTop: 30,
          }}>
          <TouchableWithoutFeedback
            hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
            onPress={() => {
              setViewImage(false);
              setImageVal(null);
            }}>
            <Image
              source={require('../assets/icon/close.png')}
              style={{
                tintColor: color.palette.white,
                alignSelf: 'flex-end',
                height: 30,
                width: 30,
                right: 15,
              }}
            />
          </TouchableWithoutFeedback>
          <View
            style={{
              flex: 1,
              backgroundColor: color.palette.black,
              justifyContent: 'center',
            }}>
            <ImageViewer
              imageUrls={[
                {
                  url: imageVal,
                },
              ]}
              style={{resizeMode: 'cover', width: width, height: 500}}
            />
          </View>
        </View>
      ) : ( */}
      <View style={styles.rowView}>
        {arr_image?.length ? (
          <FlatList
            data={arr_image}
            horizontal
            key={'$'}
            keyExtractor={(item, index) => {
              return '$' + index.toString();
            }}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    // height: 60,
                    // width: 60,
                    justifyContent: 'flex-end',
                  }}>
                  {/* <Pressable
                    onPress={() => {
                      handleClose(item, index);
                    }}
                    hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}>
                    <Image
                      source={require('../assets/icon/close.png')}
                      style={styles.icon}
                    />
                  </Pressable> */}
                  <View style={{flexDirection: 'row', marginTop: 30}}>
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        handleView(item);
                      }}>
                      {item?.type === 'photo' ? (
                        <Image
                          source={{
                            uri: item?.media.uri ?? item,
                          }}
                          style={styles.imageStyle}
                        />
                      ) : (
                        <Image
                          source={{
                            uri: item,
                          }}
                          style={styles.imageStyle}
                        />
                      )}
                      {item?.type === 'video' && (
                        <View style={styles.videoStyleView}>
                          {/* <Image
                          source={require('../assets/icon/play.png')}
                          style={styles.videoImgStyleView}
                        /> */}
                        </View>
                      )}
                      {item?.file_type === 'IMAGE' && (
                        <Image
                          source={{
                            uri: item?.image_url ?? item,
                          }}
                          style={styles.imageStyle}
                        />
                      )}

                      {item?.file_type === 'VIDEO' && (
                        <View style={styles.videoStyleView}>
                          {/* <Image
                          source={require('../assets/icon/play.png')}
                          style={styles.videoImgStyleView}
                        /> */}
                        </View>
                      )}
                      {view &&
                        (item?.type === 'photo' ? null : (
                          <Image
                            source={{uri: item?.image_url ?? item}}
                            style={styles.imageStyle}
                          />
                        ))}
                      {/* {!item?.media && (
                      <Image source={{uri: item}} style={styles.imageStyle} />
                    )} */}
                    </TouchableOpacity>
                    <Text
                      onPress={() => {
                        handleCallImage();
                        navigation.navigate(Routes.LAUNCH_CAMERA_MODAL, {
                          source: source,
                          photoType: photoType,
                        });
                      }}
                      style={styles.changes}>
                      {lang?.Change}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <Pressable
            style={styles.dotted}
            onPress={() => {
              handleCallImage();
              navigation.navigate(Routes.LAUNCH_CAMERA_MODAL, {
                source: source,
                photoType: photoType,
              });
            }}>
            <Image
              source={require('../assets/icon/Camera.png')}
              style={styles.icons}
            />
            <Text style={styles.text}>
              {title ? title : lang?.ClickPhotoOfAadhaarCardWithYourCamera}
            </Text>
          </Pressable>
        )}
        {/* </Pressable> */}
      </View>
      {/* )} */}
    </>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: 53,
    width: 53,
    marginRight: 20,
    borderRadius: 4,
  },
  icon: {
    height: 13,
    width: 13,
    position: 'absolute',
    right: 13,
    top: 0,
    zIndex: 2,
  },
  rowView: {
    flexDirection: 'row',
    flex: 1,
  },
  videoStyleView: {
    backgroundColor: color.palette.black,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 53,
    height: 53,
  },
  videoImgStyleView: {
    tintColor: color.palette.white,
    width: 35,
    height: 35,
    marginRight: 20,
    borderRadius: 4,
  },
  dotted: {
    flexDirection: 'row',
    backgroundColor: color.palette.textFeildBg,
    borderWidth: 1,
    borderColor: color.palette.btnColor,
    borderStyle: 'dotted',
    marginTop: 8,
    paddingVertical: 30,
    justifyContent: 'center',
    borderRadius: 5,
    flex: 1,
  },
  text: {
    fontFamily: typography.primary,
    // lineHeight: 15.6,
    color: color.palette.black2,
  },
  icons: {
    height: 16.5,
    width: 18.33,
    marginRight: 9,
  },
  changes: {
    color: color.palette.btnColor,
    fontFamily: typography.primary,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
});
