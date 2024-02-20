import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Routes} from '../../navigation';
import {FontSize, color, typography} from '../../theme';
import {Button} from '../../ui-kit';

export const WelcomeScreen = () => {
  const navigation = useNavigation();
  const handleSubmit = () => {
    navigation.navigate(Routes.OUTSIDE_STACK, {screen: Routes.SIGNIN});
  };
  return (
    // <View>
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={'transparent'}
        translucent={true}
      />
      <ImageBackground
        source={require('../../assets/icon/welcomeScreen.png')}
        style={styles.bg}>
        <View style={styles.overlay}>
          <View style={styles.screen}>
            <Text style={styles.title}>Let's get start</Text>
            <Button
              title={'Continue'}
              style={styles.button}
              onPress={handleSubmit}
              //   loading={isSubmitting}
              textStyle={styles.btnTxt}
            />
          </View>
        </View>
      </ImageBackground>
    </>
    // </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  button: {
    marginTop: 3,
    height: 46,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
    // color: color.palette.black,
  },
  btnTxt: {
    fontSize: FontSize.font_extra_medium_O,
    color: color.palette.white,
  },
  screen: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 30,
    marginBottom: 23,
  },
  title: {
    fontFamily: typography.semiBold,
    fontSize: FontSize.font_extra_large_E,
    lineHeight: 30,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    // opacity: 0.5,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
