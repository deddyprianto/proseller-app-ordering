/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import {AppRegistry, Platform, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {name as appIosName} from './app.ios.json';
console.disableYellowBox = true;

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    assert: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {},
    time: () => {},
    timeEnd: () => {},
  };
}

const handleAppName = () => {
  if (Platform.OS === 'ios') {
    return appIosName;
  }
  return appName;
};

AppRegistry.registerComponent(handleAppName(), () => App);
