/**
 * The various styles of fonts are defined in the <Text /> component.
 *
 * How to add font
 * Run the command: npx react-native link
 *
 * This will add the fonts in this directory to the native iOS and Android projects.
 *  Ensure the path to this directory at react-native.config.js is correct.
 */
export const typography = {
  /**
   * The primary font.  Used in most places.
   */
  primary: 'Poppins Regular 400',
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: 'Poppins Bold 700',
  semiBold: 'Poppins SemiBold 600',
  medium: 'Poppins Medium 500',
  /**
   * For TextField validation error
   */
  tertiary: 'Lato-Italic',
};
