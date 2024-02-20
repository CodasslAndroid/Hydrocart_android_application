import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateCartNumber} from '../redux/slices/dashSlice';
import {
  AddAddress,
  AddressList,
  EditProfile,
  FeedBack,
  Home,
  OrderDetails,
  Payment,
  PoliciesPages,
  Profile,
  Search,
} from '../screens';
import {getCartList} from '../services/api';
import {BottomTabStack} from './components/BottomTabStack';
import {Routes} from './routes';

const Stack = createStackNavigator();

export const InsideStack = () => {
  const userData = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const payload = new FormData();
    payload.append('customer_ref_no', userData?.userData?.customer_ref_no);
    getCartList(payload)
      .then(_res => {
        if (_res?.cart === 'Empty Cart') {
          dispatch(updateCartNumber(0));
        } else {
          dispatch(updateCartNumber(_res?.cart?.length));
        }
        // setLoading(false);
      })
      .catch(err => {
        // setLoading(false);
        console.log('err cart', err);
      });
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.BOTTOMSTACK}
        component={BottomTabStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.SEARCH}
        component={Search}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.MANAGE_ACCOUNT}
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.ADDRESS_LIST}
        component={AddressList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.ADD_ADDRESS}
        component={AddAddress}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.FEEDBACK}
        component={FeedBack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.PAYMENT}
        component={Payment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.EDITPROFILE}
        component={EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.ORDERDETAIL}
        component={OrderDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.POLICY_PAGE}
        component={PoliciesPages}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
