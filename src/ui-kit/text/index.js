import * as React from 'react';
import {Text as ReactNativeText} from 'react-native';
import {mergeAll, flatten} from 'ramda';
import {typography, color, FontSize} from '../../theme';

const BASE = {
  fontFamily: typography.primary,
  color: color.palette.black,
  fontSize: FontSize.font_medium_E,
};

const variants = {
  /**
   * The default text styles.
   */
  default: BASE,

  /**
   * A bold version of the default text.
   */
  bold: {...BASE, fontFamily: typography.secondary},

  /**
   * Large headers.
   */
  header: {
    ...BASE,
    fontSize: FontSize.font_large_E,
    fontFamily: typography.secondary,
  },

  /**
   * A smaller piece of secondary information.
   */
  secondary: {
    ...BASE,
    fontSize: FontSize.font_medium_E,
    fontFamily: typography.secondary,
  },

  /**
   * Field labels that appear on forms above the inputs.
   */
  fieldLabel: {...BASE, fontSize: FontSize.font_large_E},

  /**
   * Field error
   */
  fieldError: {
    ...BASE,
    fontSize: FontSize.font_medium_E,
    fontFamily: typography.tertiary,
    color: color.palette.red,
  },

  italic: {
    ...BASE,
    fontSize: FontSize.font_medium_E,
    fontFamily: typography.tertiary,
  },

  success: {
    ...BASE,
    fontSize: FontSize.font_extra_medium_O,
    fontFamily: typography.primary,
    color: color.palette.green,
  },
  /**
   * label related to info
   */
  //   infoLabel: {
  //     ...BASE,
  //     color: color.palette.coolGrey,
  //   },
};

/**
 * variant - default | bold | header | secondary  | fieldValue
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Text(props) {
  // grab the props
  const {
    variant = 'default',
    text,
    children,
    style: styleOverride,
    ...rest
  } = props;

  // figure out which content to use
  const content = text || children;

  const style = mergeAll(
    flatten([variants[variant] || variants.default, styleOverride]),
  );

  return (
    <ReactNativeText {...rest} style={style} allowFontScaling={false}>
      {content}
    </ReactNativeText>
  );
}
