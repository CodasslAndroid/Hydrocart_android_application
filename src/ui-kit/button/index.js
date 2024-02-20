import {flatten, mergeAll} from 'ramda';
import * as React from 'react';
import {ActivityIndicator, Image, Pressable, View} from 'react-native';
import {FontSize, color, spacing, typography} from '../../theme';
import {Text} from '../text';

const BASE_VIEW = {
  // paddingVertical: spacing[2],
  paddingHorizontal: spacing[2],
  borderRadius: 6,
  justifyContent: 'center',
  alignItems: 'center',
};

const BASE_TEXT = {
  fontSize: FontSize.font_extra_large_E,
  paddingHorizontal: spacing[3],
  fontFamily: typography.semiBold,
};
/**
 * variant / type / preset -> All these are same thing
 */
const viewVariants = {
  solid: {...BASE_VIEW, backgroundColor: color.palette.btnColor},
  link: {
    ...BASE_VIEW,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'flex-start',
  },
  outline: {
    ...BASE_VIEW,
    borderWidth: 2,
    borderColor: color.palette.btnColor,
    backgroundColor: 'white',
  },
};

const textVariants = {
  solid: {
    ...BASE_TEXT,
    color: color.palette.white,
    textAlign: 'center',
    letterSpacing: 0,
  },
  //   link: {
  //     ...BASE_TEXT,
  //     color: color.palette.brownishGrey,
  //     paddingHorizontal: 0,
  //     paddingVertical: 0,
  //     fontFamily: typography.primary,
  //     textDecorationLine: 'underline',
  //   },
  outline: {
    ...BASE_TEXT,
    color: color.palette.btnColor,
    fontFamily: typography.secondary,
    textAlign: 'center',
  },
};

/**
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props) {
  const {
    variant = 'solid',
    title,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    disabled,
    loading,
    // icon = require('../../assets/icon/go.png'),
    image = true,
    imageStyle,
    ...rest
  } = props;

  const viewStyle = mergeAll(
    flatten([viewVariants[variant] || viewVariants.solid, styleOverride]),
  );
  const textStyle = mergeAll(
    flatten([textVariants[variant] || textVariants.solid, textStyleOverride]),
  );

  const content = children || (
    <>
      {image ? (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Text text={title} style={textStyle} />

          {/* <Image
            source={icon}
            style={[imageStyle ? imageStyle : {height: 15.22, width: 15.35}]}
          /> */}
        </View>
      ) : (
        <Text text={title} style={textStyle} />
      )}
    </>
  );

  const disableStyle =
    variant === 'link'
      ? {backgroundColor: color.palette.white}
      : {backgroundColor: color.palette.disableColor};

  return (
    <Pressable
      style={[viewStyle, disabled && disableStyle]}
      {...{disabled}}
      {...rest}
      android_ripple={{color: color.palette.white}}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'link' || variant === 'outline'
              ? color.primary
              : color.palette.white
          }
        />
      ) : (
        content
      )}
    </Pressable>
  );
}
