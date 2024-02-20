import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  ForgotPassword,
  Login,
  OtpVerification,
  PasswordRequestVerification,
  PasswordReset,
  WelcomeScreen,
} from '../screens';
import {PasswordResetSuccess} from '../screens/auth/PasswordResetSuccess';
import {Routes} from './routes';

const Stack = createStackNavigator();
export const OutsideStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.SIGNIN}
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.OTPVERIFICATION}
        component={OtpVerification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.FORGOTPASSWORD}
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.PASSWORDRESET}
        component={PasswordRequestVerification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.PASSWORDCHANGE}
        component={PasswordReset}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Routes.PASSWORDSUCCESS}
        component={PasswordResetSuccess}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
