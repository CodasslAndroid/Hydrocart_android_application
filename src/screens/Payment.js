import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  Platform,
  BackHandler,
  Pressable,
  Image,
} from 'react-native'; // Import Linking
import {WebView} from 'react-native-webview';
import {useEffect, useRef, useState} from 'react';
import {Asset} from 'expo-asset';
import {readAsStringAsync} from 'expo-file-system';
import {Button, Loader} from '../ui-kit';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {CommonHeader} from '../components';
import {color} from '../theme';

export const Payment = ({route}) => {
  const {token, orderId, merchantId, logo} = route?.params ?? {};
  const userData = useSelector(state => state.auth);
  const navigation = useNavigation();
  const [html, setHtml] = useState('');
  const [error, setError] = useState(null);
  const [load, setLoad] = useState(true);
  const webViewRef = useRef(null);

  console.log('token', token, orderId);

  useEffect(() => {
    (async () => {
      const files = await Asset.loadAsync(require('../assets/index.html'));
      const fileContents = await readAsStringAsync(files[0].localUri);

      let content = fileContents
        .replace('bdorderid', orderId)
        .replace('GiveOToken', token)
        .replace('logo', logo)
        .replace('merchantid', merchantId);

      console.log('conternt', content);

      setHtml(content);
      //   setHtml();
    })();
  }, [orderId, token, userData?.base64]);

  const handleShouldStartLoadWithRequest = event => {
    const url = event.url;

    if (Platform.OS === 'android') {
      if (url.startsWith('upi://pay')) {
        Linking.openURL(url);
        return false;
      }
    }

    return true;
  };

  return (
    <View style={{flex: 1, backgroundColor: color.palette.white}}>
      {/* <CommonHeader title={''} /> */}
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={require('../assets/icon/left.png')}
          style={styles.backArrow}
        />
      </Pressable>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        source={{html}}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onMessage={event => {
          console.log(event.nativeEvent.data);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {height: 24, width: 24, marginLeft: 10, marginTop: 10},
});
