/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {Text} from '../text';
import {FontSize, color, typography} from '../../theme';
import {mergeAll, flatten} from 'ramda';

const THUMB_SIZE = 22;
const BORDER_RADIUS = (THUMB_SIZE * 3) / 4;

/**
 * value - On or off.
 *
 * onToggle- (newValue) => void - Fires when the on/off switch triggers
 * newValue The new value we're switching to.
 *
 * style - A style override to apply to the container.  Useful for margins and paddings.
 *
 * trackOnStyle - Additional track styling when on.
 *
 * trackOffStyle - Additional track styling when off.
 *
 * thumbOnStyle - Additional thumb styling when on.
 *
 * thumbOffStyle - Additional thumb styling when off.
 */
export function SwitchBar(props) {
  const {
    firstValue,
    secondValue,
    thirdValue,
    switchStyle,
    btnStyle,
    styleInnnerView,
    styleWidth = 134,
    marginValue,
  } = props;

  const [movePosition, setMovePosition] = useState(marginValue);
  // dimensions
  const WIDTH = styleWidth;
  const MARGIN = 1;
  const OFF_POSITION = -0.5;
  //   const ON_POSITION = WIDTH - THUMB_SIZE * 2 - MARGIN * marginValue;
  const ON_POSITION = movePosition;
  const BORDER_ON_COLOR = 'rgba(0, 0, 0, 0.1)';
  const BORDER_OFF_COLOR = 'rgba(0, 0, 0, 0.1)';

  // animation
  const DURATION = 300;

  // the track always has these props
  const TRACK = {
    height: THUMB_SIZE + MARGIN,
    width: WIDTH,
    borderRadius: BORDER_RADIUS,
    borderWidth: MARGIN / 2,
  };

  // the thumb always has these props
  const THUMB = {
    position: 'absolute',
    height: 30,
    borderRadius: BORDER_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    width: 84,
    borderColor: BORDER_OFF_COLOR,
    backgroundColor: color.palette.btnColor,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  };

  const enhance = (style, newStyles) => {
    return mergeAll(flatten([style, newStyles]));
  };

  const makeAnimatedValue = switchOn => new Animated.Value(switchOn ? 1 : 0);

  const [timer] = useState(makeAnimatedValue(props.value));

  const startAnimation = useCallback(
    newValue => {
      const toValue = newValue ? 1 : 1;
      const easing = Easing.out(Easing.circle);
      Animated.timing(timer, {
        toValue,
        duration: DURATION,
        easing,
        useNativeDriver: true,
      }).start();
    },
    [timer],
  );

  const [previousValue, setPreviousValue] = useState(props.value);
  //   const switchValue = previousValue ? secondValue : firstValue;
  const [switchValue, setSwitchValue] = useState('Groups');

  const handlePress = useCallback(
    (fVal, sVal) => {
      let nVal = !previousValue;
      let selectedData;
      setPreviousValue(nVal);
      if (nVal) {
        selectedData = sVal.toLowerCase();
      } else {
        selectedData = fVal.toLowerCase();
      }

      props.onToggle(nVal, selectedData);

      startAnimation(!props.value);
      setPreviousValue(!props.value);
    },
    [previousValue, props, startAnimation],
  );

  const handleText = useCallback(
    value => {
      if (value === 'Contacts') {
        setMovePosition(marginValue / 2.8);
        setSwitchValue(value);
      } else if (value === 'Teams') {
        setMovePosition(marginValue / 1.43);
        setSwitchValue(value);
      } else if (value === 'Groups') {
        setMovePosition(-0.5);
        setSwitchValue(value);
      }

      let nVal = !previousValue;
      let selectedData;
      setPreviousValue(nVal);
      // if (nVal) {
      //   selectedData = sVal.toLowerCase();
      // } else {
      //   selectedData = fVal.toLowerCase();
      // }
      selectedData = value.toLowerCase();
      props.onToggle(nVal, selectedData);

      startAnimation(!props.value);
      setPreviousValue(!props.value);
    },
    [marginValue, previousValue, props, startAnimation],
  );

  //   const handleText = (value) => {
  //     console.log('value', value);
  //     startAnimation(!props.value);
  //     setPreviousValue(!props.value);
  //   };

  if (!timer) {
    return null;
  }

  const translateX = timer.interpolate({
    inputRange: [0, 1],
    outputRange: [OFF_POSITION, ON_POSITION],
  });

  // const style = enhance({}, props.style);

  let trackStyle = TRACK;

  trackStyle = enhance(trackStyle, {
    borderColor: previousValue ? BORDER_ON_COLOR : BORDER_OFF_COLOR,
  });

  trackStyle = enhance(
    trackStyle,
    previousValue ? props.trackOnStyle : props.trackOffStyle,
  );

  let thumbStyle = THUMB;

  thumbStyle = enhance(thumbStyle, {
    transform: [{translateX}],
    backgroundColor: color.palette.btnColor,
    borderColor: previousValue ? color.primary : BORDER_OFF_COLOR,
    borderWidth: StyleSheet.hairlineWidth,
  });

  thumbStyle = enhance(
    thumbStyle,
    previousValue ? props.thumbOnStyle : props.thumbOffStyle,
  );

  return (
    <View style={[switchStyle, {alignSelf: 'center'}]}>
      <Pressable
      // onPress={() => {
      //   handlePress(firstValue, secondValue);
      // }}
      >
        <Animated.View style={[styles.switchView, switchStyle]}>
          <View style={[styles.innerView, styleInnnerView]}>
            <TouchableWithoutFeedback
              hitSlop={{top: 15, bottom: 15, right: 15, left: 15}}
              onPress={() => {
                handleText(firstValue);
              }}>
              <Text style={styles.title}>{firstValue}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              hitSlop={{top: 15, bottom: 15, right: 15, left: 15}}
              onPress={() => {
                handleText(secondValue);
              }}>
              <Text style={styles.title}>{secondValue}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              hitSlop={{top: 15, bottom: 15, right: 15, left: 15}}
              onPress={() => {
                handleText(thirdValue);
              }}>
              <Text style={styles.title}>{thirdValue}</Text>
            </TouchableWithoutFeedback>
          </View>

          <Text style={{paddingLeft: 20}}> {'    '}</Text>
        </Animated.View>
        <Animated.View style={[thumbStyle, btnStyle]}>
          <View style={[styles.innerView, styleInnnerView]}>
            <Text
              style={[
                styles.title,
                {color: color.palette.white, fontFamily: typography.secondary},
              ]}>
              {switchValue}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_small_E,
    lineHeight: 15.08,
    marginTop: 2,
  },
  switchView: {
    height: 30,
    width: 157,
    borderRadius: BORDER_RADIUS,
    // borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: color.palette.switchBackgroundColor,
  },
  innerView: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'center',
    top: 5,
    justifyContent: 'space-around',

    // marginTop: 5,
  },
});
