import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Routes} from '../routes';
import {
  Cart,
  Home,
  Market,
  MyTrade,
  Orders,
  Search,
  Wishlist,
} from '../../screens';
import {PlusIcon} from '../../screens/plusIcon/PlusIcon';
import {TradeBook} from '../../screens/tradeBook/TradeBook';
import {Traders} from '../../screens/traders/Traders';
import {FontSize, color, typography} from '../../theme';
import {useSelector} from 'react-redux';

const BottomTabs = createBottomTabNavigator();
export const BottomTabStack = () => {
  const dashData = useSelector(state => state.dash);
  return (
    <BottomTabs.Navigator
      screenOptions={{
        tabBarStyle: {height: 56, backgroundColor: color.palette.btnColor},
        headerShown: false,
      }}
      backBehavior={'none'}>
      <BottomTabs.Screen
        name={Routes.HOME}
        component={Home}
        options={{
          unmountOnBlur: true,
          tabBarInactiveTintColor: color.palette.brown,
          tabBarActiveTintColor: color.palette.btnColor,
          title: '',
          tabBarIcon: ({focused}) => (
            <View style={styles.tabView}>
              <Image
                source={
                  //   focused
                  //     ? require('../../assets/icon/myTrade.png')
                  require('../../assets/icon/home.png')
                }
                style={{height: 17.34, width: 19.16}}
              />
              <Text
                style={
                  //   focused
                  //     ? [styles.title, {color: color.palette.btnColor}]
                  styles.title
                }>
                {'Home'}
              </Text>
            </View>
          ),
        }}
      />
      <BottomTabs.Screen
        name={Routes.CART}
        component={Cart}
        options={{
          tabBarInactiveTintColor: color.palette.brown,
          tabBarActiveTintColor: color.palette.btnColor,
          unmountOnBlur: true,
          title: '',
          tabBarIcon: ({focused}) => (
            <View style={styles.tabView}>
              <View
                style={{
                  backgroundColor: color.palette.red,
                  paddingHorizontal: 3,
                  paddingVertical: 3,
                  borderRadius: 20,
                  position: 'absolute',
                  left: 15,
                  top: -10,
                  height: 20,
                  width: 20,
                  zIndex: 3,
                }}>
                <Text
                  style={{
                    color: color.palette.white,
                    fontFamily: typography.primary,
                    fontSize: FontSize.font_extra_small_E,
                    textAlign: 'center',
                  }}>
                  {dashData?.cartNumber}
                </Text>
              </View>
              <Image
                source={
                  //   focused
                  //     ? require('../../assets/icon/market.png')
                  require('../../assets/icon/cart.png')
                }
                style={{height: 17.34, width: 19.16}}
              />
              <Text
                style={
                  //   focused
                  //     ? [styles.title, {color: color.palette.btnColor}]
                  styles.title
                }>
                Cart
              </Text>
            </View>
          ),
        }}
      />
      <BottomTabs.Screen
        name={Routes.WISHLIST}
        component={Wishlist}
        options={{
          unmountOnBlur: true,
          title: '',
          tabBarInactiveTintColor: color.palette.brown,
          tabBarActiveTintColor: color.palette.btnColor,
          tabBarIcon: ({focused}) => (
            <View style={styles.tabView}>
              <Image
                source={require('../../assets/icon/whislist.png')}
                style={{height: 17.34, width: 19.16}}
              />
              <Text style={styles.title}>Whislist</Text>
            </View>
          ),
        }}
      />
      <BottomTabs.Screen
        name={Routes.ORDER}
        component={Orders}
        options={{
          unmountOnBlur: true,
          title: '',
          tabBarInactiveTintColor: color.palette.brown,
          tabBarActiveTintColor: color.palette.btnColor,
          tabBarIcon: ({focused}) => (
            <View style={styles.tabView}>
              <Image
                source={
                  //   focused
                  // ? require('../../assets/icon/tradeBook.png')
                  require('../../assets/icon/Order.png')
                }
                style={{height: 18, width: 25}}
              />
              <Text
                style={
                  //   focused
                  //     ? [styles.title, {color: color.palette.btnColor}]
                  styles.title
                }>
                Order's
              </Text>
            </View>
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.primary,
    fontSize: FontSize.font_small_E,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 7,
    color: color.palette.white,
  },
  tabView: {
    //alignSelf: 'center',
    marginTop: 10,
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    height: 29,
    width: 29,
    alignSelf: 'center',
  },
});
