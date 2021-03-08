/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Platform,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import {defaultAddress, updateUser} from '../actions/user.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {TextInput, DefaultTheme} from 'react-native-paper';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {isEmptyArray, isEmptyData, isEmptyObject} from '../helper/CheckEmpty';
import Geocoder from 'react-native-geocoding';
import {selectedAddress} from '../actions/payment.actions';
import {getAddress, getCityAddress} from '../actions/address.action';
import MapView from 'react-native-maps';

class PickCoordinate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: Dimensions.get('window').width,
      latitude: 1.29027,
      longitude: 103.851959,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
      regionChangeProgress: false,
      isMapReady: false,
      userLocation: '',
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount = async () => {
    try {
      try {
        if (
          this.props.userPosition &&
          this.props.userPosition.coords &&
          isEmptyObject(this.props.oldCoordinate)
        ) {
          this.setState({
            latitude: this.props.userPosition.coords.latitude,
            longitude: this.props.userPosition.coords.longitude,
          });
        }

        if (!isEmptyObject(this.props.oldCoordinate)) {
          this.setState({
            latitude: this.props.oldCoordinate.latitude,
            longitude: this.props.oldCoordinate.longitude,
          });
        }
      } catch (e) {}

      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
    await this.setState({loading: false});
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  fetchAddress = () => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        this.state.latitude +
        ',' +
        this.state.longitude +
        '&key=' +
        'AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4',
    )
      .then(response => response.json())
      .then(responseJson => {
        const userLocation = responseJson.results[0].formatted_address;
        this.setState({
          userLocation: userLocation,
          regionChangeProgress: false,
        });
      });
  };

  submitCoordinate = () => {
    try {
      this.props.setCoordinate({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: this.state.latitudeDelta,
        longitudeDelta: this.state.longitudeDelta,
        userLocation: this.state.userLocation,
      });
      Actions.pop();
    } catch (e) {}
  };

  render() {
    const {latitude, longitude, latitudeDelta, longitudeDelta} = this.state;
    return (
      <SafeAreaView style={styles.map}>
        <TouchableOpacity
          style={{position: 'absolute', zIndex: 2}}
          onPress={this.goBack}>
          <Icon
            size={32}
            name={
              Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
            }
            style={{color: colorConfig.pageIndex.grayColor, padding: 15}}
          />
        </TouchableOpacity>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
          }}
          onRegionChangeComplete={region => {
            this.setState(
              {
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
                regionChangeProgress: true,
              },
              () => this.fetchAddress(),
            );
          }}
        />
        <View style={styles.markerFixed}>
          <Image
            style={styles.marker}
            source={{
              uri:
                'https://raw.githubusercontent.com/alizahid/location-picker-demo/master/assets/icons8-marker.png',
            }}
          />
        </View>
        <SafeAreaView style={styles.footer}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Medium',
              marginBottom: 20,
              marginTop: 10,
              textAlign: 'center',
              color: colorConfig.store.defaultColor,
            }}>
            Move map to change location
          </Text>
          <Text style={{fontSize: 10, color: '#999', marginLeft: 10}}>
            LOCATION
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 12,
              paddingVertical: 15,
              borderBottomColor: 'silver',
              borderBottomWidth: 0.5,
              marginHorizontal: 10,
              fontFamily: 'Poppins-Italic',
            }}>
            {!this.state.regionChangeProgress
              ? this.state.userLocation
              : 'Identifying Location...'}
          </Text>
          <TouchableOpacity
            disabled={this.state.regionChangeProgress}
            onPress={this.submitCoordinate}
            style={{
              marginTop: 15,
              backgroundColor: this.state.regionChangeProgress
                ? colorConfig.store.disableButton
                : colorConfig.store.defaultColor,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Poppins-Medium',
                fontSize: 20,
              }}>
              Use This Location
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  userPosition: state.userReducer.userPosition.userPosition,
  userDetail: state.userReducer.getUser.userDetails,
  intlData: state.intlData,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PickCoordinate);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: 48,
    width: 48,
  },
  footer: {
    backgroundColor: 'white',
    bottom: 0,
    position: 'absolute',
    width: '100%',
    borderTopWidth: 0.4,
    borderTopColor: colorConfig.pageIndex.grayColor,
  },
  region: {
    color: '#fff',
    lineHeight: 20,
    margin: 20,
  },
});
