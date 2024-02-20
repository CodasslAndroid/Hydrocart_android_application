/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {check, PERMISSIONS} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import {uploadPic} from '../redux/slices/dashSlice';

import {FontSize, color, typography} from '../theme';
import {Loader, Text} from '../ui-kit';

const windowWidth = Dimensions.get('window').width;
export const LaunchCameraModal = ({route}) => {
  const {source, profilePhoto, video} = route?.params ?? {};
  const dashstore = useSelector(state => state.dashboard);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const [captureImage, setCaptureImage] = useState(
    dashstore?.stateImage ? dashstore?.stateImage : [],
  );
  const [up_load, setUPLoad] = useState(false);
  const [tp_load, setTPLoad] = useState(false);
  const [up_load_video, setUPLoadVideo] = useState(false);
  const user = useSelector(state => state?.auth);
  const appState = useRef(AppState.currentState);
  const [myFlag, setMyFlag] = useState(null);
  const [camaraStatus, setCamaraStatus] = useState('');
  const [cameraPermissionAlert, showCameraPermissionAlert] = useState(false);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }
      appState.current = nextAppState;
      // setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
      if (appState.current === 'active') {
        setMyFlag(Math.floor(Math.random() * 100 + 1));
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (profilePhoto) {
      setCaptureImage();
    }
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        // try {
        //   const granted = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.CAMERA,
        //     {
        //       title: 'Cool Photo App Camera Permission',
        //       message:
        //         'Cool Photo App needs access to your camera ' +
        //         'so you can take awesome pictures.',
        //       buttonNeutral: 'Ask Me Later',
        //       buttonNegative: 'Cancel',
        //       buttonPositive: 'OK',
        //     },
        //   );
        //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //     console.log('You can use the camera');
        //   } else {
        //     setCamaraStatus('blocked');
        //     console.log('Camera permission denied');
        //   }
        // } catch (err) {
        //   console.warn(err);
        // }
      } else {
        const response = await check(
          Platform.select({
            ios: PERMISSIONS.IOS.CAMERA,
            android: PERMISSIONS.ANDROID.CAMERA,
          }),
        );

        setCamaraStatus(response);
      }
    };
    requestCameraPermission();
  }, [profilePhoto, myFlag]);

  const handleTakePic = type => {
    type === 'photo' ? setTPLoad(true) : setUPLoadVideo(true);
    let optoins = {
      mediaType: type,
      includeBase64: true,
      maxWidth: 600,
      maxHeight: 600,
      quality: 0.9,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    if (type === 'video') {
      optoins = {
        ...optoins,
        videoQuality: 'medium',
        durationLimit: 6,
        //
        title: 'Select video',
        mediaType: 'video',
        path: 'video',
        quality: 1,
        //
      };
    }
    let array = captureImage?.length > 0 ? captureImage : [];
    array = Object.assign([], array);
    if (camaraStatus === 'blocked') {
      setTPLoad(false);
      showCameraPermissionAlert(true);
    } else {
      launchCamera(optoins, res => {
        if (res.didCancel) {
          type === 'photo' ? setTPLoad(false) : setUPLoadVideo(false);
          console.log('User cancelled image picker');
        } else if (res.error) {
          type === 'photo' ? setTPLoad(false) : setUPLoadVideo(false);
          console.log('ImagePicker Error: ', res.error);
        } else if (res.customButton) {
          type === 'photo' ? setTPLoad(false) : setUPLoadVideo(false);
          console.log('User tapped custom button: ', res.customButton);
        } else {
          res?.assets.map((item, index) => {
            array.push({media: item, type: type});
          });
          setCaptureImage(array);
          dispatch(uploadPic(array));
          type === 'photo' ? setTPLoad(false) : setUPLoadVideo(false);
          navigation.navigate(source, {images: array, type: 'YES'});
        }
      });
    }
  };

  const handleUploadPhoto = async type => {
    setUPLoad(true);
    let options = {
      mediaType: type,
      includeBase64: true,
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.9,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      selectionLimit: profilePhoto ? 1 : 0,
    };
    if (type === 'video') {
      options = {
        ...options,
        videoQuality: 'low',
        durationLimit: 6,
      };
    }
    let array = captureImage?.length > 0 ? captureImage : [];
    array = Object.assign([], array);
    launchImageLibrary(options, async res => {
      if (res.didCancel) {
        setUPLoad(false);
        console.log('User cancelled image picker');
      } else if (res.error) {
        setUPLoad(false);
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        setUPLoad(false);
        console.log('User tapped custom button: ', res.customButton);
      } else {
        res?.assets.map((item, index) => {
          array.push({media: item, type: type});
        });
        setCaptureImage(array);
        dispatch(uploadPic(array));
        setUPLoad(false);
        navigation.navigate(source, {images: array, type: 'NO'});
      }
    });
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1}>
      <View style={styles.dialog}>
        <View style={styles.messageView}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={require('../assets/icon/b_close.png')}
              style={styles.image}
              hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
            />
          </TouchableOpacity>
          {cameraPermissionAlert ? (
            <>
              <TouchableWithoutFeedback
                onPress={() => {
                  Linking.openSettings();
                }}>
                <View
                  style={{
                    flex: 0.7,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../assets/icon/camera.png')}
                    style={[
                      styles.icon,
                      {
                        height: 32,
                        width: 32,
                        tintColor: color.palette.btnColor,
                      },
                    ]}
                  />
                  <Text style={styles.permis}>Enable camera permission</Text>
                </View>
              </TouchableWithoutFeedback>
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.text,
                  {lineHeight: Platform?.OS === 'ios' ? 0 : 25.14},
                ]}>
                Choose Image From
              </Text>
              <View style={styles.btnView}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    handleTakePic('photo');
                  }}>
                  <View style={styles.rowView}>
                    {!tp_load ? (
                      <>
                        <Image
                          source={require('../assets/icon/camera.png')}
                          style={styles.icon}
                        />
                        <Text
                          style={[
                            styles.btnText,
                            {
                              lineHeight: Platform?.OS === 'ios' ? 0 : 20,
                            },
                          ]}>
                          Camera
                        </Text>
                      </>
                    ) : (
                      <Loader
                        loaderStyle={{paddingBottom: 0}}
                        style={{
                          backgroundColor: 'transparent',
                        }}
                        color={color.palette.white}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    handleUploadPhoto('photo');
                  }}>
                  <View
                    style={[
                      styles.rowView,
                      {borderWidth: 2},
                      //   {backgroundColor: color.palette.backgroundGrey},
                    ]}>
                    {!up_load ? (
                      <>
                        <Image
                          source={require('../assets/icon/gallery.png')}
                          style={[
                            styles.icon,
                            // {tintColor: color.palette.btnColor},
                          ]}
                        />
                        <Text
                          style={[
                            styles.btnText,
                            {
                              lineHeight: Platform?.OS === 'ios' ? 0 : 20,
                            },
                          ]}>
                          Gallery
                        </Text>
                      </>
                    ) : (
                      <Loader
                        loaderStyle={{paddingBottom: 0}}
                        style={{
                          backgroundColor: 'transparent',
                        }}
                        color={color.palette.white}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  dialog: {
    width: windowWidth / 1.3,
    backgroundColor: 'white',
    borderRadius: 7,
    flex: 0.33,
  },
  messageView: {flex: 1, alignItems: 'center'},
  image: {
    height: 20,
    width: 20,
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 17,
  },
  btn: {
    height: 40,
    marginBottom: 12,
  },
  btnView: {justifyContent: 'center', flex: 1},
  btnText: {
    fontFamily: typography.secondary,
    fontSize: FontSize.font_large_E,
    lineHeight: 20,
    color: color.palette.white,
  },
  close: {
    alignSelf: 'flex-end',
  },
  rowView: {
    flexDirection: 'row',
    backgroundColor: color.palette.btnColor,
    width: 131,
    height: 42,
    borderRadius: 6,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    height: 22,
    width: 22,
    tintColor: color.palette.white,
  },
  Videoicon: {
    height: 30,
    width: 30,
    tintColor: color.palette.white,
  },
  text: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_large_E,
    lineHeight: 20.11,
  },
});
