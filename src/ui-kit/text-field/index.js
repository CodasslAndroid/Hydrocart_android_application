// /* eslint-disable react-native/no-inline-styles */
// import React from 'react';
// import {
//   View,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Platform,
//   InputAccessoryView,
//   Keyboard,
//   Button,
// } from 'react-native';
// import {color, spacing, typography} from '../../theme';
// import {Text} from '../text';
// import {mergeAll, flatten} from 'ramda';
// import {Loader} from '..';
// import {useSelector} from 'react-redux';
// import Timer from '../../utils/timer';

// // the base styling for the container
// const CONTAINER = {height: 85};

// // the base styling for the TextInput
// const INPUT = {
//   fontFamily: typography.primary,
//   color: color.palette.black,
//   //   height: 46,
//   // minHeight: 6,
//   fontSize: FontSize.font_extra_medium_E,
//   //   backgroundColor: color.palette.textFeildBg,

//   paddingLeft: 11,
//   paddingRight: 40,
//   flexDirection: 'row',
//   flex: 1,
//   paddingVertical: 0,
//   borderRadius: 6,
//   //   alignItems: 'center',
// };

// // Currently no variations
// const VARIATIONS = {
//   bordered: {
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: color.palette.hairLineColor,
//   },
//   underline: {
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: color.palette.hairLineColor,
//   },
//   danger: {
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: 'red',
//     borderRadius: 4,
//   },
//   disabled: {
//     // borderWidth: StyleSheet.hairlineWidth,
//     borderColor: color.palette.hairLineColor,
//     borderRadius: 10,
//     backgroundColor: color.palette.switchBackgroundColor,
//   },
// };

// const LABEL = {
//   marginBottom: 11,
//   fontSize: FontSize.font_extra_medium_E,
//   color: color.palette.labelColor,
//   lineHeight: 16.94,
//   fontFamily: typography.primary,
//   // marginRight: 10,
//   //   fontWeight: '500',
// };

// const ERROR = {
//   borderColor: color.palette.red,
// };

// const RIGHT_CONTAINER = {
//   height: '100%',
//   aspectRatio: 0.5,
//   justifyContent: 'center',
//   position: 'absolute',
//   right: 5,
//   alignItems: 'center',
//   top: Platform?.OS === 'android' ? 0 : 5,
// };

// const ICON = {
//   width: 18,
//   height: 15,
//   marginLeft: 7,
//   tintColor: '#A3A0A0',
// };

// const ERROR_CONTAINER = {
//   //   marginTop: 0.5,
//   fontSize:  FontSize.font_small_E,
//   fontFamily: typography.primary,
// };

// const RIGHT_PADDING = {
//   paddingRight: spacing[4],
// };

// const borderError = {
//   //   position: 'absolute',
//   //   bottom: Platform?.OS === 'ios' ? -24 : -20,
//   bottom: -4,
// };

// const enhance = (style, styleOverride) => {
//   return mergeAll(flatten([style, styleOverride]));
// };

// /**
//  * A component which has a label and an input together.
//  *
//  * placeholder - The Placeholder text if no placeholder is provided.
//  *
//  * label - The label text
//  *
//  * style - Optional container style overrides useful for margins & padding.
//  *
//  * inputStyle - Optional style overrides for the input.
//  *
//  * variant - (bordered | underline)
//  *
//  * labelStyle - Optional style overrides for the label.
//  *
//  * errorMessage - Error message to display at the bottom of the text field
//  *                This will automatically change the color of border or underline to red
//  *
//  * icon - Right icon on text input
//  *
//  * onIconPress - Callback to call on right icon
//  *
//  * required - This wil put red start at the label and make the field required to fill
//  *
//  * forwardedRef
//  */
// export function TextField(props) {
//   const {
//     placeholder,
//     variant = 'bordered',
//     style: styleOverride,
//     inputStyle: inputStyleOverride,
//     iconStyle: iconStyleOverride,
//     errorStyle: errorStyleOver,
//     containerStyle: containerStyleOverride,
//     forwardedRef,
//     errorMessage,
//     onIconPress = () => {},
//     icon,
//     label,
//     disabled,
//     labelStyle: labelStyleOverride,
//     required,
//     loading,
//     lftSymbol,
//     lftSymbol_Style,
//     autoCompleteOff = true,
//     greenTick,
//     checkVerify,
//     v_title,
//     v_press,
//     v_load,
//     adjust,
//     timer,
//     interval,
//     setTimer,
//     errorStyleHeight,
//     handleFocus = () => {},
//     ...rest
//   } = props;

//   let errorStyleOverride = errorMessage ? ERROR : {};

//   let containerStyle = enhance(CONTAINER, containerStyleOverride);

//   let inputStyle = enhance(
//     {...INPUT, ...VARIATIONS[variant]},
//     inputStyleOverride,
//   );

//   inputStyle = enhance(inputStyle, errorStyleOverride);

//   let iconStyle = enhance(ICON, iconStyleOverride);

//   let labelStyle = enhance(LABEL, labelStyleOverride);

//   let errorStyle =
//     variant === 'bordered'
//       ? enhance(ERROR_CONTAINER, borderError, errorStyleOver)
//       : enhance(ERROR_CONTAINER, errorStyleOver);

//   let isRightPaddingRequired = icon || loading;

//   const inputAccessoryViewID = 'uniqueID';
//   const user = useSelector(state => state?.auth);
//   return (
//     // <TouchableOpacity
//     //   onPress={() => {
//     //     console.log('enry');
//     //     onPress();
//     //   }}>
//     <View
//       style={
//         errorMessage
//           ? [containerStyle, {borderRadius: 6, height: 97}, errorStyleHeight]
//           : [containerStyle, {borderRadius: 6}]
//       }>
//       {label && (
//         <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//           <View style={{flexDirection: 'row'}}>
//             <Text
//               variant={'fieldLabel'}
//               style={[
//                 labelStyle,
//                 {lineHeight: Platform?.OS === 'ios' ? 0 : 25.14},
//               ]}
//               numberOfLines={1}>
//               {label}
//             </Text>

//             {required && label && (
//               <>
//                 <Text variant={'fieldError'} style={[adjust]}>
//                   *
//                 </Text>
//               </>
//             )}
//           </View>

//           {timer ? (
//             <Timer
//               timer={`0${interval}`}
//               // timer={'0.59'}
//               title={'Resend OTP in '}
//               setShowTimer={setTimer}
//             />
//           ) : (
//             <>
//               {checkVerify ? (
//                 <View style={[styles.verify]}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       v_press();
//                     }}
//                     hitSlop={{top: 20, bottom: 20, right: 20, left: 20}}>
//                     {v_load ? (
//                       <Loader loaderStyle={{paddingBottom: 0}} />
//                     ) : (
//                       <>
//                         <Text style={styles.v_text}>{v_title}</Text>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               ) : null}
//             </>
//           )}
//         </View>
//       )}

//       <View style={{flexDirection: 'row', flex: 1}}>
//         <View style={{flex: 1}}>
//           <TextInput
//             placeholder={placeholder}
//             placeholderTextColor={color.palette.textGrey}
//             underlineColorAndroid={color.transparent}
//             {...rest}
//             editable={!disabled}
//             style={[inputStyle, !isRightPaddingRequired && RIGHT_PADDING]}
//             ref={forwardedRef}
//             autoCorrect={false}
//             allowFontScaling={false}
//             onFocus={() => {
//               handleFocus();
//             }}
//             cursorColor={color.palette.btnColor}
//             {...(autoCompleteOff && {autoCompleteType: 'off'})}
//             inputAccessoryViewID={inputAccessoryViewID}
//           />
//           {Platform.OS === 'ios' && (
//             <>
//               <InputAccessoryView
//                 nativeID={inputAccessoryViewID}
//                 backgroundColor={color.palette.borderColor}>
//                 <View
//                   style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
//                   <Button
//                     onPress={() => Keyboard.dismiss()}
//                     title="Done"
//                     style={{
//                       justifyContent: 'flex-end',
//                       alignContent: 'flex-end',
//                       alignItems: 'center',
//                       alignSelf: 'flex-end',
//                     }}
//                   />
//                 </View>
//               </InputAccessoryView>
//             </>
//           )}
//         </View>
//       </View>
//       {!loading ? (
//         icon && (
//           <TouchableOpacity
//             style={
//               !!errorMessage ? [RIGHT_CONTAINER, {top: -7}] : RIGHT_CONTAINER
//             }
//             activeOpacity={0.8}
//             hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
//             onPress={onIconPress}>
//             <Image source={icon} style={iconStyle} resizeMode={'contain'} />
//           </TouchableOpacity>
//         )
//       ) : (
//         <View style={RIGHT_CONTAINER}>
//           <ActivityIndicator color={color.primary} size={'small'} />
//         </View>
//       )}

//       {!!errorMessage && (
//         <Text variant="fieldError" style={errorStyle}>
//           {errorMessage.includes('server') || errorMessage.includes('undefined')
//             ? null
//             : errorMessage}
//         </Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   check: {
//     height: 12,
//     width: 12,
//     marginTop: 5,
//     marginLeft: 5,
//   },
//   verify: {
//     marginLeft: 5,
//     // backgroundColor: color.palette.brown,
//     height: 23,
//     paddingHorizontal: 7,
//     paddingVertical: 3,
//     borderRadius: 10,
//   },
//   v_text: {
//     fontFamily: typography.secondary,
//     fontSize:  FontSize.font_medium_E,
//     // lineHeight: 22.08,
//     color: '#7F8487',
//     textDecorationLine: 'underline',
//   },
//   ruba_Style: {
//     marginTop: Platform.OS === 'ios' ? 5 : 6,
//     fontSize: FontSize.font_extra_medium_E,
//     top: -4,
//     fontFamily: typography.secondary,
//   },
// });

/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Platform,
  InputAccessoryView,
  Keyboard,
  Button,
} from 'react-native';
import {FontSize, color, spacing, typography} from '../../theme';
import {Text} from '../text';
import {mergeAll, flatten} from 'ramda';
import {Loader} from '..';
import {useSelector} from 'react-redux';

// the base styling for the container
const CONTAINER = {height: 60};

// the base styling for the TextInput
const INPUT = {
  fontFamily: typography.primary,
  color: color.palette.black,
  minHeight: 38,
  // minHeight: 6,
  fontSize: FontSize.font_extra_medium_E,
  backgroundColor: color.palette.white,

  paddingLeft: 11,
  paddingRight: 40,
  flexDirection: 'row',
  flex: 1,

  paddingVertical: 0,
};

// Currently no variations
const VARIATIONS = {
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.palette.hairLineColor,
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
    // borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.palette.hairLineColor,
    borderRadius: 10,
    backgroundColor: color.palette.switchBackgroundColor,
  },
};

const LABEL = {
  //   marginBottom: 12,
  fontSize: FontSize.font_medium_E,
  color: color.palette.labelColor,
  //   lineHeight: 20.11,
  // marginRight: 10,
};

const ERROR = {
  borderColor: color.palette.red,
};

const RIGHT_CONTAINER = {
  height: '100%',
  aspectRatio: 0.5,
  justifyContent: 'center',
  position: 'absolute',
  right: 5,
  alignItems: 'center',
  top: Platform?.OS === 'android' ? 0 : 5,
};

const ICON = {
  width: 15,
  height: 15,
  marginLeft: 7,
};

const ERROR_CONTAINER = {
  marginTop: 0.5,
  fontSize: FontSize.font_very_small_E,
};

const RIGHT_PADDING = {
  paddingRight: spacing[4],
};

const borderError = {
  position: 'absolute',
  bottom: Platform?.OS === 'ios' ? -22 : -18,
};

const enhance = (style, styleOverride) => {
  return mergeAll(flatten([style, styleOverride]));
};

/**
 * A component which has a label and an input together.
 *
 * placeholder - The Placeholder text if no placeholder is provided.
 *
 * label - The label text
 *
 * style - Optional container style overrides useful for margins & padding.
 *
 * inputStyle - Optional style overrides for the input.
 *
 * variant - (bordered | underline)
 *
 * labelStyle - Optional style overrides for the label.
 *
 * errorMessage - Error message to display at the bottom of the text field
 *                This will automatically change the color of border or underline to red
 *
 * icon - Right icon on text input
 *
 * onIconPress - Callback to call on right icon
 *
 * required - This wil put red start at the label and make the field required to fill
 *
 * forwardedRef
 */
export function TextField(props) {
  const {
    placeholder,
    variant = 'bordered',
    style: styleOverride,
    inputStyle: inputStyleOverride,
    iconStyle: iconStyleOverride,
    errorStyle: errorStyleOver,
    containerStyle: containerStyleOverride,
    forwardedRef,
    errorMessage,
    onIconPress = () => {},
    icon,
    label,
    disabled,
    labelStyle: labelStyleOverride,
    required,
    loading,
    lftSymbol,
    lftSymbol_Style,
    autoCompleteOff = true,
    greenTick,
    checkVerify,
    v_title,
    v_press = () => {},
    v_load,
    adjust,

    ...rest
  } = props;

  let errorStyleOverride = errorMessage ? ERROR : {};

  let containerStyle = enhance(CONTAINER, containerStyleOverride);

  let inputStyle = enhance(
    {...INPUT, ...VARIATIONS[variant]},
    inputStyleOverride,
  );

  inputStyle = enhance(inputStyle, errorStyleOverride);

  let iconStyle = enhance(ICON, iconStyleOverride);

  let labelStyle = enhance(LABEL, labelStyleOverride);

  let errorStyle =
    variant === 'bordered'
      ? enhance(ERROR_CONTAINER, borderError, errorStyleOver)
      : enhance(ERROR_CONTAINER, errorStyleOver);

  let isRightPaddingRequired = icon || loading;

  const inputAccessoryViewID = 'uniqueID';
  const user = useSelector(state => state?.auth);
  return (
    // <TouchableOpacity
    //   onPress={() => {
    //     console.log('enry');
    //     onPress();
    //   }}>
    <View style={[containerStyle]}>
      {label && (
        <View style={{flexDirection: 'row'}}>
          <Text
            variant={'fieldLabel'}
            style={[
              labelStyle,
              {lineHeight: Platform?.OS === 'ios' ? 0 : 25.14},
            ]}
            numberOfLines={1}>
            {label}
          </Text>

          {/* {required && label && (
            <>
              <Text variant={'fieldError'} style={[adjust]}>
                *
              </Text>
            </>
          )} */}
          {/* {greenTick && (
            <Image
              source={require('../../assets/icon/greenCheck.png')}
              style={styles.check}
            />
          )} */}
          {checkVerify && (
            <View
              style={
                // v_load
                //   ? [styles.verify, {backgroundColor: color.palette.white}]
                styles.verify
              }>
              <TouchableOpacity
                onPress={() => {
                  v_press();
                }}
                hitSlop={{top: 20, bottom: 20, right: 20, left: 20}}>
                {/* {v_load ? (
                  <Loader loaderStyle={{paddingBottom: 0}} />
                ) : ( */}
                <Text style={styles.v_text}>{v_title}</Text>
                {/* )} */}
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={{flexDirection: 'row', flex: 1}}>
        {lftSymbol && (
          <Text style={[styles.ruba_Style, lftSymbol_Style]}>+91</Text>
        )}
        <View style={{flex: 1}}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={color.palette.warmGrey}
            underlineColorAndroid={color.transparent}
            {...rest}
            editable={!disabled}
            style={[inputStyle, !isRightPaddingRequired && RIGHT_PADDING]}
            ref={forwardedRef}
            autoCorrect={false}
            allowFontScaling={false}
            // onFocus={() => {
            //   onPress();
            // }}
            {...(autoCompleteOff && {autoCompleteType: 'off'})}
            inputAccessoryViewID={inputAccessoryViewID}
          />
          {Platform.OS === 'ios' && (
            <>
              <InputAccessoryView
                nativeID={inputAccessoryViewID}
                backgroundColor={color.palette.borderColor}>
                <View
                  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <Button
                    onPress={() => Keyboard.dismiss()}
                    title="Done"
                    style={{
                      justifyContent: 'flex-end',
                      alignContent: 'flex-end',
                      alignItems: 'center',
                      alignSelf: 'flex-end',
                    }}
                  />
                </View>
              </InputAccessoryView>
            </>
          )}
        </View>
      </View>
      {!loading ? (
        icon && (
          <TouchableOpacity
            style={RIGHT_CONTAINER}
            activeOpacity={0.8}
            hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
            onPress={onIconPress}>
            <Image source={icon} style={iconStyle} resizeMode={'contain'} />
          </TouchableOpacity>
        )
      ) : (
        <View style={RIGHT_CONTAINER}>
          <ActivityIndicator color={color.primary} size={'small'} />
        </View>
      )}

      {!!errorMessage && (
        <Text variant="fieldError" style={errorStyle}>
          {errorMessage.includes('server') || errorMessage.includes('undefined')
            ? null
            : errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  check: {
    height: 12,
    width: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  verify: {
    marginLeft: 5,
    // backgroundColor: color.palette.red,
    height: 23,
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  v_text: {
    fontFamily: typography.medium,
    fontSize: FontSize.font_small_E,
    lineHeight: 15.08,
    color: color.palette.btnColor,
    textAlign: 'right',
    marginRight: 15,
  },
  ruba_Style: {
    marginTop: Platform.OS === 'ios' ? 5 : 6,
    fontSize: FontSize.font_medium_E,
    top: 2,
    fontFamily: typography.primary,
    position: 'absolute',
    left: 14,
    zIndex: 3,
  },
});
