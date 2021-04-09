/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import {AppRegistry, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
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

AppRegistry.registerComponent(appName, () => App);
