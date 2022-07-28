/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Field, reduxForm} from 'redux-form';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import InputText from '../components/inputText';
import SigninOther from '../components/signinOther';
import {loginUser} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';

const imageWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
  $largeContainerSize: imageWidth,
  $largeImageSize: imageWidth - 50,
  $smallContainerSize: imageWidth / 2,
  $smallImageSize: imageWidth / 4,

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
  },
  logo: {
    width: '$largeImageSize',
  },
  card: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    height: 150,
    width: Dimensions.get('window').width - 40,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 10,
  },
  item1: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item2: {
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  item3: {
    alignItems: 'center',
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    width: 100,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  detail: {
    color: colorConfig.pageIndex.grayColor,
    textAlign: 'center',
  },
  btnText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default class Permition extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  turnOnLocation = async () => {
    console.log('yeee');
    try {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => {
          this.setState({geolocation: true});
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const imageStyle = [styles.logo, {width: this.imageWidth}];
    return (
      <ImageBackground
        source={appConfig.appBackground}
        style={styles.backgroundImage}
        resizeMode="stretch">
        {loginUser && loginUser.isLoading && <Loader />}
        <ScrollView>
          <View style={styles.container}>
            <Animated.Image
              source={appConfig.logoMerchant}
              style={imageStyle}
              resizeMode="contain"
            />
          </View>
          <View style={styles.card}>
            <View style={styles.item1}>
              <Text style={styles.title}>LOCATION NOT FOUND</Text>
            </View>
            <View style={styles.item2}>
              <Text style={styles.detail}>
                Please turn on Location Services. For the best experience,
                please set it to Hight Accuracy
              </Text>
            </View>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <TouchableOpacity
                style={styles.item3}
                onPress={this.turnOnLocation}>
                <Text style={styles.btnText}>TURN ON</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}
