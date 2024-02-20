/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Routes} from '../../navigation';
import {FontSize, color, typography} from '../../theme';
import {Vertical} from '../../ui-kit';
import {useSelector} from 'react-redux';

export const PasswordResetSuccess = () => {
  const navigation = useNavigation();
  const lang = useSelector(state => state.auth?.language);

  return (
    <View>
      <Text>Hello</Text>
    </View>
    // <ImageBackground
    //   source={require('../../assets/icon/bg.png')}
    //   style={styles.bg}
    //   resizeMode="stretch">
    //   {/* <Image
    //     source={require('../../assets/icon/logo.png')}
    //     style={{height: 167, width: 167, alignSelf: 'center'}}
    //   /> */}
    //   <Vertical size={25} />
    //   <Text style={styles?.title}>{lang?.PasswordResetRequest}</Text>
    //   <Vertical size={25} />

    //   <View style={styles.box}>
    //     <Image
    //       source={require('../../assets/icon/Checkmark.png')}
    //       style={{height: 25, width: 25, alignSelf: 'center', marginBottom: 20}}
    //     />
    //     <Text style={styles.subTitle}>
    //       {lang?.YourPasswordHasBeenChanged}.{' '}
    //       <Text
    //         onPress={() => {
    //           navigation?.navigate(Routes?.SIGNIN);
    //         }}
    //         style={{
    //           color: color.palette.btnColor,
    //           fontWeight: '700',
    //           textDecorationLine: 'underline',
    //         }}>
    //         {lang?.Login}{' '}
    //       </Text>{' '}
    //       {lang?.WithYourNewPassword}.
    //     </Text>
    //   </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
  },
  title: {
    color: color.palette.blue,
    fontFamily: typography.secondary,
    fontSize: FontSize.font_very_large_E,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_large_E,
    // lineHeight: 18,
    color: color.palette.txtBlack,
    textAlign: 'center',
  },
  box: {
    borderWidth: 1,
    borderColor: color.palette.lightGreen,
    paddingHorizontal: 30,
    marginHorizontal: 48,
    backgroundColor: color.palette.white,
    paddingVertical: 20,
    borderRadius: 6,
  },
});
