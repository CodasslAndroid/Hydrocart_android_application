import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CommonHeader, ProfileLoader} from '../../components';
import {Routes} from '../../navigation';
import {authToken, verifiedUserData} from '../../redux/slices/authSlice';
import {getProfile} from '../../services/api';
import {FontSize, color, typography} from '../../theme';
import {Divider, Vertical} from '../../ui-kit';

export const Profile = ({route}) => {
  const {flag} = route?.params ?? {};
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth);
  const [profileLoad, setProfileLoad] = useState(false);
  const [profileData, setProfileData] = useState();
  const [openHelpModal, setOpenHelpModal] = useState(false);

  useEffect(() => {
    setProfileLoad(true);
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    getProfile(payload)
      .then(res => {
        setProfileLoad(false);
        setProfileData(res?.customer_profile[0]);
        console.log('res', res);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [userData?.userData?.customer_ref_no, flag]);

  const profileList = [
    {
      name: 'Manage Address',
      icon: require('../../assets/icon/home.png'),
      imgstyle: {tintColor: color.palette.black, height: 17, width: 20},
      textStyle: {
        color: color.palette.black,
        fontSize: FontSize.font_medium_E,
        fontFamily: typography.primary,
        marginLeft: 10,
      },
      callFunc: () => {
        navigation.navigate(Routes.ADDRESS_LIST);
      },
    },
    {
      name: 'Help & Support',
      icon: require('../../assets/icon/support.png'),
      imgstyle: {height: 17, width: 15},
      textStyle: {
        color: color.palette.black,
        fontSize: FontSize.font_medium_E,
        fontFamily: typography.primary,
        marginLeft: 10,
      },
      callFunc: () => {
        // navigation.navigate(Routes.)
        setOpenHelpModal(true);
      },
    },
    {
      name: 'Terms & Conditions',
      icon: require('../../assets/icon/terms.png'),
      imgstyle: {height: 20, width: 20},
      textStyle: {
        color: color.palette.black,
        fontSize: FontSize.font_medium_E,
        fontFamily: typography.primary,
        marginLeft: 10,
      },
      callFunc: () => {
        navigation.navigate(Routes.POLICY_PAGE, {
          screen: 'TermsCondition',
          slug: 'terms-condition',
          title: 'Terms & Condition',
        });
      },
    },
    {
      name: 'Privacy Policy',
      icon: require('../../assets/icon/privacy.png'),
      imgstyle: {height: 20, width: 18},
      textStyle: {
        color: color.palette.black,
        fontSize: FontSize.font_medium_E,
        fontFamily: typography.primary,
        marginLeft: 10,
      },
      callFunc: () => {
        navigation.navigate(Routes.POLICY_PAGE, {
          screen: 'PrivacyPolicy',
          slug: 'privacy-policy-1',
          title: 'Privacy Policy',
        });
      },
    },
    {
      name: 'Feedback',
      icon: require('../../assets/icon/help.png'),
      imgstyle: {height: 20, width: 20},
      textStyle: {
        color: color.palette.black,
        fontSize: FontSize.font_medium_E,
        fontFamily: typography.primary,
        marginLeft: 10,
      },
      callFunc: () => {
        navigation.navigate(Routes.FEEDBACK);
      },
    },
    {
      name: 'About Us',
      icon: require('../../assets/icon/about.png'),
      imgstyle: {height: 20, width: 20},
      textStyle: {
        color: color.palette.black,
        fontSize: FontSize.font_medium_E,
        fontFamily: typography.primary,
        marginLeft: 10,
      },
      callFunc: () => {
        navigation.navigate(Routes.POLICY_PAGE, {
          screen: 'Aboutus',
          slug: 'about-us-1',
          title: 'About us',
        });
      },
    },
    {
      name: 'Log Out',
      icon: require('../../assets/icon/logout.png'),
      imgstyle: {height: 20, width: 20},
      textStyle: {
        color: color.palette.black,
        fontSize: FontSize.font_medium_E,
        fontFamily: typography.primary,
        marginLeft: 10,
      },
      callFunc: () => {
        Alert.alert(
          'Sign out',

          'Are You sure you want to Sign Out ?',
          [
            {
              text: 'No',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                await AsyncStorage.removeItem('userData');
                dispatch(authToken(null));
                dispatch(verifiedUserData(null));
              },
            },
          ],
        );
      },
    },
  ];
  return (
    <View style={{flex: 1, backgroundColor: color.palette.backgroundGrey}}>
      <CommonHeader title={'Manage Account'} />
      {!profileLoad ? (
        <View style={styles.profileHeaderView}>
          <View style={styles.innerView}>
            <Image
              source={
                profileData?.customer_profile_image
                  ? {
                      uri: `${
                        profileData?.customer_profile_image
                      }?${new Date()}`,
                    }
                  : require('../../assets/icon/profileIcon.png')
              }
              style={{height: 70, width: 70, borderRadius: 70}}
            />
            <View style={{alignSelf: 'center', marginLeft: 15}}>
              <Text style={styles.txt}>{profileData?.customer_first_name}</Text>
              <Text
                style={[
                  styles.txt,
                  {
                    fontSize: FontSize.font_medium_E,
                    fontFamily: typography.primary,
                  },
                ]}>
                +91 {profileData?.customer_mobile_no}
              </Text>
            </View>
          </View>
          <Pressable
            style={{alignSelf: 'center'}}
            onPress={() => {
              navigation.navigate(Routes.EDITPROFILE);
            }}>
            <Image
              source={require('../../assets/icon/edit1.png')}
              style={{height: 20, width: 20}}
            />
          </Pressable>
        </View>
      ) : (
        <ProfileLoader />
      )}
      <FlatList
        data={profileList}
        key="["
        keyExtractor={(item, index) => {
          return '[' + index;
        }}
        renderItem={({item, index}) => {
          return (
            <Pressable style={styles.boxView} onPress={item?.callFunc}>
              <Image source={item?.icon} style={item?.imgstyle} />
              <Text style={item?.textStyle}>{item?.name}</Text>
            </Pressable>
          );
        }}
      />
      {openHelpModal ? (
        <Modal
          transparent={true}
          visible={openHelpModal}
          animationType="fade"
          style={{alignSelf: 'center'}}>
          <Pressable
            style={styles.modalSheet}
            onPress={() => {
              setOpenHelpModal(!openHelpModal);
            }}>
            <View style={styles.modalBack}>
              {/* <Pressable
                onPress={() => {
                  setOpenHelpModal(!openHelpModal);
                }}> */}
              <Image
                source={require('../../assets/icon/helpcenter.png')}
                style={styles.modalClose}
              />
              <Text style={styles.bottomHelptxt}>Help & Supoort</Text>
              <Pressable
                style={styles.bottomRowView}
                onPress={() => {
                  Linking.openURL(
                    `tel:${userData?.companyDetail?.company_contact_mobile}`,
                  );
                }}>
                <Image
                  style={styles.bottomViewIcon}
                  source={require('../../assets/icon/phone.png')}
                />
                <Text style={styles.bottomViewText}>Call</Text>
              </Pressable>
              <Divider />
              <Pressable
                style={styles.bottomRowView}
                onPress={() => {
                  Linking.openURL(
                    `mailto:${userData?.companyDetail?.company_contact_email}?subject=Help Desk and Support&body=Welcome to JBL anandabavan sweets & bakery`,
                  );
                }}>
                <Image
                  style={styles.bottomViewIcon}
                  source={require('../../assets/icon/gmail.png')}
                />
                <Text style={styles.bottomViewText}>Email</Text>
              </Pressable>
              <Divider />
              <Vertical size={20} />
              {/* </Pressable> */}
            </View>
          </Pressable>
        </Modal>
      ) : null}
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
  boxView: {
    flexDirection: 'row',
    backgroundColor: color.palette.white,
    marginTop: 15,
    marginHorizontal: 20,
    paddingLeft: 11,
    paddingVertical: 11,
    borderRadius: 5,
  },
  profileHeaderView: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: color.palette.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  txt: {
    fontFamily: typography.semiBold,
    color: color.palette.black,
    fontSize: FontSize.font_double_medium_O,
  },
  innerView: {
    flexDirection: 'row',
  },
  modalSheet: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalBack: {
    backgroundColor: color.palette.white,
    // marginHorizontal: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalClose: {
    height: 44,
    width: 44,
    alignSelf: 'center',
    bottom: 20,
    backgroundColor: color.palette.white,
    borderRadius: 40,
    // marginRight: 10,
    // marginTop: 10,
    // tintColor: color.palette.btnColor,
    // position: 'absolute',
  },
  bottomRowView: {
    // flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
    marginBottom: 5,
    marginTop: 15,
  },
  bottomViewIcon: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  bottomViewText: {
    fontFamily: typography.medium,
    fontSize: FontSize.font_small_E,
    color: color.palette.black,
  },
  bottomHelptxt: {
    textAlign: 'center',
    bottom: 10,
    fontFamily: typography.primary,
    color: color.palette.black,
  },
});
