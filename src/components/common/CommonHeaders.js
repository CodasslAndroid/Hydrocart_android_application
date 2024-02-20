import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {Routes} from '../../navigation';
import {FontSize, color, typography} from '../../theme';
import {Divider} from '../../ui-kit';

export const CommonHeader = ({
  title,
  handleClear = () => {},
  showClear = false,
  settingIcon = false,
  setDelModal,
  screens = null,
}) => {
  const [showDel, setShowDel] = useState(false);
  const navigation = useNavigation();
  return (
    <View style={{height: 55}}>
      <View style={styles.headerView}>
        <View style={styles._innerHeader}>
          <View style={{flexDirection: 'row'}}>
            <Pressable
              onPress={() => {
                if (screens) {
                  navigation.navigate(Routes.HOME);
                } else {
                  navigation.goBack();
                }
              }}>
              <Image
                source={require('../../assets/icon/left.png')}
                style={styles.backArrow}
              />
            </Pressable>
            <Text style={styles.titleTxt}>{title}</Text>
          </View>
          {showClear ? (
            <Text
              onPress={() => {
                handleClear();
              }}
              style={styles.clearAllTxt}>
              Clear All
            </Text>
          ) : null}
          {settingIcon ? (
            <>
              <Pressable
                style={{alignSelf: 'center'}}
                onPress={() => {
                  setShowDel(!showDel);
                }}>
                <Image
                  source={require('../../assets/icon/setting.png')}
                  style={{height: 20, width: 20}}
                />
              </Pressable>
              {showDel ? (
                <Pressable
                  style={styles.viewDel}
                  onPress={() => {
                    setShowDel(false);
                    setDelModal(true);
                  }}>
                  <Image
                    source={require('../../assets/icon/deleteIcon.png')}
                    style={styles.delIcon}
                  />
                  <Text style={styles.delTxt}>Delete your account</Text>
                </Pressable>
              ) : null}
            </>
          ) : null}
        </View>
      </View>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 13,
  },
  backArrow: {height: 24, width: 24},
  clearAllTxt: {
    fontFamily: typography.medium,
    fontSize: FontSize.font_large_E,
    color: color.palette.blue,
  },
  titleTxt: {
    fontFamily: typography.semiBold,
    color: color.palette.black,
    fontSize: FontSize.font_large_E,
    marginLeft: 20,
  },
  _innerHeader: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  delIcon: {width: 15, height: 17, alignSelf: 'center'},
  delTxt: {
    alignSelf: 'center',
    marginLeft: 5,
    color: color.palette.black,
    fontFamily: typography.medium,
    fontSize: FontSize.font_medium_E,
    top: 1.5,
  },
  viewDel: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    bottom: -35,
    backgroundColor: color.palette.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: color.palette.grey,
  },
});
