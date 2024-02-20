import {flatten, mergeAll} from 'ramda';
import React from 'react';
import {Image, Pressable, StyleSheet, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {FontSize, color, spacing, typography} from '../../theme';
import {Text} from '../text';

const INPUT = {
  // borderWidth: StyleSheet.hairlineWidth,
  // borderColor: color.palette.warmGrey,
  // borderRadius: 5,
  backgroundColor: color.palette.white,
  paddingHorizontal: spacing[3],
  flex: 1,
  paddingTop: 5,
  paddingBottom: 5,
  justifyContent: 'center',
  alignItems: 'flex-start',
  height: 56,
};

const LABEL = {
  marginBottom: 12,
  fontSize: FontSize.font_large_E,
  color: color.palette.dark_grey2,
  lineHeight: 20.11,
};

const VARIATIONS = {
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.palette.textInputBorder,
    borderRadius: 4,
  },
  underline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.palette.hairLineColor,
  },
  danger: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'red',
    borderRadius: 4,
  },
  disabled: {
    //borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.palette.hairLineColor,
    borderRadius: 10,
    backgroundColor: color.palette.disableColor,
  },
};

const ICON_CONTAINER = {
  height: '100%',
  aspectRatio: 0.5,
  justifyContent: 'center',
  position: 'absolute',
  right: 5,
  marginRight: 5,
  marginLeft: 4,
};

const ICON = {
  width: 15,
  height: 15,
};

const PLACEHOLDER = {
  fontSize: FontSize.font_medium_E,
  lineHeight: 17,
  letterSpacing: -0.14,
  fontFamily: typography.primary,
  color: color.palette.warmGrey,
};

const TEXTSTYLE = {
  lineHeight: 17,
  letterSpacing: -0.14,
  fontFamily: typography.primary,
  color: color.palette.black,
  fontSize: FontSize.font_medium_E,
};

const ERROR = {
  borderColor: color.palette.red,
};

const enhance = (style, styleOverride) => {
  return mergeAll(flatten([style, styleOverride]));
};

export function StaticTextBox(props) {
  const {
    placeholder = '',
    value,
    inputStyle: inputStyleOverride,
    iconStyle: iconStyleOverride,
    onIconPress = () => {},
    onPress = () => {},
    icon,
    required,
    label = 'Search By',
    labelStyle: labelStyleOverride,
    errorMessage,
    textStyle: textOverride,
    variant = 'bordered',
    disabled,
  } = props;

  let errorStyleOverride = errorMessage ? ERROR : {};

  let inputStyle = enhance(
    {...INPUT, ...VARIATIONS[variant]},
    inputStyleOverride,
  );

  inputStyle = enhance(inputStyle, errorStyleOverride);

  let textStyle = enhance(TEXTSTYLE, textOverride);
  //   inputStyle = enhance(inputStyle, errorStyleOverride);

  let iconStyle = enhance(ICON, iconStyleOverride);

  let placeholderStyle = PLACEHOLDER;

  let labelStyle = enhance(LABEL, labelStyleOverride);

  return (
    <>
      <View>
        {label && (
          <Text variant={'fieldLabel'} style={labelStyle}>
            {label}
            {required && label && (
              <Text variant={'fieldError'} style={{color: color.palette.red}}>
                *
              </Text>
            )}
          </Text>
        )}
        <Pressable style={inputStyle} onPress={!disabled ? onPress : null}>
          <Text
            numberOfLines={1}
            style={
              value === null || value === '' ? placeholderStyle : textStyle
            }>
            {value === null || value === '' ? placeholder : value}
          </Text>
          {value && (
            <TouchableOpacity
              style={ICON_CONTAINER}
              activeOpacity={0.8}
              onPress={onIconPress}>
              <Image
                source={icon}
                style={iconStyle}
                resizeMode={'contain'}
                fadeDuration={600}
              />
            </TouchableOpacity>
          )}
        </Pressable>
      </View>
    </>
  );
}
