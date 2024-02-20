import {useEffect} from 'react';
import RNBootSplash from 'react-native-bootsplash';

export function useHideSplash() {
  useEffect(() => {
    RNBootSplash.hide({fade: true});
  }, []);
}
