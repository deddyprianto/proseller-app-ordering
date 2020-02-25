/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
console.disableYellowBox = true;

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

AppRegistry.registerComponent(appName, () => App);
