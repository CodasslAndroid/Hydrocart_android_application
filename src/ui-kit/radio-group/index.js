import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {FontSize, typography} from '../../theme';
import {color} from '../../theme/color';

const LABEL = {
  // marginLeft: 5,
  fontFamily: typography.primary,
};

const DEFAULT_ITEM_LAYOUT = (option, labelStyleOverride, onPress) => (
  <Text
    onPress={() => {
      onPress();
    }}
    style={[LABEL, labelStyleOverride]}>
    {option}
  </Text>
);

export const RadioGroup = props => {
  const {
    items,
    onPress,
    selectedIndex,
    orientation,
    selectedButtonStyle,
    buttonStyle,
    textStyle: labelStyleOverride,
    buttonPosition,
    itemLayout = DEFAULT_ITEM_LAYOUT,
    style: styleOverride,
    requiredImage,
    containerStyle: containerStyleOverride,
  } = props;

  return (
    <View
      style={[
        orientation === 'vertical'
          ? styles.verticalOrientation
          : styles.horizontalOrientation,
        styleOverride,
      ]}>
      {items.map((res, index) => {
        return buttonPosition === 'right' ? (
          <View
            style={[
              orientation === 'vertical'
                ? styles.container
                : styles.horizontalContainer,
              containerStyleOverride,
            ]}
            key={index}>
            {itemLayout(res, labelStyleOverride, () => onPress(res, index))}
            {/* {requiredImage && (
              <Image
                source={
                  index === 1
                    ? require('../../assets/icons/upArrow1.png')
                    : require('../../assets/icons/downArrow1.png')
                }
                style={styles.icon}
              />
            )} */}
            <View style={styles.outerCircle}>
              <TouchableOpacity
                style={
                  selectedIndex === index
                    ? selectedButtonStyle !== undefined
                      ? selectedButtonStyle
                      : styles.selectedRb
                    : buttonStyle !== undefined
                    ? buttonStyle
                    : styles.radioCircle
                }
                onPress={() => onPress(res, index)}
                activeOpacity={1}
              />
            </View>
          </View>
        ) : (
          <View
            style={[
              orientation === 'vertical'
                ? styles.container
                : orientation === 'center-horizontal'
                ? styles.centerHorizontalOrientation
                : styles.horizontalContainer,
              containerStyleOverride,
            ]}
            key={index}>
            <View style={[styles.outerCircle]}>
              <TouchableOpacity
                style={
                  selectedIndex === index
                    ? selectedButtonStyle !== undefined
                      ? selectedButtonStyle
                      : styles.selectedRb
                    : buttonStyle !== undefined
                    ? buttonStyle
                    : styles.radioCircle
                }
                onPress={() => onPress(res, index)}
                activeOpacity={1}
              />
            </View>
            {itemLayout(res, labelStyleOverride, () => onPress(res, index))}
            {/* {requiredImage && (
              <Image
                source={
                  index === 1
                    ? require('../../assets/icons/upArrow1.png')
                    : require('../../assets/icons/downArrow1.png')
                }
                style={styles.icon}
              />
            )} */}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 12,
  },
  horizontalContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight: 30,
  },
  radioText: {
    marginLeft: 5,
    fontSize: FontSize.font_small_E,
    color: '#000',
    textAlign: 'left',
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 0.5,
    borderColor: color.palette.white,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  outerCircle: {
    height: 15,
    width: 15,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: color.palette.light_grey,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: color.palette.btnColor,
  },
  selectedRb: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: color.palette.white,
    // marginHorizontal: 5,
  },
  verticalOrientation: {
    flexDirection: 'column',
  },
  horizontalOrientation: {
    flexDirection: 'row',
  },
  centerHorizontalOrientation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 24,
  },
  icon: {
    tintColor: color.palette.light_grey,
    marginLeft: 4,
  },
});
