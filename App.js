import React, {useEffect, useRef, useState} from 'react';
import {Image, View, Text, StyleSheet} from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {Provider, useDispatch} from 'react-redux';
import storage from 'redux-persist/lib/storage';
import {NAVIGATION_PERSISTENCE_KEY} from './src/constants/keys';
import {NetworkConnectionProvider} from './src/context';
import {
  RootNavigator,
  setRootNavigation,
  useNavigationPersistence,
} from './src/navigation';
import {authToken, verifiedUserData} from './src/redux/slices/authSlice';
import {store} from './src/redux/store';
import {color, typography} from './src/theme';

const App = () => {
  const navigationRef = useRef();

  const [loading, setLoading] = useState(true);

  setRootNavigation(navigationRef);
  const {initialNavigationState, onNavigationStateChange} =
    useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <NetworkConnectionProvider>
          {loading ? (
            <>
              <View style={styles.wholeView}>
                <View style={styles.imgView}>
                  <Image
                    source={require('./src/assets/icon/logo.png')}
                    style={styles.img}
                  />
                </View>
                <View style={styles.btmView}>
                  <Text style={styles.btmTxt}>@ Copyright 2023</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <RootNavigator
                ref={navigationRef}
                initialState={initialNavigationState}
                onStateChange={onNavigationStateChange}
              />
            </>
          )}
        </NetworkConnectionProvider>
      </SafeAreaProvider>
    </Provider>
  );
};
export default App;

const styles = StyleSheet.create({
  wholeView: {
    flex: 1,
    backgroundColor: color.palette.btnColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgView: {flex: 1, justifyContent: 'center'},
  img: {height: 100, width: 100, alignSelf: 'center'},
  btmTxt: {
    color: color.palette.white,
    fontFamily: typography.primary,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  btmView: {
    justifyContent: 'flex-end',
  },
});
