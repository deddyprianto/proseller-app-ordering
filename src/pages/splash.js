import React, { Component } from 'react';
import { View, Text, ImageBackground, Keyboard, Animated, Platform, StyleSheet } from 'react-native';

import { Dimensions } from 'react-native';

const imageWidth = Dimensions.get('window').width / 2;

const ANIMATION_DURATION = 100;

const styles = StyleSheet.create({
  $largeContainerSize: imageWidth,
  $largeImageSize: imageWidth-50,
  $smallContainerSize: imageWidth / 2,
  $smallImageSize: imageWidth / 4,

  container: {
    alignItems: 'center',
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
    this.state = {
    };
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
    this.keyboardShowListener = Keyboard.addListener(showListener, this.keyboardShow);
    this.keyboardHideListener = Keyboard.addListener(hideListener, this.keyboardHide);
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
      { width: '100%', height: '100%' },
    ];
    const imageStyle = [styles.logo, { width: this.imageWidth }];
    return (
      <View style={styles.container}>
        <Animated.View style={containerImageStyle}>
          <ImageBackground
            source={require('../assets/img/splash.jpg')}
            style={styles.backgroundImage}
            resizeMode="stretch"
          >
            <Animated.Image
              source={require('../assets/img/logo.png')}
              style={imageStyle}
              resizeMode="contain"
            />
          </ImageBackground>
        </Animated.View>
      </View>
    );
  }
}
