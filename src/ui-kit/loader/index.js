import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {color} from '../../theme';

export function Loader(props) {
  const {
    style: styleOverride,
    loaderStyle: loaderStyleOverride,
    color: loaderColor = color.palette.btnColor,
    size = 'small',
  } = props;
  return (
    <View style={[styles.container, styleOverride]}>
      <View style={[styles.loader, loaderStyleOverride]}>
        <ActivityIndicator color={loaderColor} size={size} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white',
  },
  loader: {paddingBottom: 0},
});
