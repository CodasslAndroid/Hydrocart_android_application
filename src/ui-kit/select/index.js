/* eslint-disable react-native/no-inline-styles */
import {flatten, mergeAll} from 'ramda';
import React, {useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {FontSize, color, spacing, typography} from '../../theme';
import {Loader} from '../loader';
import {Text} from '../text';

const INPUT = {
  backgroundColor: color.palette.white,
  paddingHorizontal: spacing[3],
  flex: 1,
  justifyContent: 'center',
  alignItems: 'flex-start',
  //   height: 42,
};

const LABEL = {
  // marginBottom: 12,
  fontSize: FontSize.font_extra_medium_E,
  color: color.palette.labelColor,
  //   lineHeight: 16.94,
  //   fontWeight: '600',
  fontFamily: typography.primary,
};

const DISABLE = {
  backgroundColor: color.palette.borderLine1,
};

const VARIATIONS = {
  bordered: {
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: 1,
    borderColor: color.palette.borderLine,
    borderRadius: 4,
  },
  underline: {
    // borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.palette.hairLineColor,
  },
  danger: {
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 4,
  },
  disabled: {
    // borderWidth: 1
    //borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.palette.hairLineColor,
    borderRadius: 10,
    backgroundColor: color.palette.borderLine1,
  },
};

const ERROR = {
  borderColor: color.palette.red,
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
  // marginLeft: 20,
};

const PLACEHOLDER = {
  fontSize: FontSize.font_medium_E,
  // lineHeight: 17,
  letterSpacing: -0.14,
  fontFamily: typography.primary,
  color: color.palette.textGrey,
  top: -3,
  // backgroundColor: 'red',
  padding: 5,
};

const TEXTSTYLE = {
  lineHeight: 17,
  letterSpacing: -0.14,
  fontFamily: typography.primary,
  color: color.palette.black,
  fontSize: FontSize.font_medium_E,
};

const ERROR_CONTAINER = {
  //   marginTop: 0.5,
  fontSize: FontSize.font_small_E,
  fontFamily: typography.primary,
};

const borderError = {
  //   position: 'absolute',
  //   bottom: Platform?.OS === 'ios' ? -24 : -20,
  bottom: -4,
};

const enhance = (style, styleOverride) => {
  return mergeAll(flatten([style, styleOverride]));
};

export function Select(props) {
  const {
    placeholder,
    value,
    options,
    textStyle: textOverride,
    inputStyle: inputStyleOverride,
    iconStyle: iconStyleOverride,
    placeholderStyle: placeholderStyleOverride,
    loading,
    onIconPress = () => {},
    onPress = () => {},
    icon,
    required,
    variant = 'bordered',
    label = ' ',
    disable = false,
    labelStyle: labelStyleOverride,
    style: styleOverride,
    source,
    errorMessage,
    errorStyle: errorStyleOver,
    noRecordTitle = 'No Record Found',
    option_name = null,
  } = props;

  let errorStyleOverride = errorMessage ? ERROR : {};

  let inputStyle = enhance({...INPUT, ...VARIATIONS[variant]});

  inputStyle = enhance(inputStyle, inputStyleOverride);

  inputStyle = disable ? enhance(inputStyle, DISABLE) : inputStyle;
  inputStyle = enhance(inputStyle, errorStyleOverride);

  let textStyle = enhance(TEXTSTYLE, textOverride);
  //   inputStyle = enhance(inputStyle, errorStyleOverride);

  let iconStyle = enhance(ICON, iconStyleOverride);

  let placeholderStyle = enhance(PLACEHOLDER, placeholderStyleOverride);

  let labelStyle = enhance(LABEL, labelStyleOverride);
  const [showDownPage, setShowDownPage] = useState(false);

  const handleSelect = () => {
    setShowDownPage(showDownPage => !showDownPage);
  };

  let errorStyle =
    variant === 'bordered'
      ? enhance(ERROR_CONTAINER, borderError, errorStyleOver)
      : enhance(ERROR_CONTAINER, errorStyleOver);

  return (
    <>
      <View
      // style={{backgroundColor: 'red'}}
      >
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
        <Pressable
          style={[
            inputStyle,
            styles.container,
            // {backgroundColor: 'red'}
          ]}
          onPress={() => {
            if (!disable) {
              handleSelect();
            }
          }}>
          <Text
            numberOfLines={1}
            style={
              value === null || value === '' || value === '/'
                ? placeholderStyle
                : textStyle
            }>
            {value === null || value === '' || value === '/'
              ? placeholder
              : value}
          </Text>

          <Image
            source={require('../../assets/icon/dropArrow.png')}
            style={iconStyle}
            resizeMode={'contain'}
          />
        </Pressable>
        {!!errorMessage && (
          <Text variant="fieldError" style={errorStyle}>
            {errorMessage.includes('server') ||
            errorMessage.includes('undefined')
              ? null
              : errorMessage}
          </Text>
        )}
        {showDownPage ? (
          <Modal
            transparent={true}
            visible={showDownPage}
            animationType="fade"
            style={{backgroundColor: 'red', alignSelf: 'center'}}>
            {/* {!loading ? ( */}
            <Pressable
              onPress={() => {
                setShowDownPage(false);
              }}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
              }}>
              <>
                {!loading ? (
                  <>
                    {options?.length ? (
                      <View
                        style={
                          source === 'marketTradeFilter'
                            ? [styles.dropDownView, styleOverride]
                            : [
                                styles.dropDownView,
                                styleOverride,
                                {
                                  marginVertical:
                                    Platform.OS === 'ios' ? 30 : 0,
                                },
                              ]
                        }>
                        <ScrollView>
                          {options?.map((item, index) => {
                            return (
                              <Pressable
                                onPress={() => {
                                  onPress(item, index);
                                  setShowDownPage(false);
                                }}
                                key={'^' + index?.toString()}>
                                <Text
                                  style={
                                    index % 2 !== 0
                                      ? [
                                          styles.overideStyle,
                                          {
                                            backgroundColor:
                                              color.palette.white,
                                          },
                                        ]
                                      : [
                                          styles.overideStyle,
                                          {
                                            backgroundColor:
                                              color.palette.fadeBrown,
                                            color: color.palette.white,
                                          },
                                        ]
                                  }>
                                  {/* {option_name
                                    ? item[option_name]
                                    : item?.district_name ?? item} */}
                                  {item?.district_name ??
                                    item?.order_status_name ??
                                    item}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </ScrollView>
                      </View>
                    ) : (
                      <View style={styles.dropDownView}>
                        <Text style={styles.noRecord}>{noRecordTitle}</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={[styles.dropDownView, {height: 150}]}>
                    <Loader style={{paddingBottom: 0}} />
                  </View>
                )}
              </>
            </Pressable>
            {/* ) : (
              <View style={[styles.dropDownView]}>
                <Loader style={{marginTop: 20}} />
              </View>
            )} */}
          </Modal>
        ) : null}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // height: 89,
  },
  dropDownView: {
    width: '80%',
    backgroundColor: color.palette.white,
    maxHeight: Dimensions.get('screen').height - 300,

    // shadowColor: '#000',
    // shadowOffset: {width: 1, height: 1},
    // shadowOpacity: 0.4,
    // shadowRadius: 3,
    // borderRadius: 6,
    // elevation: 5,
  },
  paddingPosition: {
    position: 'absolute',
    top: 75,
    zIndex: 2,
  },
  overideStyle: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: color.palette.lightGreen2,
  },
  noRecord: {
    textAlign: 'center',
    marginVertical: 20,
    color: color.palette.red,
    fontSize: FontSize.font_large_E,
    fontFamily: typography.secondary,
  },
});
