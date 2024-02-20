import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {Routes} from './routes';
import {OutsideStack} from './OutsideStack';
import {InsideStack} from './InsideStack';
import {color} from '../theme';
import {LaunchCameraModal, WelcomeScreen} from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  authToken,
  companyDetailData,
  imageToBase64,
  profileDetailData,
  verifiedUserData,
} from '../redux/slices/authSlice';
import {Loader} from '../ui-kit';
import {dialogOptions} from './navigation-utils';
import {getCartList, getCompanyData, getProfile} from '../services/api';
import RNFetchBlob from 'rn-fetch-blob';
import {updateCartNumber} from '../redux/slices/dashSlice';

const Stack = createStackNavigator();
export const RootNavigator = React.forwardRef((props, ref) => {
  const authData = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanyData()
      .then(res => {
        dispatch(companyDetailData(res?.companyDetails));
        convertImageToBase64(res?.companyDetails?.company_logo)
          .then(_res => {
            dispatch(imageToBase64(_res));
          })
          .catch(err => {
            console.log('err', err);
          });
      })
      .catch(err => {
        console.log('err', err);
      });

    const getStorage = async () => {
      await AsyncStorage.getItem('userData')
        .then(res => {
          //   console.log('ress sasdasd', res);
          const payload = new FormData();
          if (JSON.parse(res)) {
            dispatch(authToken(true));
            dispatch(verifiedUserData(JSON.parse(res)));
            const data = JSON.parse(res);
            payload.append('customer_ref_no', data?.customer_ref_no);

            getProfile(payload)
              .then(_res => {
                setLoading(false);
                dispatch(profileDetailData(_res?.customer_profile[0]));
              })
              .catch(err => {
                setLoading(false);
                console.log('err', err);
              });
          } else {
            setLoading(false);
            dispatch(authToken(null));
            dispatch(verifiedUserData(null));
          }
        })
        .catch(err => {
          setLoading(false);
          console.log('err', err);
        });
    };
    getStorage();
  }, [dispatch]);

  const convertImageToBase64 = imageUri => {
    console.log('image', imageUri);
    return new Promise((resolve, reject) => {
      //   RNFetchBlob.fs
      //     .readFile(imageUri, 'base64')
      //     .then(data => {
      //       resolve(data);
      //     })
      //     .catch(error => {
      //       reject(error);
      //     });
      RNFetchBlob.fetch('GET', imageUri)
        .then(res => {
          let status = res.info().status;

          if (status == 200) {
            // the conversion is done in native code
            let base64Str = res.base64();
            resolve(base64Str);
          } else {
            // handle other status codes
            reject('error');
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  return (
    <NavigationContainer
    // {...props} ref={ref}
    >
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={color.palette.btnColor}
          //   translucent={true}
        />
        {Loading ? (
          <Loader />
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              presentation: 'transparentModal',
            }}>
            {!authData?.authDetails ? (
              <>
                <Stack.Screen
                  name={Routes.WELCOMESCREEN}
                  component={WelcomeScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name={Routes.OUTSIDE_STACK}
                  component={OutsideStack}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name={Routes.INSIDE_STACK}
                  component={InsideStack}
                />
                <Stack.Screen
                  name={Routes.LAUNCH_CAMERA_MODAL}
                  component={LaunchCameraModal}
                  options={dialogOptions}
                />
                {/* 
              <Stack.Screen
                name={Routes.LANGUAGE_SELECTION}
                component={SelectLanguage}
                options={{headerShown: false}}
              /> */}
              </>
            )}
          </Stack.Navigator>
        )}
      </>
    </NavigationContainer>
  );
});
