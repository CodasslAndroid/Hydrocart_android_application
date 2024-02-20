import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FontSize, color} from '../../theme';
import {Text} from '../text';

const SOLID = {
  width: '100%',
  borderBottomWidth: 0.5,
  borderColor: '#C4C4C4',
};

const CONTAINER = {
  flexDirection: 'row',
  justifyContent: 'center',
  overflow: 'hidden',
  // width: '100%',
};

const DASHED = {
  color: color.palette.light_grey,
  letterSpacing: -1.87,
  fontSize: FontSize.font_Ex_Large_E,
};

/**
 * variant -> (solid | dashed)
 */
export function Divider(props) {
  const {variant = 'solid', style: styleOverride} = props;

  return variant === 'solid' ? (
    <View style={[SOLID, styleOverride]} />
  ) : (
    <View style={CONTAINER}>
      {[...Array(60)].map((_, ind) => {
        return (
          <Text key={ind} style={[DASHED, styleOverride]}>
            {' '}
            --
          </Text>
        );
      })}
    </View>
  );
}
