import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FontSize, color} from '../theme';
import {Text} from '../ui-kit';
import {Screen} from '../ui-kit/screen';

export function NetworkConnectionError() {
  return (
    <Screen variant={'scroll'}>
      <View style={styles.errorContainer}>
        <View>
          {/* <Image
            source={require('../../assets/illustrations/error.png')}
            style={styles.img}
          /> */}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.subText}>
            Please check your network connectivity and try again
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: 30,
    justifyContent: 'center',
    // backgroundColor: 'black',
  },
  img: {height: 120, width: 120},
  textContainer: {
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: FontSize.font_Ex_Large_E,
    fontWeight: 'bold',
    color: color.palette.black,
  },
  subText: {
    fontSize: FontSize.font_large_E,
    fontWeight: '500',
    paddingHorizontal: 50,
    textAlign: 'center',
    color: color.palette.black,
  },
});
