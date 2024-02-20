import * as React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isNil} from 'ramda';
import {FontSize, color, typography} from '../../theme';
import {Text} from '../../ui-kit';

const isIos = Platform.OS === 'ios';

/**
 * All screen keyboard offsets.
 */
const offsets = {
  none: 0,
};

/**
 * All the variations of screens.
 */
const variants = {
  /**
   * No scrolling. Suitable for full-screen carousels and components
   * which have built-in scrolling like FlatList.
   */
  fixed: {
    outer: {
      backgroundColor: color.palette.white,
      flex: 1,
      height: '100%',
    },
    inner: {
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      height: '100%',
      width: '100%',
    },
  },

  /**
   * Scrolls. Suitable for forms or other things requiring a keyboard.
   * Pick this one if you don't know which one you want yet.
   */
  scroll: {
    outer: {
      backgroundColor: color.palette.white,
      flexGrow: 1,
      height: '100%',
    },
    inner: {justifyContent: 'flex-start', alignItems: 'stretch', flexGrow: 1},
  },
};

function isNonScrolling(variant) {
  return (
    isNil(variant) ||
    !variant.length ||
    isNil(variants[variant]) ||
    variant === 'fixed'
  );
}

function getInsetStyle(unsafe, insets, withOutHeader, withBottomTabs) {
  return {
    paddingTop: unsafe ? 0 : withOutHeader ? insets.top : 0,
    paddingLeft: unsafe ? 0 : insets.left,
    paddingRight: unsafe ? 0 : insets.right,
    paddingBottom: unsafe ? 0 : withBottomTabs ? 0 : insets.bottom,
  };
}

function ScreenWithoutScrolling(props) {
  const insets = useSafeAreaInsets();
  const variant = variants.fixed;
  const style = props.style || {};
  const backgroundStyle = props.backgroundColor
    ? {backgroundColor: props.backgroundColor}
    : {};
  const insetStyle = getInsetStyle(
    props.unsafe,
    insets,
    props.withOutHeader,
    props.withBottomTabs,
  );

  return (
    <KeyboardAvoidingView
      onStartShouldSetResponder={() => {
        if (!props.donNotHideKeyboard) {
          Keyboard.dismiss();
        }
      }}
      style={[variant.outer, backgroundStyle]}
      behavior={isIos ? 'padding' : null}
      keyboardVerticalOffset={offsets[props.keyboardOffset || 'none']}>
      {/* <StatusBar barStyle={props.statusBar || 'light-content'} /> */}
      <View style={[variant.inner, style, insetStyle]}>{props.children}</View>
    </KeyboardAvoidingView>
  );
}

function ScreenWithScrolling(props) {
  const ref = React.useRef(null);
  const [showTopButton, setShowTopButton] = React.useState(false);
  const insets = useSafeAreaInsets();
  const variant = variants.scroll;
  const style = props.style || {};
  const backgroundStyle = props.backgroundColor
    ? {backgroundColor: props.backgroundColor}
    : {};
  const insetStyle = getInsetStyle(
    props.unsafe,
    insets,
    props.withOutHeader,
    props.withBottomTabs,
  );

  const goToTop = () => {
    ref.current.scrollTo({y: 0});
    setShowTopButton(false);
  };

  const handleScroll = event => {
    if (event.nativeEvent.contentOffset.y > 600) {
      setShowTopButton(true);
    } else {
      setShowTopButton(false);
    }
  };

  return (
    <KeyboardAvoidingView
      onStartShouldSetResponder={() => {
        if (!props.donNotHideKeyboard) {
          Keyboard.dismiss();
        }
      }}
      style={[variant.outer, backgroundStyle]}
      behavior={isIos ? 'padding' : null}
      keyboardVerticalOffset={offsets[props.keyboardOffset || 'none']}>
      {/* <StatusBar barStyle={props.statusBar || 'light-content'} /> */}
      <View style={[variant.outer, backgroundStyle, insetStyle]}>
        <ScrollView
          ref={ref}
          onScroll={handleScroll}
          scrollEventThrottle={160}
          bounces={false}
          style={[variant.outer, backgroundStyle]}
          keyboardShouldPersistTaps={'always'}
          nestedScrollEnabled
          contentContainerStyle={[variant.inner, style]}>
          {props.children}
        </ScrollView>
        {/* {showTopButton ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={goToTop}>
              <Image
                source={require('../../assets/icons/up-arrow.png')}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Back to top</Text>
            </TouchableOpacity>
          </View>
        ) : null} */}
      </View>
    </KeyboardAvoidingView>
  );
}

/**
 * The starting component on every screen in the app.
 *
 * variant - fixed | scroll (One of the different types of variants)
 *
 * children - Children components.
 *
 * style - An optional style override useful for padding & margin.
 *
 * backgroundColor - An optional background color
 *
 * statusBar "light-content" | "dark-content" - An optional status bar setting. Defaults to light-content.
 *
 * keyboardOffset - By how much should we offset the keyboard, Defaults to none
 *
 * unsafe - Should we not wrap in SafeAreaView, Defaults to false.
 */
export function Screen(props) {
  if (isNonScrolling(props.variant)) {
    return <ScreenWithoutScrolling {...props} />;
  } else {
    return <ScreenWithScrolling {...props} />;
  }
}

const styles = StyleSheet.create({
  buttonContainer: {position: 'absolute', top: 28, alignSelf: 'center'},
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.palette.twilightBlue,
  },
  buttonIcon: {tintColor: color.palette.white},
  buttonText: {
    color: color.palette.white,
    fontFamily: typography.primary,
    fontSize: FontSize.font_medium_E,
    textAlign: 'center',
  },
});
