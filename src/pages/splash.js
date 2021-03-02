/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Keyboard,
  Animated,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import {Dimensions} from 'react-native';
import appConfig from '../config/appConfig';
import colorConfig from '../config/colorConfig';
import VersionCheck from 'react-native-version-check';

const imageWidth = Dimensions.get('window').width / 2;

const ANIMATION_DURATION = 100;

const styles = StyleSheet.create({
  $largeContainerSize: imageWidth,
  $largeImageSize: imageWidth - 50,
  $smallContainerSize: imageWidth / 2,
  $smallImageSize: imageWidth / 4,

  container: {
    alignItems: 'center',
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  containerImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '$largeContainerSize',
    height: '$largeContainerSize',
  },
  backgroundImage: {
    paddingTop: 100,
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
  },
  logo: {
    width: '$largeImageSize',
  },
});

export default class Splash extends Component {
  anim = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {};
    this.containerImageWidth = new Animated.Value(styles.$largeContainerSize);
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  componentDidMount() {
    let showListener = 'keyboardWillShow';
    let hideListener = 'keyboardWillHide';
    if (Platform.OS === 'android') {
      showListener = 'keyboardDidShow';
      hideListener = 'keyboardDidHide';
    }
    this.keyboardShowListener = Keyboard.addListener(
      showListener,
      this.keyboardShow,
    );
    this.keyboardHideListener = Keyboard.addListener(
      hideListener,
      this.keyboardHide,
    );
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  keyboardShow = () => {
    Animated.parallel([
      Animated.timing(this.containerImageWidth, {
        toValue: styles.$smallContainerSize,
        duration: ANIMATION_DURATION,
      }),
      Animated.timing(this.imageWidth, {
        toValue: styles.$smallImageSize,
        duration: ANIMATION_DURATION,
      }),
    ]).start();
  };

  keyboardHide = () => {
    Animated.parallel([
      Animated.timing(this.containerImageWidth, {
        toValue: styles.$largeContainerSize,
        duration: ANIMATION_DURATION,
      }),
      Animated.timing(this.imageWidth, {
        toValue: styles.$largeImageSize,
        duration: ANIMATION_DURATION,
      }),
    ]).start();
  };

  render() {
    const containerImageStyle = [
      styles.containerImage,
      {width: '100%', height: '100%'},
    ];
    const imageStyle = [
      styles.logo,
      {width: this.imageWidth, marginBottom: 100},
    ];
    return (
      <View style={styles.container}>
        <Animated.View style={containerImageStyle}>
          <Animated.Image
            source={appConfig.appLogo}
            style={imageStyle}
            resizeMode="contain"
          />
          <Text style={{position: 'absolute', bottom: 30}}>
            Version {VersionCheck.getCurrentVersion()} (
            {VersionCheck.getCurrentBuildNumber()})
          </Text>
        </Animated.View>
      </View>
    );
  }
}
