// /* eslint-disable react-native/no-inline-styles */
// import React from 'react';
// import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
// import {useState} from 'react';
// import DatePicker from 'react-native-date-picker';
// import {mergeAll} from 'ramda';
// import {flatten} from 'lodash';
// import {color, spacing, typography} from '../../theme';
// import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
// import moment from 'moment';

// const INPUT = {
//   backgroundColor: color.palette.white,
//   paddingHorizontal: spacing[3],
//   flex: 1,
//   paddingTop: 5,
//   paddingBottom: 5,
//   justifyContent: 'center',
//   alignItems: 'flex-start',
//   height: 56,
// };

// const LABEL = {
//   marginBottom: 12,
//   fontSize: 16,
//   color: color.palette.black,
//   lineHeight: 20.11,
//   fontWeight: '600',
//   fontFamily: typography.primary,
// };

// const VARIATIONS = {
//   bordered: {
//     // borderWidth: StyleSheet.hairlineWidth,
//     borderWidth: 1,
//     borderColor: color.palette.borderLine,
//     borderRadius: 4,
//   },
//   underline: {
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: color.palette.hairLineColor,
//   },
//   danger: {
//     // borderWidth: StyleSheet.hairlineWidth,
//     borderWidth: 1,
//     borderColor: 'red',
//     borderRadius: 4,
//   },
//   disabled: {
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: color.palette.hairLineColor,
//     borderRadius: 10,
//     backgroundColor: color.palette.disableColor,
//   },
// };

// const ICON_CONTAINER = {
//   height: '100%',
//   aspectRatio: 0.5,
//   justifyContent: 'center',
//   position: 'absolute',
//   right: 5,
//   marginRight: 5,
//   marginLeft: 4,
// };

// const ICON = {
//   width: 15,
//   height: 15,
// };

// const PLACEHOLDER = {
//   fontSize: 14,
//   // lineHeight: 17,
//   letterSpacing: -0.14,
//   fontFamily: typography.primary,
//   color: color.palette.warmGrey,
// };

// const TEXTSTYLE = {
//   lineHeight: 17,
//   letterSpacing: -0.14,
//   fontFamily: typography.primary,
//   color: color.text,
//   fontSize: 14,
// };

// const ERROR = {
//   borderColor: color.palette.red,
// };
// const ERROR_CONTAINER = {
//   marginTop: 0.5,
//   fontSize: 12,
//   color: color.palette.red,
//   fontFamily: typography.primary,
// };

// const enhance = (style, styleOverride) => {
//   return mergeAll(flatten([style, styleOverride]));
// };

// const borderError = {
//   //   position: 'absolute',
//   //   bottom: Platform?.OS === 'ios' ? -24 : -20,
//   bottom: -4,
// };

// export const DatePickers = props => {
//   const {
//     value,
//     inputStyle: inputStyleOverride,
//     iconStyle: iconStyleOverride,
//     onDatePress,
//     index,
//     onPress,
//     open,
//     required,
//     label = '',
//     labelStyle: labelStyleOverride,
//     errorStyle: errorStyle_over,
//     errorMessage,
//     textStyle: textOverride,
//     variant = 'bordered',
//     source,
//     icon,
//     closeIcon,
//     handleClear,
//     miniDate,
//     placeholder,
//     skeleton = false,
//     open_close = false,
//   } = props;

//   // const [stateIndex, setStateIndex] = useState(index);
//   const [date, setDate] = useState(null);
//   const [d_open, setDateOpen] = useState(false);

//   let errorStyleOverride = errorMessage ? ERROR : {};

//   let inputStyle = enhance(
//     {...INPUT, ...VARIATIONS[variant]},
//     inputStyleOverride,
//   );

//   inputStyle = enhance(inputStyle, errorStyleOverride);

//   let textStyle = enhance(TEXTSTYLE, textOverride);
//   //   inputStyle = enhance(inputStyle, errorStyleOverride);

//   let iconStyle = enhance(ICON, iconStyleOverride);

//   let placeholderStyle = PLACEHOLDER;

//   let errorStyle = enhance(ERROR_CONTAINER, borderError, errorStyle_over);

//   let labelStyle = enhance(LABEL, labelStyleOverride);

//   return (
//     <>
//       {!skeleton ? (
//         <View>
//           {label && (
//             <Text variant={'fieldLabel'} style={labelStyle}>
//               {label}
//               {required && label && (
//                 <Text variant={'fieldError'} style={{color: color.palette.red}}>
//                   *
//                 </Text>
//               )}
//             </Text>
//           )}
//           <Pressable
//             style={inputStyle}
//             onPress={() => {
//               onDatePress(true);
//               setDateOpen(true);
//             }}>
//             <DatePicker
//               modal
//               open={d_open}
//               mode="date"
//               date={value ? new Date(value) : new Date()}
//               onConfirm={date => {
//                 setDateOpen(false);
//                 setDate(date);
//                 onPress(date, false, source, index);
//               }}
//               onCancel={() => {
//                 setDateOpen(false);
//                 onPress(value, false);
//               }}
//               minimumDate={miniDate}
//             />
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 width: '100%',
//               }}>
//               <Text
//                 style={{
//                   color: color.palette.black,
//                   fontFamily: typography.primary,
//                   fontSize: 14,
//                   fontWeight: '400',
//                   alignSelf: 'center',
//                 }}>
//                 {value ? (
//                   moment(value).format('DD-MM-YYYY')
//                 ) : (
//                   <Text
//                     style={{
//                       color: color.palette.black,
//                       fontFamily: typography.primary,
//                       fontSize: 14,
//                       fontWeight: '400',
//                       lineHeight: 20,
//                     }}>
//                     {placeholder}
//                   </Text>
//                 )}
//               </Text>
//               {icon && (
//                 // <TouchableOpacity
//                 //   style={ICON_CONTAINER}
//                 //   activeOpacity={0.8}
//                 //   onPress={onIconPress}>
//                 <Image
//                   source={icon}
//                   style={iconStyle}
//                   resizeMode={'contain'}
//                   fadeDuration={600}
//                 />
//                 // </TouchableOpacity>
//               )}
//               {closeIcon ? (
//                 <TouchableOpacity
//                   hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
//                   onPress={() => {
//                     handleClear();
//                   }}>
//                   <Image
//                     source={require('../../assets/icon/b_close.png')}
//                     style={iconStyle}
//                   />
//                 </TouchableOpacity>
//               ) : (
//                 <Image
//                   source={require('../../assets/icon/Date.png')}
//                   style={[iconStyle, {width: 18.75, height: 20.83}]}
//                 />
//               )}
//             </View>
//           </Pressable>
//           {errorMessage ? (
//             <Text variant="fieldError" style={errorStyle}>
//               {errorMessage}
//             </Text>
//           ) : null}
//         </View>
//       ) : (
//         <DatePicker
//           modal
//           open={open_close}
//           mode="date"
//           date={value ? new Date(value) : new Date()}
//           onConfirm={date => {
//             onPress(date, false, source, index);
//           }}
//           onCancel={() => {
//             onPress(value, false);
//           }}
//           minimumDate={miniDate}
//         />
//       )}
//     </>
//   );
// };

/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {mergeAll} from 'ramda';
import {flatten} from 'lodash';
import {FontSize, color, spacing, typography} from '../../theme';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import moment from 'moment';

const INPUT = {
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
  fontSize: FontSize.font_medium_E,
  color: color.palette.textGrey,
  lineHeight: 20.11,
};

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
    borderWidth: StyleSheet.hairlineWidth,
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
  color: color.text,
  fontSize: FontSize.font_medium_E,
};

const ERROR = {
  borderColor: color.palette.red,
};
const ERROR_CONTAINER = {
  marginTop: 0.5,
  fontSize: FontSize.font_small_E,
  color: color.palette.red,
  fontFamily: typography.tertiary,
};

const enhance = (style, styleOverride) => {
  return mergeAll(flatten([style, styleOverride]));
};

export const DatePickers = props => {
  const {
    value,
    inputStyle: inputStyleOverride,
    iconStyle: iconStyleOverride,
    onDatePress,
    index,
    onPress,
    open,
    required,
    label,
    labelStyle: labelStyleOverride,
    errorStyle: errorStyle_over,
    errorMessage,
    textStyle: textOverride,
    variant = 'bordered',
    source,
    icon,
    closeIcon,
    handleClear,
    miniDate,
    maxDate,
  } = props;
  console.log('valuw', value);
  // const [stateIndex, setStateIndex] = useState(index);
  const [press, setPress] = useState(false);
  const [date, setDate] = useState(null);
  const [d_open, setDateOpen] = useState(false);

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

  let errorStyle = enhance(ERROR_CONTAINER, errorStyle_over);

  let labelStyle = enhance(LABEL, labelStyleOverride);

  if (press) {
    onPress(date, false, source, index);
    setPress(false);
  }

  return (
    <>
      <View style={{flex: 1}}>
        {label && (
          <Text variant={'fieldLabel'} style={labelStyle}>
            {label}
            {required && label && (
              <Text
                variant={'fieldError'}
                style={{color: color.palette.danger}}>
                *
              </Text>
            )}
          </Text>
        )}
        <Pressable
          style={inputStyle}
          onPress={() => {
            onDatePress(true);
            setDateOpen(true);
          }}>
          <DatePicker
            modal
            open={d_open}
            mode="date"
            date={value && value !== '' ? new Date(value) : new Date()}
            onConfirm={date => {
              setDateOpen(false);
              setDate(date);
              setPress(true);
            }}
            onCancel={() => {
              setDateOpen(false);
              onPress(value, false);
            }}
            minimumDate={miniDate}
            maximumDate={maxDate}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text
              style={{
                fontFamily: typography.medium,
                color: color.palette.black,
              }}>
              {value ? (
                moment(value).format('DD-MM-YYYY')
              ) : (
                <Text style={{color: color.palette.placeholder}}>
                  Enter your Birthday
                </Text>
              )}
            </Text>
            {icon && (
              // <TouchableOpacity
              //   style={ICON_CONTAINER}
              //   activeOpacity={0.8}
              //   onPress={onIconPress}>
              <Image
                source={icon}
                style={iconStyle}
                resizeMode={'contain'}
                fadeDuration={600}
              />
              // </TouchableOpacity>
            )}
            {/* {closeIcon && (
              <TouchableOpacity
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                onPress={() => {
                  handleClear();
                }}>
                <Image
                  source={require('../../assets/icon/b_close.png')}
                  style={iconStyle}
                />
              </TouchableOpacity>
            )} */}
          </View>
        </Pressable>
        {errorMessage ? (
          <Text variant="fieldError" style={errorStyle}>
            {errorMessage}
          </Text>
        ) : null}
      </View>
    </>
  );
};
