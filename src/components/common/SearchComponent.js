import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FontSize, color, typography} from '../../theme';

export const SearchComponent = ({
  text,
  setText,
  placeholder,
  handleClose = () => {},
  handleSearch = () => {},
}) => {
  return (
    <View style={[styles.searchContainer]}>
      <View style={styles.innerRow}>
        <Image
          source={require('../../assets/icon/Search_alt.png')}
          style={styles.insideIcon}
        />
        <TextInput
          value={text}
          //   autoFocus={Platform.OS === 'ios' ? false : true}
          autoFocus={false}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          onChangeText={val => {
            setText(val);
            handleSearch(val);
          }}
          placeholder={placeholder}
          placeholderTextColor={color.palette.grey}
          returnKeyType="go"
          returnKeyLabel="Search"
        />
      </View>
      {text?.length > 0 ? (
        <TouchableOpacity
          hitSlop={{top: 8, left: 8, bottom: 8, right: 8}}
          style={styles.crossIcon}
          onPress={() => {
            setText(null);
            handleClose();
          }}>
          <Image
            source={require('../../assets/icon/b_close.png')}
            style={styles.cancel}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 11,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: color.palette.white,
  },
  innerRow: {
    flexDirection: 'row',
  },
  searchContainer: {
    paddingHorizontal: 10,
    height: 35,

    flexDirection: 'row',
    flex: 0.9,
    justifyContent: 'space-between',
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    marginLeft: 12,
  },

  input: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_extra_medium_E,
    lineHeight: 15,
    height: 40,
    width: '80%',
    color: color.palette.black,
  },
  insideIcon: {height: 30, width: 30, alignSelf: 'center', marginRight: 5},
  crossIcon: {
    justifyContent: 'center',
  },
  searchCancel: {
    width: '20%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cancel: {
    height: 18,
    width: 18,
    alignSelf: 'center',
  },
  rowView: {
    flexDirection: 'row',
  },
  icon: {
    height: 24,
    width: 24,
    marginRight: 15,
    alignSelf: 'center',
  },
  images: {
    height: 33,
    width: 50,
    marginRight: 10,
  },

  circle: {
    height: 20,
    width: 20,
    borderWidth: 0.5,
    borderRadius: 10,
    marginRight: 15,
    alignSelf: 'center',
  },
});
