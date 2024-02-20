import React, {useEffect, useState, memo} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {View} from 'react-native';
import {NetworkConnectionError} from '../screens/NetworkConnectionError';

import {useDispatch} from 'react-redux';

export const NetworkContext = React.createContext({isConnected: true});

export const NetworkConnectionProvider = memo(({children}) => {
  const [isConnected, setIsConnected] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let netinfoUnsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    return netinfoUnsubscribe;
  }, []);

  const handleConnectivityChange = connection => {
    setIsConnected(connection.isConnected);
  };

  const checkNetworkStatus = () => {
    return <View>{!isConnected && <NetworkConnectionError />}</View>;
  };

  return (
    <NetworkContext.Provider value={isConnected}>
      {checkNetworkStatus()}
      {children}
    </NetworkContext.Provider>
  );
});
