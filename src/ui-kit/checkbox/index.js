import {flatten, mergeAll} from 'ramda';
import * as React from 'react';
import {Image, Keyboard, View, Pressable} from 'react-native';
import {color, spacing} from '../../theme';
import {Text} from '../text';

const ROOT = {
  flexDirection: 'row',
  paddingVertical: spacing[1] - 1,
  alignSelf: 'flex-start',
};

const ICON = {
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  width: 13,
  aspectRatio: 1,
  height: 15,
};

const DIMENSIONS = {width: 18, height: 18};

const OUTLINE = {
  ...DIMENSIONS,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: color.palette.light_grey,
  borderRadius: 2,
};

const FILL = {
  width: DIMENSIONS.width,
  height: DIMENSIONS.height,
  backgroundColor: color.palette.btnColor,
  borderRadius: 2,
};

const LABEL = {paddingLeft: spacing[2] - 1};
/**
 * style - Additional container style. Useful for margins.
 *
 * outlineStyle - Additional outline style.
 *
 * fillStyle - Additional fill style. Only visible when checked.
 *
 * value - Boolean -  Is the checkbox checked
 *
 * text - The text to display
 *
 * onToggle - (newValue) => void - Fires when the user tabs to change the value.
 *
 * multiline - Multiline or clipped single line
 */
export function Checkbox(props) {
  const numberOfLines = props.multiline ? 0 : 1;

  const rootStyle = mergeAll(flatten([ROOT, props.style]));
  const outlineStyle = mergeAll(flatten([OUTLINE, props.outlineStyle]));
  const fillStyle = mergeAll(flatten([FILL, props.fillStyle]));

  const onPress = () => {
    props?.onToggle(!props.value);
  };
  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
        onPress();
      }}
      style={rootStyle}>
      <View style={outlineStyle}>
        {props.value && (
          <>
            <View style={fillStyle} />
            {/* <Image
              source={require('../../assets/icon/check_mark.png')}
              resizeMode="contain"
              style={[ICON, {tintColor: color.palette.white}]}
            /> */}
          </>
        )}
      </View>

      <Text
        text={props.text}
        numberOfLines={numberOfLines}
        style={[LABEL, props.labelStyle]}
      />
    </Pressable>
  );
}
