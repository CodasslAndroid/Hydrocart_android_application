import DeviceInfo from 'react-native-device-info';
import {NetworkInfo} from 'react-native-network-info';

export const NAVIGATION_PERSISTENCE_KEY = '@ylp_mobile/navigation-state';
export const API_KEY = 'AIzaSyCfVAwhCWh7qPzhJ3FK0UVieoliNaHkR3k';
export const DEVICE_ID = DeviceInfo.getDeviceId();
export const DEVICE_IP_ADDRESS = NetworkInfo.getIPAddress().then(ipAddress => {
  return ipAddress;
});
