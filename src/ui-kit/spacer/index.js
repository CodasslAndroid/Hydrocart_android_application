import React from 'react';
import {View} from 'react-native';

export const Vertical = ({size = 10}) => (
  <View style={{marginVertical: size / 2}} />
);

export const Horizontal = ({size = 10}) => (
  <View style={{marginHorizontal: size / 2}} />
);
