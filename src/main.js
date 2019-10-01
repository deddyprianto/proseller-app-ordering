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
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';

import Routes from './config/router';
import Splash from './pages/splash';
import Permition from './pages/permition';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import {loginUser, refreshToken} from './actions/auth.actions';
import Loader from './components/loader';
import colorConfig from './config/colorConfig';
import appConfig from './config/appConfig';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      geolocation: false,
    };
  }

  async componentDidMount() {
    try {
      var dateTokenExp = new Date(this.props.authData.tokenExp);
      var dateNow = new Date();
      var sisaTokenExp = dateTokenExp.getTime() - dateNow.getTime();
      if (sisaTokenExp < 0) {
        await this.props.dispatch(refreshToken());
      }
      console.log('Token Expired: ' + dateTokenExp);
      console.log('Token Now: ' + dateNow);
      const data = await this.performTimeConsumingTask();
      if (data !== null) {
        this.setState({isLoading: false});
      }
      this.turnOnLocation();
    } catch (error) {
      console.log(error);
    }
  }

  turnOnLocation = () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        if (data == 'already-enabled' || data == 'enabled') {
          this.setState({geolocation: true});
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  performTimeConsumingTask = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve('result');
      }, 3000),
    );
  };

  render() {
    const {
      authData: {isLoggedIn},
    } = this.props;
    const imageStyle = [styles.logo, {width: this.imageWidth}];

    if (this.state.isLoading) {
      return <Splash />;
    }

    return (
      <View style={styles.container1}>
        <StatusBar
          backgroundColor={colorConfig.pageIndex.grayColor}
          barStyle="light-content"
        />
        {this.state.geolocation ? (
          <Routes isLoggedIn={isLoggedIn} />
        ) : (
          <ImageBackground
            source={appConfig.appBackground}
            style={styles.backgroundImage}
            resizeMode="stretch">
            {loginUser && loginUser.isLoading && <Loader />}
            <ScrollView>
              <View style={styles.container2}>
                <Animated.Image
                  source={appConfig.appLogo}
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
        )}
      </View>
    );
  }
}

const imageWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
  $largeContainerSize: imageWidth,
  $largeImageSize: imageWidth - 50,
  $smallContainerSize: imageWidth / 2,
  $smallImageSize: imageWidth / 4,

  container1: {
    flex: 1,
  },
  container2: {
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

mapStateToProps = state => ({
  authData: state.authReducer.authData,
});

export default connect(
  mapStateToProps,
  null,
)(Main);
